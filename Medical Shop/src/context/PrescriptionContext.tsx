import React, { createContext, useContext, useState, useEffect } from 'react';
import { Prescription, ExtractedMedicine, PrescriptionStatus } from '../types/prescription';
import { mockPrescriptions } from '../data/mockPrescriptions';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { OCRStep, simulateOCRExtraction } from '../utils/ocrSimulator';
import { useInventory } from './InventoryContext';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

interface PrescriptionContextType {
  prescriptions: Prescription[];
  activePrescription: Prescription | null;
  setActivePrescription: (rx: Prescription | null) => void;
  isUploading: boolean;
  ocrSteps: OCRStep[];
  uploadAndProcessPrescription: (file: File | { name: string; url?: string }, templateIdx?: number) => Promise<Prescription>;
  approvePrescription: (prescriptionId: string, notes?: string) => void;
  rejectPrescription: (prescriptionId: string, reason: string) => void;
  suggestModifications: (prescriptionId: string, notes: string, modifiedMedicines?: ExtractedMedicine[]) => void;
  updateExtractedMedicine: (prescriptionId: string, extMedId: string, updated: Partial<ExtractedMedicine>) => void;
  getPrescriptionById: (id: string) => Prescription | undefined;
  pendingReviewCount: number;
}

const PrescriptionContext = createContext<PrescriptionContextType | undefined>(undefined);

export const PrescriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { medicines } = useInventory();
  const { showToast } = useNotification();
  const { currentUser } = useAuth();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    return loadFromStorage<Prescription[]>('prescriptions_list', mockPrescriptions);
  });

  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ocrSteps, setOcrSteps] = useState<OCRStep[]>([]);

  useEffect(() => {
    saveToStorage('prescriptions_list', prescriptions);
  }, [prescriptions]);

  const uploadAndProcessPrescription = async (
    file: File | { name: string; url?: string },
    templateIdx: number = 0
  ): Promise<Prescription> => {
    setIsUploading(true);
    setOcrSteps([
      { id: 1, label: 'Document Preprocessing', detail: 'De-skewing and contrast adjustment', status: 'processing' },
      { id: 2, label: 'Handwriting & Text OCR', detail: 'Extracting medical text and doctor signatures', status: 'waiting' },
      { id: 3, label: 'Drug & Dosage Entity Extraction', detail: 'Matching pharmacological database entities', status: 'waiting' },
      { id: 4, label: 'Inventory & Safety Verification', detail: 'Pairing with live pharmacy stock & checking interactions', status: 'waiting' },
    ]);

    try {
      const { prescription: partialRx, extracted } = await simulateOCRExtraction(
        file,
        medicines,
        templateIdx,
        (updatedSteps) => setOcrSteps(updatedSteps)
      );

      const newRx: Prescription = {
        id: `rx-${Date.now()}`,
        userId: currentUser.id,
        patientName: partialRx.patientName || currentUser.name,
        patientAge: partialRx.patientAge || 46,
        patientGender: partialRx.patientGender || 'Female',
        doctorName: partialRx.doctorName || 'Dr. Robert Harrison, MD',
        clinicOrHospital: partialRx.clinicOrHospital || 'City Care Health Institute',
        doctorRegNo: partialRx.doctorRegNo || 'MED-REG-991204',
        issueDate: partialRx.issueDate || new Date().toISOString().split('T')[0],
        imageUrl: (file as any).url || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        status: 'pending_pharmacist_review',
        extractedMedicines: extracted,
        potentialInteractions: []
      };

      setPrescriptions((prev) => [newRx, ...prev]);
      setActivePrescription(newRx);

      showToast({
        type: 'success',
        title: 'OCR Scan Complete',
        message: `Extracted ${extracted.length} medicines. Awaiting pharmacist verification.`
      });

      return newRx;
    } finally {
      setIsUploading(false);
    }
  };

  const approvePrescription = (prescriptionId: string, notes?: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id === prescriptionId) {
          return {
            ...rx,
            status: 'approved',
            pharmacistNotes: notes || 'Prescription verified and clinically approved.',
            verifiedByPharmacistId: currentUser.id,
            verifiedAt: new Date().toISOString()
          };
        }
        return rx;
      })
    );

    showToast({
      type: 'success',
      title: 'Prescription Approved',
      message: `Prescription #${prescriptionId} has been verified and cleared for dispensation.`
    });
  };

  const rejectPrescription = (prescriptionId: string, reason: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id === prescriptionId) {
          return {
            ...rx,
            status: 'rejected',
            rejectionReason: reason,
            verifiedByPharmacistId: currentUser.id,
            verifiedAt: new Date().toISOString()
          };
        }
        return rx;
      })
    );

    showToast({
      type: 'warning',
      title: 'Prescription Rejected',
      message: `Prescription #${prescriptionId} rejected. Reason: ${reason}`
    });
  };

  const suggestModifications = (
    prescriptionId: string,
    notes: string,
    modifiedMedicines?: ExtractedMedicine[]
  ) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id === prescriptionId) {
          return {
            ...rx,
            status: 'modifications_suggested',
            pharmacistNotes: notes,
            extractedMedicines: modifiedMedicines || rx.extractedMedicines,
            verifiedByPharmacistId: currentUser.id,
            verifiedAt: new Date().toISOString()
          };
        }
        return rx;
      })
    );

    showToast({
      type: 'info',
      title: 'Modifications Submitted',
      message: 'Prescription updated with clinical recommendations.'
    });
  };

  const updateExtractedMedicine = (
    prescriptionId: string,
    extMedId: string,
    updated: Partial<ExtractedMedicine>
  ) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id === prescriptionId) {
          return {
            ...rx,
            extractedMedicines: rx.extractedMedicines.map((item) =>
              item.id === extMedId ? { ...item, ...updated } : item
            )
          };
        }
        return rx;
      })
    );
  };

  const getPrescriptionById = (id: string) => {
    return prescriptions.find((rx) => rx.id === id);
  };

  const pendingReviewCount = prescriptions.filter(
    (rx) => rx.status === 'pending_pharmacist_review' || rx.status === 'ocr_processing'
  ).length;

  return (
    <PrescriptionContext.Provider
      value={{
        prescriptions,
        activePrescription,
        setActivePrescription,
        isUploading,
        ocrSteps,
        uploadAndProcessPrescription,
        approvePrescription,
        rejectPrescription,
        suggestModifications,
        updateExtractedMedicine,
        getPrescriptionById,
        pendingReviewCount
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescription = () => {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error('usePrescription must be used within a PrescriptionProvider');
  }
  return context;
};
