import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ShieldAlert, FileText, Check, Plus, Eye } from 'lucide-react';
import { Medicine } from '../../types/medicine';
import { useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';
import { getStockStatus } from '../../utils/formatters';

interface MedicineCardProps {
  medicine: Medicine;
  onOpenDetails: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onOpenDetails }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const stockInfo = getStockStatus(medicine.stockCount, medicine.reorderPoint);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!stockInfo.isAvailable) return;

    addToCart(medicine, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      onClick={() => onOpenDetails(medicine)}
      className="group relative bg-white rounded-3xl p-4 border border-slate-100 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top badges bar */}
      <div className="flex items-center justify-between gap-1.5 mb-3">
        {medicine.prescriptionRequired ? (
          <Badge variant="warning" size="sm" icon={<FileText className="w-3 h-3" />}>
            Rx Required
          </Badge>
        ) : (
          <Badge variant="success" size="sm">
            OTC
          </Badge>
        )}

        <Badge
          variant={
            medicine.stockCount <= 0
              ? 'danger'
              : medicine.stockCount <= medicine.reorderPoint
              ? 'warning'
              : 'neutral'
          }
          size="sm"
          dot
        >
          {medicine.stockCount <= 0 ? 'Out of Stock' : `${medicine.stockCount} left`}
        </Badge>
      </div>

      {/* Product Image with Quick View overlay */}
      <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-50 mb-3 flex items-center justify-center p-2">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Button on hover */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center">
          <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-bold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-brand-blue" />
            Quick View
          </span>
        </div>

        {/* Discount tag */}
        {medicine.originalPrice > medicine.price && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {Math.round(((medicine.originalPrice - medicine.price) / medicine.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-brand-muted font-medium mb-0.5 uppercase tracking-wider">
            {medicine.category}
          </div>

          <h4 className="text-sm font-heading font-bold text-brand-text group-hover:text-brand-blue transition-colors line-clamp-1">
            {medicine.name}
          </h4>

          <p className="text-xs text-slate-500 italic line-clamp-1 mt-0.5">
            {medicine.genericName} • {medicine.strength}
          </p>

          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            {medicine.packSize}
          </p>
        </div>

        {/* Rating and Price section */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mb-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{medicine.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({medicine.reviewCount})</span>
            </div>
            
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-brand-text">
                ${medicine.price.toFixed(2)}
              </span>
              {medicine.originalPrice > medicine.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${medicine.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart button with animated morph */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            disabled={!stockInfo.isAvailable}
            onClick={handleAddToCart}
            className={`p-2.5 rounded-2xl transition-all duration-200 flex items-center justify-center ${
              !stockInfo.isAvailable
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-brand-blue-light text-brand-blue hover:bg-brand-blue hover:text-white shadow-sm'
            }`}
            title="Add to Cart"
          >
            {isAdded ? (
              <Check className="w-5 h-5" />
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
