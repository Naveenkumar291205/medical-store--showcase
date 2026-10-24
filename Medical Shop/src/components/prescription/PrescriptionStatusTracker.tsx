import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  ShoppingBag,
  Stethoscope,
  Calendar,
  Building2,
  UserCheck
} from 'lucide-react';
import { Prescription } from '../../types/prescription';
import { usePrescription } from '../../context/PrescriptionContext';
import { useCart } from '../../context/CartContext';
import { useInventory } from '../../context/InventoryContext';
import { Badge } from '../common/Badge';
import { getPrescriptionStatusBadge } from '../../utils/formatters';
import { MotionModal } from '../common/MotionModal';

export const PrescriptionStatusTracker: React.FC = () => {
  const { prescriptions } = usePrescription();
  const { addToCart } = useCart();
  const { getMedicineById } = useInventory();
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const handleReorder = (rx: Prescription) => {
    rx.extractedMedicines.forEach((item) => {
      if (item.matchedMedicineId) {
        const med = getMedicineById(item.matchedMedicineId);
        if (med) {
          addToCart(med, item.quantityNeeded, rx.id);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-heading font-bold text-brand-text">
            My Prescriptions & Approvals
          </h3>
          <p className="text-xs text-brand-muted mt-0.5">
            Track verification status, pharmacist clinical annotations, and active valid scripts.
          </p>
        </div>

        <Badge variant="primary" size="md">
          {prescriptions.length} Prescriptions on Record
        </Badge>
      </div>

      {/* Prescriptions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {prescriptions.map((rx) => {
          const badgeInfo = getPrescriptionStatusBadge(rx.status);

          return (
            <motion.div
              key={rx.id}
              whileHover={{ y: -3 }}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Status & Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-bold flex items-center gap-1.5 ${badgeInfo.color}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{badgeInfo.label}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    #{rx.id}
                  </span>
                </div>

                {/* Doctor & Clinic */}
                <h4 className="text-sm font-heading font-bold text-brand-text">
                  {rx.doctorName}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rx.clinicOrHospital}</span>
                </p>

                {/* Patient details */}
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2 py-1.5 border-y border-slate-100">
                  <span>Patient: <strong>{rx.patientName}</strong></span>
                  <span>Issued: <strong>{rx.issueDate}</strong></span>
                </div>

                {/* Extracted medicines preview */}
                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Prescribed Medicines:
                  </span>
                  <div className="space-y-1">
                    {rx.extractedMedicines.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-slate-50 rounded-xl">
                        <span className="font-semibold text-brand-text truncate">{item.detectedName}</span>
                        <span className="text-[11px] text-brand-blue font-mono">{item.frequency}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pharmacist Note callout */}
                {rx.pharmacistNotes && (
                  <div className="mt-3 p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-brand-text flex items-start gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-brand-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-brand-blue">Pharmacist Note:</strong> {rx.pharmacistNotes}
                    </div>
                  </div>
                )}

                {/* Rejection Note */}
                {rx.status === 'rejected' && rx.rejectionReason && (
                  <div className="mt-3 p-2.5 bg-red-50 rounded-xl border border-red-200 text-[11px] text-red-800 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Reason for Rejection:</strong> {rx.rejectionReason}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedRx(rx)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Script</span>
                </button>

                {rx.status === 'approved' && (
                  <button
                    onClick={() => handleReorder(rx)}
                    className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Refill from Rx</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Inspect Prescription Document Modal */}
      <MotionModal
        isOpen={!!selectedRx}
        onClose={() => setSelectedRx(null)}
        title="Prescription Document Inspector"
        subtitle={selectedRx ? `${selectedRx.fileName} • Issued by ${selectedRx.doctorName}` : undefined}
        maxWidth="2xl"
      >
        {selectedRx && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 max-h-96 flex items-center justify-center">
              <img
                src={selectedRx.imageUrl}
                alt="Prescription Scan"
                className="w-full h-auto object-contain max-h-96"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor Registration:</span>
                <span className="font-mono font-bold text-slate-800">{selectedRx.doctorRegNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Status:</span>
                <span className="font-bold capitalize text-brand-blue">{selectedRx.status.replace('_', ' ')}</span>
              </div>
              {selectedRx.verifiedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Verified Timestamp:</span>
                  <span className="font-mono text-slate-700">{new Date(selectedRx.verifiedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </MotionModal>

    </div>
  );
};
