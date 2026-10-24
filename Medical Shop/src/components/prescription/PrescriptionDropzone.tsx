import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { samplePrescriptionTemplates } from '../../utils/ocrSimulator';

interface PrescriptionDropzoneProps {
  onFileSelect: (file: File | { name: string; url?: string }, templateIdx?: number) => void;
  isProcessing?: boolean;
}

export const PrescriptionDropzone: React.FC<PrescriptionDropzoneProps> = ({
  onFileSelect,
  isProcessing = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0], 0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0], 0);
    }
  };

  const handlePresetSelect = (idx: number) => {
    const template = samplePrescriptionTemplates[idx];
    const mockFile = {
      name: `${template.name.replace(/\s+/g, '_')}_Rx_2026.pdf`,
      url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'
    };
    onFileSelect(mockFile, idx);
  };

  return (
    <div className="space-y-6">
      
      {/* Interactive Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-brand-blue bg-blue-50/70 scale-[1.01]'
            : 'border-slate-300 hover:border-brand-blue/60 bg-slate-50/60 hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-brand-blue flex items-center justify-center mb-3 shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-base font-heading font-bold text-brand-text mb-1">
            Drag & Drop Prescription Document
          </h4>
          <p className="text-xs text-brand-muted max-w-sm mb-4">
            Supports PNG, JPG, or PDF. Our AI OCR engine will automatically transcribe doctor handwriting and dosage instructions in seconds.
          </p>

          <span className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors">
            Browse File from Computer
          </span>
        </div>
      </div>

      {/* Instant Interactive Presets */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Or Click a Sample Doctor Prescription to Test AI Scanner:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {samplePrescriptionTemplates.map((template, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(idx)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-blue hover:bg-blue-50/30 text-left transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-md">
                  Demo Sample #{idx + 1}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
              </div>
              <h5 className="text-xs font-bold text-brand-text">{template.name}</h5>
              <p className="text-[10px] text-slate-500 mt-0.5">{template.doctor}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Safety & Compliance Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>End-to-End HIPAA Encrypted • Verified by Licensed Pharmacists</span>
      </div>

    </div>
  );
};
