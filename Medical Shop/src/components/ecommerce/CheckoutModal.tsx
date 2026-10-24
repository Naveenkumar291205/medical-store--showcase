import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  HeartHandshake,
  MapPin,
  FileText,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MotionModal } from '../common/MotionModal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { usePrescription } from '../../context/PrescriptionContext';
import { PaymentMethod, DeliveryAddress } from '../../types/order';
import { SuccessMotif3D } from '../3d/SuccessMotif3D';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    items,
    subtotal,
    discountAmount,
    deliveryFee,
    taxAmount,
    totalAmount,
    deliveryType,
    createOrder,
    selectedAddress,
    setSelectedAddress,
    hasPrescriptionRequiredItems
  } = useCart();

  const { currentUser } = useAuth();
  const { prescriptions } = usePrescription();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string>(() => {
    const approved = prescriptions.find((rx) => rx.status === 'approved');
    return approved ? approved.id : prescriptions[0]?.id || '';
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleteData, setOrderCompleteData] = useState<any>(null);

  const handleCompleteOrder = async () => {
    setIsProcessing(true);

    // Simulate payment gateway verification
    await new Promise((r) => setTimeout(r, 1400));

    const attachedRx = hasPrescriptionRequiredItems && selectedPrescriptionId ? [selectedPrescriptionId] : [];
    const newOrder = createOrder(paymentMethod, attachedRx);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#22C55E', '#38BDF8', '#F59E0B']
      });
    } catch {
      // ignore
    }

    setIsProcessing(false);
    setOrderCompleteData(newOrder);
  };

  const handleFinish = () => {
    if (orderCompleteData) {
      const oid = orderCompleteData.id;
      setOrderCompleteData(null);
      onClose();
      onOrderSuccess(oid);
    } else {
      onClose();
    }
  };

  const paymentOptions: { id: PaymentMethod; label: string; sub: string; icon: any }[] = [
    {
      id: 'UPI',
      label: 'Instant UPI / QR',
      sub: 'Google Pay, Apple Pay, PhonePe, Paytm',
      icon: Smartphone
    },
    {
      id: 'Credit / Debit Card',
      label: 'Credit or Debit Card',
      sub: 'Visa, MasterCard, Amex (256-bit SSL encrypted)',
      icon: CreditCard
    },
    {
      id: 'Health Insurance Co-Pay',
      label: 'Health Insurance Co-Pay',
      sub: 'Direct insurer billing & member claims',
      icon: HeartHandshake
    },
    {
      id: 'Net Banking',
      label: 'Net Banking',
      sub: 'All major institutional banks supported',
      icon: Landmark
    },
    {
      id: 'Cash on Delivery (COD)',
      label: 'Cash on Delivery',
      sub: 'Pay at your door upon verification',
      icon: Banknote
    }
  ];

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={handleFinish}
      maxWidth="2xl"
      title={orderCompleteData ? 'Order Confirmation' : 'Secure Pharmacy Checkout'}
      subtitle={orderCompleteData ? undefined : 'Cold-chain delivery packaging & verified prescription matching'}
    >
      {orderCompleteData ? (
        <div className="text-center py-4 space-y-6">
          <SuccessMotif3D
            size="lg"
            title="Order Placed Successfully!"
            subtitle={`Order #${orderCompleteData.orderNumber} has been received and transferred for dispensation.`}
          />

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-left max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Estimated Delivery:</span>
              <strong className="text-brand-text">{orderCompleteData.estimatedDelivery}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Address:</span>
              <strong className="text-brand-text truncate max-w-[200px]">{orderCompleteData.deliveryAddress.streetAddress}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Method:</span>
              <strong className="text-brand-text">{orderCompleteData.paymentMethod}</strong>
            </div>
            <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
              <span>Total Paid:</span>
              <strong className="text-brand-blue text-sm">${orderCompleteData.total.toFixed(2)}</strong>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="px-8 py-3 bg-gradient-to-r from-brand-blue to-indigo-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/25 hover:from-brand-blue-dark hover:to-indigo-700 transition-all"
          >
            Track Live Delivery Status
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Delivery Address Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                <span>Delivery Address</span>
              </span>
              <span className="text-[11px] text-brand-blue font-semibold">
                {deliveryType === 'express' ? '⚡ 2-Hour Express Courier' : 'Standard Delivery'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>{selectedAddress.fullName}</span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-brand-blue rounded-full">
                  Verified Contact
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {selectedAddress.streetAddress}, {selectedAddress.landmark && `${selectedAddress.landmark}, `}
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
              </p>
              <p className="text-slate-500 font-mono">{selectedAddress.phone}</p>
            </div>
          </div>

          {/* Prescription Linking if required */}
          {hasPrescriptionRequiredItems && (
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Select Doctor Prescription for Order</span>
              </span>

              <div className="space-y-2">
                {prescriptions.map((rx) => (
                  <label
                    key={rx.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedPrescriptionId === rx.id
                        ? 'border-brand-blue bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="rxSelect"
                        checked={selectedPrescriptionId === rx.id}
                        onChange={() => setSelectedPrescriptionId(rx.id)}
                        className="w-4 h-4 text-brand-blue"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {rx.doctorName} ({rx.clinicOrHospital})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Uploaded: {rx.uploadedAt.split('T')[0]} • Status: <strong className="capitalize text-emerald-700">{rx.status.replace('_', ' ')}</strong>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">#{rx.id}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Choose Payment Method</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = paymentMethod === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-brand-blue bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl flex-shrink-0 ${
                        isSelected ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-text">{opt.label}</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{opt.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final Totals Breakdown */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal ({items.length}):</span>
              <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promotional Discount:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Healthcare Tax:</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-extrabold text-brand-text text-sm">
              <span>Payable Total:</span>
              <span className="text-xl font-heading text-brand-blue">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isProcessing}
            onClick={handleCompleteOrder}
            className={`w-full py-4 rounded-2xl font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              isProcessing
                ? 'bg-slate-400 cursor-wait'
                : 'bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-brand-blue-dark hover:to-indigo-700 shadow-blue-500/25'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Securing Pharmacy Order & Dispensation...</span>
              </div>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Pay ${totalAmount.toFixed(2)}</span>
              </>
            )}
          </motion.button>

        </div>
      )}
    </MotionModal>
  );
};
