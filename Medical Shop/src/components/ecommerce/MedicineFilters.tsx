import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';
import { mockCategories } from '../../data/mockCategories';
import { useInventory } from '../../context/InventoryContext';

export const MedicineFilters: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    prescriptionFilter,
    setPrescriptionFilter,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    totalProductsCount,
    filteredMedicines
  } = useInventory();

  const handleReset = () => {
    setSelectedCategory('All');
    setPrescriptionFilter('all');
    setInStockOnly(false);
    setSortBy('popularity');
  };

  return (
    <aside className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-heading font-bold text-brand-text text-base">
          <Filter className="w-4 h-4 text-brand-blue" />
          <span>Filters</span>
          <span className="text-xs text-brand-muted font-normal">
            ({filteredMedicines.length} of {totalProductsCount})
          </span>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-semibold text-brand-blue hover:text-brand-blue-dark flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort Results By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        >
          <option value="popularity">Most Popular / Best Sellers</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Highest Customer Rating</option>
          <option value="name">Alphabetical (A - Z)</option>
        </select>
      </div>

      {/* Prescription Requirement Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Prescription Type
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setPrescriptionFilter('all')}
            className={`py-1.5 rounded-xl transition-all ${
              prescriptionFilter === 'all'
                ? 'bg-white text-brand-blue shadow-sm font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setPrescriptionFilter('rx_only')}
            className={`py-1.5 rounded-xl transition-all ${
              prescriptionFilter === 'rx_only'
                ? 'bg-white text-brand-blue shadow-sm font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            Rx Only
          </button>
          <button
            onClick={() => setPrescriptionFilter('otc_only')}
            className={`py-1.5 rounded-xl transition-all ${
              prescriptionFilter === 'otc_only'
                ? 'bg-white text-brand-blue shadow-sm font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            OTC Only
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Therapeutic Category
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === 'All'
                ? 'bg-blue-50 text-brand-blue font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'All' && <Check className="w-3.5 h-3.5 text-brand-blue" />}
          </button>

          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-50 text-brand-blue font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Availability Toggle */}
      <div className="pt-3 border-t border-slate-100">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-slate-700">In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 text-brand-blue rounded border-slate-300 focus:ring-brand-blue"
          />
        </label>
      </div>

      {/* Health Info Callout */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 text-xs text-brand-text">
        <div className="flex items-center gap-1.5 font-bold text-brand-blue mb-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Doctor Consultation</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Need a prescription refill or dosage check? Our licensed pharmacist is available 24/7.
        </p>
      </div>

    </aside>
  );
};
