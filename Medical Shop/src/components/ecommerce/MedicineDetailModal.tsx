import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Info,
  Check,
  Plus,
  Minus,
  Building2,
  Package,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Medicine } from '../../types/medicine';
import { MotionModal } from '../common/MotionModal';
import { Badge } from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { getStockStatus } from '../../utils/formatters';

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  isOpen,
  onClose
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'sideEffects' | 'precautions'>('overview');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!medicine) return null;

  const stockInfo = getStockStatus(medicine.stockCount, medicine.reorderPoint);

  const handleAdd = () => {
    if (!stockInfo.isAvailable) return;
    addToCart(medicine, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={medicine.name}
      subtitle={`${medicine.genericName} • ${medicine.strength}`}
    >
      <div className="space-y-6">
        
        {/* Top Product Snapshot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Image Gallery */}
          <div className="md:col-span-5 relative bg-slate-50 rounded-3xl p-4 flex items-center justify-center border border-slate-100">
            <img
              src={medicine.image}
              alt={medicine.name}
              className="w-full h-56 object-cover rounded-2xl shadow-sm"
            />
            {medicine.prescriptionRequired ? (
              <div className="absolute top-6 left-6">
                <Badge variant="warning" size="sm" icon={<FileText className="w-3.5 h-3.5" />}>
                  Prescription Required
                </Badge>
              </div>
            ) : (
              <div className="absolute top-6 left-6">
                <Badge variant="success" size="sm">
                  Over The Counter (OTC)
                </Badge>
              </div>
            )}
          </div>

          {/* Core Info & Actions */}
          <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="primary" size="sm">
                  {medicine.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{medicine.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({medicine.reviewCount} reviews)</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {medicine.description}
              </p>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-2.5 mt-3.5 p-3 bg-slate-50 rounded-2xl text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Package className="w-4 h-4 text-brand-blue" />
                  <span><strong>Form:</strong> {medicine.dosageForm} ({medicine.packSize})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 className="w-4 h-4 text-brand-blue" />
                  <span className="truncate"><strong>Mfg:</strong> {medicine.manufacturer}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-brand-blue" />
                  <span><strong>Expiry:</strong> {medicine.expiryDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span><strong>Batch:</strong> {medicine.batchNumber}</span>
                </div>
              </div>
            </div>

            {/* Pricing and Cart Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Unit Price (incl. VAT)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-brand-text">
                    ${medicine.price.toFixed(2)}
                  </span>
                  {medicine.originalPrice > medicine.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ${medicine.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Quantity incrementer */}
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-xl bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center shadow-sm"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= medicine.stockCount}
                    onClick={() => setQuantity(Math.min(medicine.stockCount, quantity + 1))}
                    className="w-8 h-8 rounded-xl bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={!stockInfo.isAvailable}
                  onClick={handleAdd}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
                    !stockInfo.isAvailable
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : addedSuccess
                      ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                      : 'bg-brand-blue hover:bg-brand-blue-dark text-white shadow-blue-500/30'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add ${ (medicine.price * quantity).toFixed(2) }</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

          </div>
        </div>

        {/* Clinical Tabs Bar */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex border-b border-slate-100 gap-6 text-xs font-bold text-slate-500">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-brand-blue text-brand-blue font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Indications & Dosage
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === 'ingredients'
                  ? 'border-brand-blue text-brand-blue font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Active Composition
            </button>
            <button
              onClick={() => setActiveTab('sideEffects')}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === 'sideEffects'
                  ? 'border-brand-blue text-brand-blue font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Side Effects
            </button>
            <button
              onClick={() => setActiveTab('precautions')}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === 'precautions'
                  ? 'border-brand-blue text-brand-blue font-bold'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Precautions & Safety
            </button>
          </div>

          {/* Tab Contents */}
          <div className="pt-4 text-xs text-slate-700">
            {activeTab === 'overview' && (
              <div className="space-y-3">
                <div>
                  <h5 className="font-bold text-brand-text mb-1">Approved Uses / Indications:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {medicine.indications.map((ind, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-50 text-brand-blue rounded-xl font-medium">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-brand-text mb-1">Administration Guide:</h5>
                  <p className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600">
                    {medicine.dosageInstructions}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-3">
                <h5 className="font-bold text-brand-text mb-1">Pharmacological Actives:</h5>
                <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  {medicine.activeIngredients.map((item, i) => (
                    <div key={i} className="flex justify-between py-1.5 first:pt-0 last:pb-0">
                      <span className="font-semibold text-brand-text">{item.name}</span>
                      <span className="text-brand-blue font-mono font-bold">{item.amount}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  Storage: {medicine.storage}
                </p>
              </div>
            )}

            {activeTab === 'sideEffects' && (
              <div className="space-y-2">
                <h5 className="font-bold text-brand-text mb-1">Possible Adverse Reactions:</h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {medicine.sideEffects.map((effect, i) => (
                    <li key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'precautions' && (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80">
                  <div className="flex items-center gap-2 font-bold text-amber-800 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Special Warnings & Precautions</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-amber-900 mt-1 text-[11px]">
                    {medicine.precautions.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                {medicine.contraindications.length > 0 && (
                  <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200/80">
                    <div className="flex items-center gap-2 font-bold text-rose-800 mb-1">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Contraindications (Do NOT take if)</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-rose-900 mt-1 text-[11px]">
                      {medicine.contraindications.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </MotionModal>
  );
};
