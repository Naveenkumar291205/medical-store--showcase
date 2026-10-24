import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Eleanor Vance',
      role: 'Cardiac Care Patient',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      comment: 'The AI OCR scanned my cardiologist’s prescription with complete accuracy. Within 2 hours, my Atorvastatin and Metoprolol arrived with clear dosage markers.',
      rating: 5,
      tag: 'Verified Patient'
    },
    {
      name: 'Dr. Robert Harrison, MD',
      role: 'Cardiologist & Clinic Director',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
      comment: 'As a prescribing physician, SmartPharma gives me immense peace of mind. Their clinical pharmacist verification step catches potential interactions seamlessly.',
      rating: 5,
      tag: 'Prescribing Physician'
    },
    {
      name: 'Marcus Bennett',
      role: 'Diabetes Care Member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      comment: 'The smart auto-refill program ensures I never run out of Glucophage or test strips. The delivery courier is always prompt and professional.',
      rating: 5,
      tag: 'Auto-Refill Subscriber'
    }
  ];

  return (
    <section className="py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
              Trusted by Patients & Clinicians
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-brand-text">
              What Healthcare Consumers Say
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Over 50,000 prescriptions safely dispensed with 4.9/5 satisfaction.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <ScrollReveal key={t.name} delay={idx * 0.08}>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft h-full flex flex-col justify-between space-y-4 relative">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-400 gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{t.tag}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-brand-text">{t.name}</h4>
                    <p className="text-[10px] text-brand-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
