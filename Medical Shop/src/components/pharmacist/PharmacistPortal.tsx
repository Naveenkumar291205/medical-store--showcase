import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Search,
  Eye,
  User,
  Building2,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { usePrescription } from '../../context/PrescriptionContext';
import { Prescription } from '../../types/prescription';
import { PrescriptionReviewModal } from './PrescriptionReviewModal';
import { DispenseSimulator } from './DispenseSimulator';
import { Badge } from '../common/Badge';
import { getPrescriptionStatusBadge, formatDate } from '../../utils/formatters';

export const PharmacistPortal: React.FC = () => {
  const {
    prescriptions,
    approvePrescription,
    rejectPrescription,
    suggestModifications,
    pendingReviewCount
  } = usePrescription();

  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchDocOrPatient, setSearchDocOrPatient] = useState('');

  const filteredList = prescriptions.filter((rx) => {
    if (filterStatus !== 'all' && rx.status !== filterStatus) return false;
    if (searchDocOrPatient.trim()) {
      const q = searchDocOrPatient.toLowerCase();
      const matchDoc = rx.doctorName.toLowerCase().includes(q);
      const matchPatient = rx.patientName.toLowerCase().includes(q);
      const matchClinic = rx.clinicOrHospital.toLowerCase().includes(q);
      if (!matchDoc && !matchPatient && !matchClinic) return false;
    }
    return true;
  });

  const approvedCount = prescriptions.filter((rx) => rx.status === 'approved').length;

  return (
    <div className="space-y-8">
      
      {/* Pharmacist Cockpit Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 text-emerald-300 border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Stethoscope className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold">
                Pharmacist Dispensation Cockpit
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold">
                Licensed Staff RPh
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-1">
              Verify AI-extracted prescription line items, screen drug interactions, and authorize temperature-controlled dispensation.
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/15 text-center">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold block">Pending Review</span>
            <span className="text-xl font-bold font-heading text-amber-300">{pendingReviewCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/15 text-center">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold block">Approved Today</span>
            <span className="text-xl font-bold font-heading text-emerald-300">{approvedCount}</span>
          </div>
        </div>
      </div>

      {/* Prescription Verification Queue */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-5">
        
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-heading font-bold text-brand-text">
              Prescription Ingestion & Verification Queue
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Review OCR detections and approve orders before cold-chain packing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchDocOrPatient}
                onChange={(e) => setSearchDocOrPatient(e.target.value)}
                placeholder="Search patient, doctor..."
                className="text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            {/* Filter pills */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
            >
              <option value="all">All Prescriptions</option>
              <option value="pending_pharmacist_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="modifications_suggested">Modified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Queue List */}
        <div className="divide-y divide-slate-100">
          {filteredList.map((rx) => {
            const badge = getPrescriptionStatusBadge(rx.status);
            const isPending = rx.status === 'pending_pharmacist_review';

            return (
              <div
                key={rx.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50/50 rounded-2xl px-2 transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <img
                    src={rx.imageUrl}
                    alt={rx.fileName}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-brand-text truncate">
                        {rx.patientName} ({rx.patientAge}y, {rx.patientGender})
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Doctor: <strong>{rx.doctorName}</strong> • {rx.clinicOrHospital} (Reg #{rx.doctorRegNo})
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-600">
                      <span>Uploaded: <strong>{formatDate(rx.uploadedAt)}</strong></span>
                      <span>•</span>
                      <span>{rx.extractedMedicines.length} medications detected</span>
                    </div>
                  </div>
                </div>

                {/* Review button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRx(rx)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all ${
                      isPending
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isPending ? 'Review & Verify Rx' : 'View Clinical Record'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Barcode & Batch Dispense Simulator */}
      <DispenseSimulator />

      {/* Side-by-side Review Modal */}
      <PrescriptionReviewModal
        prescription={selectedRx}
        isOpen={!!selectedRx}
        onClose={() => setSelectedRx(null)}
        onApprove={approvePrescription}
        onReject={rejectPrescription}
        onSuggestModifications={suggestModifications}
      />

    </div>
  );
};
