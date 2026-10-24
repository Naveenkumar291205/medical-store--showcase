import React from 'react';
import { Medicine } from '../../types/medicine';
import { MedicineCard } from '../ecommerce/MedicineCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { ArrowRight, Sparkles } from 'lucide-react';

interface BestSellersSectionProps {
  medicines: Medicine[];
  onOpenDetails: (med: Medicine) => void;
  onViewAllShop: () => void;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  medicines,
  onOpenDetails,
  onViewAllShop
}) => {
  const featured = medicines.slice(0, 6);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Patient Favorites</span>
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-brand-text mt-1">
              Best Sellers & Essential Care
            </h2>
          </div>

          <button
            onClick={onViewAllShop}
            className="text-xs font-bold text-brand-blue hover:text-brand-blue-dark flex items-center gap-1 transition-colors"
          >
            <span>View Complete Pharmacy Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Medicine Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((medicine, idx) => (
            <ScrollReveal key={medicine.id} delay={idx * 0.05}>
              <MedicineCard
                medicine={medicine}
                onOpenDetails={onOpenDetails}
              />
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
