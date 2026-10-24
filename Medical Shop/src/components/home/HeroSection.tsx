import React from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  ArrowRight,
  HeartPulse,
  Clock,
  Pill
} from 'lucide-react';
import { Hero3DScene } from '../3d/Hero3DScene';

interface HeroSectionProps {
  onExploreShop: () => void;
  onOpenUploadModal: () => void;
  onSelectCategory: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreShop,
  onOpenUploadModal,
  onSelectCategory
}) => {
  const quickCategories = [
    'Cardiology',
    'Antibiotics',
    'Pain Relief',
    'Diabetes Care',
    'Vitamins & Supplements'
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-16">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full filter blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-brand-blue text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Next-Gen Smart Pharmacy & AI OCR Dispensation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-brand-text tracking-tight leading-[1.12]">
              Precision Meets Care.{' '}
              <span className="text-gradient-blue">
                Smart Pharmacy for Your Family.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-brand-muted max-w-xl leading-relaxed">
              Order authentic medications, snap and transcribe doctor prescriptions in seconds with neural OCR, and get cold-chain verified therapies delivered to your door in 2 hours.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onOpenUploadModal}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-2.5"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Upload Prescription (AI Scan)</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onExploreShop}
                className="px-7 py-3.5 rounded-2xl bg-white border border-slate-200 hover:border-brand-blue text-slate-800 hover:text-brand-blue font-bold text-sm shadow-soft hover:shadow-soft-hover transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5 text-brand-blue" />
                <span>Browse Medicines</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Quick Category Chips */}
            <div className="pt-3">
              <span className="text-xs text-slate-400 font-semibold block mb-2">
                Popular Healthcare Categories:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className="px-3 py-1 bg-white hover:bg-blue-50 border border-slate-200/80 hover:border-brand-blue text-xs font-semibold text-slate-700 hover:text-brand-blue rounded-xl transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust metrics row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/70">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-brand-text font-heading">2 Hours</div>
                <div className="text-[11px] text-slate-500 font-medium">Express Courier Delivery</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-brand-text font-heading">100%</div>
                <div className="text-[11px] text-slate-500 font-medium">Authentic & Verified</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-brand-text font-heading">24 / 7</div>
                <div className="text-[11px] text-slate-500 font-medium">Doctor / Pharmacist Care</div>
              </div>
            </div>

          </motion.div>

          {/* Right Hero 3D Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <Hero3DScene />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
