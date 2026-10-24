import React from 'react';
import {
  HeartPulse,
  ShieldAlert,
  Activity,
  Droplet,
  Sparkles,
  Apple,
  Wind,
  Flame,
  ArrowRight
} from 'lucide-react';
import { mockCategories } from '../../data/mockCategories';
import { AnimatedIcon3D } from '../3d/AnimatedIcon3D';
import { ScrollReveal } from '../common/ScrollReveal';

interface CategoryShowcaseProps {
  onSelectCategory: (cat: string) => void;
}

const iconMap: Record<string, any> = {
  HeartPulse,
  ShieldAlert,
  Activity,
  Droplet,
  Sparkles,
  Apple,
  Wind,
  Flame,
};

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
              Therapeutic Specialties
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-brand-text">
              Shop by Medical Condition
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Select a specialized pharmaceutical category to browse verified medications, clinical guides, and OTC essentials.
            </p>
          </div>
        </ScrollReveal>

        {/* 3D Tilt Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockCategories.map((cat, idx) => {
            const Icon = iconMap[cat.icon] || HeartPulse;

            return (
              <ScrollReveal key={cat.id} delay={idx * 0.06}>
                <AnimatedIcon3D>
                  <div
                    onClick={() => onSelectCategory(cat.id)}
                    className="p-5 bg-white rounded-3xl border border-slate-100/90 h-full flex flex-col justify-between group select-none"
                  >
                    <div>
                      {/* Icon container */}
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <h3 className="text-sm font-heading font-bold text-brand-text group-hover:text-brand-blue transition-colors">
                        {cat.name}
                      </h3>

                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-blue">
                      <span>{cat.count}+ Products</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </AnimatedIcon3D>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
