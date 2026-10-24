import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, ShieldCheck, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

interface PrescriptionBannerProps {
  onOpenUploadModal: () => void;
}

export const PrescriptionBanner: React.FC<PrescriptionBannerProps> = ({ onOpenUploadModal }) => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative rounded-3xl bg-gradient-to-r from-brand-blue-dark via-brand-blue to-indigo-700 p-8 sm:p-12 text-white shadow-soft-lg overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Ambient glowing circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full filter blur-3xl pointer-events-none" />

            {/* Left Content */}
            <div className="space-y-4 max-w-xl text-left z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Optical Character Recognition v4.2</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight">
                Have a Doctor's Prescription? Scan & Order in 30 Seconds.
              </h2>

              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Skip deciphering doctor handwriting. Simply photograph or upload your script. Our neural AI extracts medications, calculates accurate refill dosages, and passes it directly to our licensed clinical pharmacist.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-100 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant Dosage Detection</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Automated Refill Reminders</span>
                </span>
              </div>
            </div>

            {/* Right Upload CTA Box */}
            <div className="z-10 w-full lg:w-auto flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenUploadModal}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-brand-blue font-heading font-extrabold text-sm shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3"
              >
                <UploadCloud className="w-5 h-5 text-brand-blue" />
                <span>Upload Doctor Prescription</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <span className="text-[11px] text-blue-200 mt-2">
                Supports JPG, PNG, PDF • Zero fee for OCR scan
              </span>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
