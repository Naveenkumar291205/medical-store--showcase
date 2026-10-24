import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  ShoppingBag,
  User,
  Building2,
  Calendar,
  Sparkles,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Prescription, ExtractedMedicine } from '../../types/prescription';
import { useCart } from '../../context/CartContext';
import { useInventory } from '../../context/InventoryContext';
import { Badge } from '../common/Badge';

interface OCRResultsReviewProps {
  prescription: Prescription;
  onAddToCartSuccess?: () => void;
  onContinueShopping?: () => void;
}

export const OCRResultsReview: React.FC<OCRResultsReviewProps> = ({
  prescription,
  onAddToCartSuccess,
  onContinueShopping
}) => {
  const { addToCart } = useCart();
  const { getMedicineById } = useInventory();
  const [extractedList, setExtractedList] = useState<ExtractedMedicine[]>(
    prescription.extractedMedicines
  );
  const [addedAllSuccess, setAddedAllSuccess] = useState(false);

  const toggleItemSelect = (id: string) => {
    setExtractedList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateQuantity = (id: string, qty: number) => {
    setExtractedList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantityNeeded: Math.max(1, qty) } : item))
    );
  };

  const handleAddSelectedToCart = () => {
    let addedCount = 0;
    extractedList
      .filter((item) => item.selected && item.matchedMedicineId)
      .forEach((item) => {
        const med = getMedicineById(item.matchedMedicineId!);
        if (med) {
          addToCart(med, item.quantityNeeded, prescription.id);
          addedCount++;
        }
      });

    if (addedCount > 0) {
      setAddedAllSuccess(true);
      setTimeout(() => {
        setAddedAllSuccess(false);
        if (onAddToCartSuccess) onAddToCartSuccess();
      }, 1200);
    }
  };

  const selectedCount = extractedList.filter((item) => item.selected).length;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-6">
      
      {/* Header with Verification Score */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-heading font-bold text-brand-text">
              AI Prescription Extraction Results
            </h3>
            <Badge variant="success" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
              High Confidence OCR
            </Badge>
          </div>
          <p className="text-xs text-brand-muted">
            Transcribed from <strong>{prescription.fileName}</strong> • Verify detected dosages before adding to cart.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Status</span>
          <Badge variant="warning" size="sm">
            Pending Pharmacist Final Review
          </Badge>
        </div>
      </div>

      {/* Doctor & Patient Metadata Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <User className="w-4 h-4 text-brand-blue flex-shrink-0" />
          <div>
            <span className="font-bold block">Patient:</span>
            <span className="text-slate-600">{prescription.patientName} ({prescription.patientAge}y, {prescription.patientGender})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <Building2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
          <div>
            <span className="font-bold block">Doctor:</span>
            <span className="text-slate-600">{prescription.doctorName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          <Calendar className="w-4 h-4 text-brand-blue flex-shrink-0" />
          <div>
            <span className="font-bold block">Clinic / Hospital:</span>
            <span className="text-slate-600 truncate max-w-[160px] block">{prescription.clinicOrHospital}</span>
          </div>
        </div>
      </div>

      {/* Detected Medicines List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Detected Medications ({extractedList.length})
          </h4>
          <span className="text-xs text-brand-blue font-semibold">
            {selectedCount} selected for order
          </span>
        </div>

        <div className="space-y-3">
          {extractedList.map((item) => {
            const isMatched = !!item.matchedMedicineId;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.selected
                    ? 'border-brand-blue/60 bg-blue-50/30 shadow-xs'
                    : 'border-slate-200 bg-white opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  
                  {/* Left Checkbox and Details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItemSelect(item.id)}
                      className="w-4 h-4 text-brand-blue rounded border-slate-300 mt-1 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-brand-text truncate">
                          {item.detectedName}
                        </h5>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold">
                          {item.confidence}% Match
                        </span>
                      </div>

                      {/* Dosage instruction */}
                      <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                        <p><strong>Frequency:</strong> {item.frequency}</p>
                        <p><strong>Duration:</strong> {item.duration} {item.notes && `• Note: ${item.notes}`}</p>
                      </div>

                      {/* Inventory Pairing Indicator */}
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {isMatched ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Matched in Pharmacy Stock: <strong>{item.matchedMedicineName}</strong> (${item.matchedPrice?.toFixed(2)}/pack)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Generic equivalent will be confirmed by Pharmacist</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  {isMatched && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-500 font-medium">Packs:</span>
                      <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantityNeeded - 1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantityNeeded}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantityNeeded + 1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {onContinueShopping && (
          <button
            onClick={onContinueShopping}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            Explore More OTC Products
          </button>
        )}

        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={selectedCount === 0}
          onClick={handleAddSelectedToCart}
          className={`px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 text-white shadow-lg transition-all ${
            selectedCount === 0
              ? 'bg-slate-300 cursor-not-allowed'
              : addedAllSuccess
              ? 'bg-emerald-600 shadow-emerald-500/30'
              : 'bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-brand-blue-dark hover:to-indigo-700 shadow-blue-500/25'
          }`}
        >
          {addedAllSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Basket!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add {selectedCount} Selected Medicine(s) to Cart</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>

    </div>
  );
};
