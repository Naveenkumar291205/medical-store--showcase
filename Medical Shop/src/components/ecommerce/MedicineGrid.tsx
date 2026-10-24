import React from 'react';
import { Medicine } from '../../types/medicine';
import { MedicineCard } from './MedicineCard';
import { ShimmerSkeleton } from '../common/ShimmerSkeleton';
import { SearchX, Sparkles } from 'lucide-react';

interface MedicineGridProps {
  medicines: Medicine[];
  isLoading?: boolean;
  onOpenDetails: (medicine: Medicine) => void;
  onResetFilters?: () => void;
}

export const MedicineGrid: React.FC<MedicineGridProps> = ({
  medicines,
  isLoading = false,
  onOpenDetails,
  onResetFilters
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-3">
            <ShimmerSkeleton className="h-44 w-full rounded-2xl" />
            <ShimmerSkeleton className="h-4 w-1/3 rounded-lg" />
            <ShimmerSkeleton className="h-5 w-4/5 rounded-lg" />
            <ShimmerSkeleton className="h-4 w-1/2 rounded-lg" />
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <ShimmerSkeleton className="h-6 w-20 rounded-lg" />
              <ShimmerSkeleton className="h-10 w-10 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center shadow-soft flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-heading font-bold text-brand-text mb-1">
          No Medicines Matched Your Search
        </h3>
        <p className="text-sm text-brand-muted max-w-md mb-6">
          We couldn't find any medications matching your current filter criteria or search query. Try broadening your keywords.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-2xl bg-brand-blue text-white text-xs font-bold shadow-md shadow-brand-blue/30 hover:bg-brand-blue-dark transition-all"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {medicines.map((medicine) => (
        <MedicineCard
          key={medicine.id}
          medicine={medicine}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
};
