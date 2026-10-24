import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  FileText,
  Tag,
  ShieldCheck,
  Zap,
  Truck,
  Check,
  UploadCloud,
  X
} from 'lucide-react';
import { MotionDrawer } from '../common/MotionDrawer';
import { useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';

interface CartDrawerProps {
  onOpenCheckout: () => void;
  onOpenUploadModal: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onOpenCheckout,
  onOpenUploadModal
}) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountCode,
    discountAmount,
    discountPercentage,
    applyDiscountCode,
    removeDiscountCode,
    deliveryType,
    setDeliveryType,
    deliveryFee,
    taxAmount,
    totalAmount,
    hasPrescriptionRequiredItems
  } = useCart();

  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    if (applyDiscountCode(promoInput)) {
      setPromoInput('');
    }
  };

  return (
    <MotionDrawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      title="Your Medicine Basket"
      subtitle={`${items.length} item${items.length === 1 ? '' : 's'} in order`}
      width="md"
    >
      {items.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-16">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h4 className="text-base font-heading font-bold text-brand-text mb-1">
            Your Basket is Empty
          </h4>
          <p className="text-xs text-brand-muted max-w-xs mb-6">
            Browse our pharmacy inventory or upload your doctor's prescription to automatically fill your cart.
          </p>
          <button
            onClick={() => setIsCartOpen(false)}
            className="px-6 py-2.5 rounded-2xl bg-brand-blue text-white text-xs font-bold shadow-md shadow-brand-blue/20 hover:bg-brand-blue-dark transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between space-y-6">
          
          {/* Prescription Warning Banner if Rx items present */}
          {hasPrescriptionRequiredItems && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <span className="font-bold text-amber-800 block">Prescription Required</span>
                <p className="text-amber-700 text-[11px] mt-0.5">
                  Some items require a valid doctor prescription. You can attach one during checkout or upload now.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onOpenUploadModal();
                  }}
                  className="mt-2 text-[11px] font-bold text-brand-blue hover:underline flex items-center gap-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Rx Document</span>
                </button>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.medicine.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="py-3.5 first:pt-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.medicine.image}
                      alt={item.medicine.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-brand-text truncate">
                        {item.medicine.name}
                      </h5>
                      <p className="text-[11px] text-brand-muted truncate">
                        {item.medicine.strength} • {item.medicine.packSize}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-brand-blue">
                          ${(item.medicine.price * item.quantity).toFixed(2)}
                        </span>
                        {item.prescriptionRequired && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 font-bold rounded">
                            Rx
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                      <button
                        onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.medicine.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Delivery Speed Selection */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Select Delivery Option:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeliveryType('standard')}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-start gap-2 ${
                  deliveryType === 'standard'
                    ? 'border-brand-blue bg-blue-50/60 font-semibold text-brand-blue'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Truck className="w-4 h-4 mt-0.5" />
                <div>
                  <div className="font-bold">Standard 24h</div>
                  <div className="text-[10px] text-slate-500">{subtotal > 35 ? 'Free' : '$3.50'}</div>
                </div>
              </button>

              <button
                onClick={() => setDeliveryType('express')}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-start gap-2 ${
                  deliveryType === 'express'
                    ? 'border-brand-blue bg-blue-50/60 font-semibold text-brand-blue'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Zap className="w-4 h-4 mt-0.5 text-amber-500" />
                <div>
                  <div className="font-bold">Express 2-Hr</div>
                  <div className="text-[10px] text-slate-500">$5.99 Rush</div>
                </div>
              </button>
            </div>
          </div>

          {/* Promo Code Input */}
          <div>
            {discountCode ? (
              <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-medium">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>Promo <strong>{discountCode}</strong> applied ({discountPercentage}% Off)</span>
                </div>
                <button
                  onClick={removeDiscountCode}
                  className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter coupon (e.g. HEALTH20)"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Summary Breakdown & Checkout Button */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Savings:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Delivery:</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between">
              <span>Healthcare Surcharge / Tax:</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-extrabold text-brand-text">
              <span>Total Amount:</span>
              <span className="text-lg text-brand-blue font-heading">${totalAmount.toFixed(2)}</span>
            </div>

            {/* Checkout Action CTA */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setIsCartOpen(false);
                onOpenCheckout();
              }}
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-brand-blue to-indigo-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/25 hover:from-brand-blue-dark hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

        </div>
      )}
    </MotionDrawer>
  );
};
