import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, Loader2, Sparkles, FileText, ShieldAlert } from 'lucide-react';
import { OCRStep } from '../../utils/ocrSimulator';

interface OCRProcessingViewProps {
  steps: OCRStep[];
  fileName?: string;
}

export const OCRProcessingView: React.FC<OCRProcessingViewProps> = ({
  steps,
  fileName = 'Prescription_Document.pdf'
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft max-w-xl mx-auto space-y-6">
      
      {/* Laser Scanning Animation Graphic */}
      <div className="relative w-full h-48 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-4 select-none">
        
        {/* Prescription Doc Mock inside Scanner */}
        <div className="relative w-44 h-36 bg-white/90 rounded-xl p-3 shadow-2xl border border-white/40 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <div className="w-8 h-2 bg-brand-blue rounded" />
            <div className="w-12 h-2 bg-slate-300 rounded" />
          </div>
          <div className="space-y-1.5 py-2">
            <div className="w-full h-1.5 bg-slate-300 rounded" />
            <div className="w-4/5 h-1.5 bg-slate-300 rounded" />
            <div className="w-3/4 h-1.5 bg-slate-200 rounded" />
            <div className="w-5/6 h-1.5 bg-slate-300 rounded" />
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-100">
            <div className="w-10 h-2 bg-emerald-500 rounded" />
            <div className="w-6 h-2 bg-slate-300 rounded" />
          </div>
        </div>

        {/* Dynamic Sweeping Laser Line */}
        <motion.div
          animate={{
            top: ['5%', '90%', '5%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: 'easeInOut',
          }}
          className="absolute inset-x-4 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] rounded-full z-10"
        />

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.6)_100%)] pointer-events-none" />

        {/* Status Chip */}
        <div className="absolute bottom-3 left-3 bg-slate-800/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
          <span>SmartPharma AI Neural OCR v4.2</span>
        </div>
      </div>

      {/* OCR Multi-Step Progress Tracker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Scanning Pipeline: {fileName}
          </h4>
          <span className="text-[11px] text-brand-blue font-semibold animate-pulse">
            Processing...
          </span>
        </div>

        <div className="space-y-2.5">
          {steps.map((step) => {
            const isDone = step.status === 'completed';
            const isProcessing = step.status === 'processing';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : isProcessing
                    ? 'bg-blue-50/70 border-brand-blue ring-1 ring-brand-blue/20'
                    : 'bg-slate-50 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isProcessing ? (
                    <Loader2 className="w-4 h-4 text-brand-blue animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isDone ? 'text-emerald-900' : isProcessing ? 'text-brand-blue' : 'text-slate-600'}`}>
                      {step.label}
                    </span>
                    {isDone && (
                      <span className="text-[10px] text-emerald-700 font-bold">Done</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
