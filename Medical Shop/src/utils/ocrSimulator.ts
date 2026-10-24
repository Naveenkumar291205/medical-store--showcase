import { ExtractedMedicine, Prescription } from '../types/prescription';
import { Medicine } from '../types/medicine';

export interface OCRStep {
  id: number;
  label: string;
  detail: string;
  status: 'waiting' | 'processing' | 'completed';
}

export const samplePrescriptionTemplates = [
  {
    name: 'Cardiology & Statin Therapy',
    doctor: 'Dr. Robert Harrison, MD, FACC',
    clinic: 'Metropolitan Heart Institute',
    docReg: 'MED-REG-8829104',
    medicines: [
      {
        detectedName: 'Atorvastatin Tab 20mg',
        detectedDosage: '20mg',
        frequency: '1 tablet once daily at bedtime',
        duration: '30 days',
        confidence: 98,
        matchTargetName: 'CardioMax Atorvastatin',
        quantityNeeded: 2,
        notes: 'Hyperlipidemia management'
      },
      {
        detectedName: 'Metoprolol Succinate 50mg',
        detectedDosage: '50mg',
        frequency: '1 tablet in the morning',
        duration: '30 days',
        confidence: 95,
        matchTargetName: 'Metoprolol Succinate ER',
        quantityNeeded: 1,
        notes: 'Blood pressure and pulse regulation'
      }
    ]
  },
  {
    name: 'Respiratory & Bronchial Infection',
    doctor: 'Dr. Anita Desai, MD (Pulmonology)',
    clinic: 'City Chest & Allergy Care',
    docReg: 'MED-REG-4410293',
    medicines: [
      {
        detectedName: 'AmoxiClav 625 Duo',
        detectedDosage: '625mg',
        frequency: '1 tablet every 12 hours after food',
        duration: '5 days',
        confidence: 97,
        matchTargetName: 'AmoxiClav Duo Forte',
        quantityNeeded: 1,
        notes: 'Bacterial chest congestion'
      },
      {
        detectedName: 'Ventolin Inhaler 100mcg',
        detectedDosage: '100mcg',
        frequency: '2 puffs as needed for wheezing',
        duration: '1 canister',
        confidence: 93,
        matchTargetName: 'Ventolin HFA Inhaler',
        quantityNeeded: 1,
        notes: 'Emergency bronchodilator'
      },
      {
        detectedName: 'CofClear Syrup',
        detectedDosage: '10ml',
        frequency: '10ml thrice daily after meals',
        duration: '7 days',
        confidence: 91,
        matchTargetName: 'CofClear Expectorant Syrup',
        quantityNeeded: 1,
        notes: 'Mucus thinning'
      }
    ]
  },
  {
    name: 'Metabolic & Glycemic Care',
    doctor: 'Dr. Marcus Bennett, MD (Endocrinology)',
    clinic: 'Diabetes & Metabolism Institute',
    docReg: 'MED-REG-9918231',
    medicines: [
      {
        detectedName: 'Glucophage XR 1000mg',
        detectedDosage: '1000mg',
        frequency: '1 tablet daily with dinner',
        duration: '30 days',
        confidence: 96,
        matchTargetName: 'Glucophage XR 1000',
        quantityNeeded: 1,
        notes: 'Type 2 Diabetes glycemic control'
      },
      {
        detectedName: 'Jardiance 25mg',
        detectedDosage: '25mg',
        frequency: '1 tablet once daily in the morning',
        duration: '28 days',
        confidence: 94,
        matchTargetName: 'Jardiance 25',
        quantityNeeded: 1,
        notes: 'Cardio-renal protection'
      }
    ]
  }
];

export const simulateOCRExtraction = async (
  file: File | { name: string; url?: string },
  inventory: Medicine[],
  templateIndex: number = 0,
  onStepUpdate?: (steps: OCRStep[]) => void
): Promise<{ prescription: Partial<Prescription>; extracted: ExtractedMedicine[] }> => {
  const steps: OCRStep[] = [
    { id: 1, label: 'Document Preprocessing', detail: 'De-skewing, noise reduction, and contrast enhancement', status: 'processing' },
    { id: 2, label: 'Handwriting & Text OCR', detail: 'Extracting medical text and doctor signatures', status: 'waiting' },
    { id: 3, label: 'Drug & Dosage Entity Extraction', detail: 'Matching pharmacological database entities', status: 'waiting' },
    { id: 4, label: 'Inventory & Safety Verification', detail: 'Pairing with live pharmacy stock & checking interactions', status: 'waiting' },
  ];

  const update = (idx: number, status: 'processing' | 'completed') => {
    steps[idx].status = status;
    if (onStepUpdate) onStepUpdate([...steps]);
  };

  // Step 1: Preprocessing
  update(0, 'processing');
  await new Promise((r) => setTimeout(r, 700));
  update(0, 'completed');

  // Step 2: OCR Text
  update(1, 'processing');
  await new Promise((r) => setTimeout(r, 900));
  update(1, 'completed');

  // Step 3: Entity Extraction
  update(2, 'processing');
  await new Promise((r) => setTimeout(r, 800));
  update(2, 'completed');

  // Step 4: Inventory Pairing
  update(3, 'processing');
  await new Promise((r) => setTimeout(r, 600));

  const selectedTemplate = samplePrescriptionTemplates[templateIndex % samplePrescriptionTemplates.length];

  const extracted: ExtractedMedicine[] = selectedTemplate.medicines.map((item, idx) => {
    const matched = inventory.find((m) =>
      m.name.toLowerCase().includes(item.matchTargetName.toLowerCase()) ||
      item.matchTargetName.toLowerCase().includes(m.name.toLowerCase())
    );

    return {
      id: `ext-${Date.now()}-${idx}`,
      detectedName: item.detectedName,
      detectedDosage: item.detectedDosage,
      frequency: item.frequency,
      duration: item.duration,
      confidence: item.confidence,
      matchedMedicineId: matched?.id,
      matchedMedicineName: matched?.name,
      matchedStrength: matched?.strength,
      matchedPrice: matched?.price,
      matchedPackSize: matched?.packSize,
      quantityNeeded: item.quantityNeeded,
      selected: true,
      notes: item.notes
    };
  });

  update(3, 'completed');

  return {
    prescription: {
      patientName: 'Eleanor Vance',
      patientAge: 46,
      patientGender: 'Female',
      doctorName: selectedTemplate.doctor,
      clinicOrHospital: selectedTemplate.clinic,
      doctorRegNo: selectedTemplate.docReg,
      issueDate: new Date().toISOString().split('T')[0],
      fileName: file.name,
      status: 'pending_pharmacist_review',
    },
    extracted
  };
};
