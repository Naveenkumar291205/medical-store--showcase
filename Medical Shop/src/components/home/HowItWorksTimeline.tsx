import React from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  Cpu,
  Stethoscope,
  Package,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const HowItWorksTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Snap & Upload Prescription',
      desc: 'Drag & drop your handwritten doctor slip or PDF. Our AI OCR neural network transcribes medicines and dosage schedules instantly.',
      icon: UploadCloud,
      badge: 'Instant AI Ingestion'
    },
    {
      num: '02',
      title: 'Smart Catalog Pairing',
      desc: 'Extracted drugs are matched directly to authentic, in-stock inventory with transparent generic savings and dosage recommendations.',
      icon: Cpu,
      badge: 'Auto-Matched'
    },
    {
      num: '03',
      title: 'Pharmacist Safety Review',
      desc: 'A licensed PharmD reviews your script against state medical registries, screens for drug-drug interactions, and authorizes dispensation.',
      icon: Stethoscope,
      badge: '100% Doctor Verified'
    },
    {
      num: '04',
      title: 'Cold-Chain Packing',
      desc: 'Medications are packed in temperature-monitored, tamper-evident safety packaging with individualized intake instructions.',
      icon: Package,
      badge: 'FDA Standards'
    },
    {
      num: '05',
      title: '2-Hour Express Delivery',
      desc: 'Real-time GPS tracking from our localized micro-hub right to your doorstep with doorstep verification code.',
      icon: Truck,
      badge: 'Doorstep Courier'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50/80 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
              The SmartPharma Care Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-text">
              How SmartPharma Works
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              From handwritten doctor prescription to verified delivery in five seamless, technologically assured steps.
            </p>
          </div>
        </ScrollReveal>

        {/* 5-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <ScrollReveal key={step.num} delay={idx * 0.08}>
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all duration-300 h-full flex flex-col justify-between space-y-4 relative group">
                  
                  {/* Step Number watermarked */}
                  <span className="absolute top-3 right-4 font-heading font-extrabold text-2xl text-slate-200 group-hover:text-blue-200 transition-colors select-none">
                    {step.num}
                  </span>

                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 mb-2 inline-block">
                      {step.badge}
                    </span>

                    <h3 className="text-sm font-heading font-bold text-brand-text group-hover:text-brand-blue transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verified Milestone</span>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
