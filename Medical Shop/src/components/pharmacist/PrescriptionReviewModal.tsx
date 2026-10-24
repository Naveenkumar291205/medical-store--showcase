import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Building2,
  Calendar,
  ShieldCheck,
  Stethoscope,
  Edit3,
  MessageSquare
} from 'lucide-react';
import { Prescription, ExtractedMedicine } from '../../types/prescription';
import { MotionModal } from '../common/MotionModal';
import { DrugInteractionChecker } from './DrugInteractionChecker';
import { Badge } from '../common/Badge';

interface PrescriptionReviewModalProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (prescriptionId: string, notes?: string) => void;
  onReject: (prescriptionId: string, reason: string) => void;
  onSuggestModifications: (prescriptionId: string, notes: string, modified: ExtractedMedicine[]) => void;
}

export const PrescriptionReviewModal: React.FC<PrescriptionReviewModalProps> = ({
  prescription,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onSuggestModifications
}) => {
  const [pharmacistNote, setPharmacistNote] = useState('Prescription verified with medical registry. Clinical dosage and safety approved for dispensation.');
  const [rejectionReason, setRejectionReason] = useState('Prescription expired or illegible doctor registration seal.');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!prescription) return null;

  const handleApprove = () => {
    onApprove(prescription.id, pharmacistNote);
    onClose();
  };

  const handleReject = () => {
    onReject(prescription.id, rejectionReason);
    setIsRejecting(false);
    onClose();
  };

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={`Clinical Verification: Rx #${prescription.id}`}
      subtitle={`Patient: ${prescription.patientName} • Prescribing Physician: ${prescription.doctorName}`}
    >
      <div className="space-y-6">
        
        {/* Side-by-side Doctor Scan and OCR Extraction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Original Prescription Document */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Original Doctor Prescription Image:
            </span>
            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 max-h-80 flex items-center justify-center p-2 relative group">
              <img
                src={prescription.imageUrl}
                alt="Prescription Document"
                className="w-full h-auto object-contain max-h-76 rounded-xl"
              />
              <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] rounded backdrop-blur-sm font-mono">
                {prescription.fileName}
              </span>
            </div>

            {/* Doctor Registry Validation Box */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Doctor License:</span>
                <span className="font-mono text-brand-blue font-bold">{prescription.doctorRegNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Hospital/Clinic:</span>
                <span className="text-slate-600 truncate max-w-[150px]">{prescription.clinicOrHospital}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-700 font-bold pt-1 border-t border-slate-200">
                <span>Medical Registry Status:</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active & Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Extracted Medications & Verification List */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Extracted Line Items for Dispensation:
            </span>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {prescription.extractedMedicines.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs space-y-1"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-brand-text text-sm">{item.detectedName}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[10px]">
                      {item.confidence}% Match
                    </span>
                  </div>
                  <p className="text-slate-600">
                    <strong>Schedule:</strong> {item.frequency} • <strong>Duration:</strong> {item.duration}
                  </p>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>Matched Product: <strong className="text-brand-blue">{item.matchedMedicineName || 'Pending Substitution'}</strong></span>
                    <span>Quantity: <strong>{item.quantityNeeded} pack(s)</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Drug Interaction Verification Module */}
            <DrugInteractionChecker prescription={prescription} />

            {/* Pharmacist Clinical Guidance Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-blue" />
                <span>Pharmacist Consultation Note for Patient:</span>
              </label>
              <textarea
                value={pharmacistNote}
                onChange={(e) => setPharmacistNote(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                placeholder="Add special intake warnings, food interaction guidelines, or storage advice..."
              />
            </div>

          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {isRejecting ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Specify rejection reason..."
                className="text-xs flex-1 p-2 bg-red-50 border border-red-200 rounded-xl text-red-900"
              />
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => setIsRejecting(false)}
                className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsRejecting(true)}
                className="px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Prescription</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSuggestModifications(prescription.id, pharmacistNote, prescription.extractedMedicines);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Request Doctor Clarification</span>
                </button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleApprove}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approve & Authorize Dispensation</span>
                </motion.button>
              </div>
            </>
          )}
        </div>

      </div>
    </MotionModal>
  );
};
