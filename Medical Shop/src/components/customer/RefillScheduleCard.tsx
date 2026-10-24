import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, AlertCircle, CheckCircle2, Pill, Sparkles, ShoppingBag } from 'lucide-react';
import { RefillReminder } from '../../types/user';
import { mockRefillReminders } from '../../data/mockUsers';
import { useCart } from '../../context/CartContext';
import { useInventory } from '../../context/InventoryContext';
import { useNotification } from '../../context/NotificationContext';
import { Badge } from '../common/Badge';

export const RefillScheduleCard: React.FC = () => {
  const [reminders, setReminders] = useState<RefillReminder[]>(mockRefillReminders);
  const { addToCart } = useCart();
  const { getMedicineById } = useInventory();
  const { showToast } = useNotification();

  const toggleAutoRefill = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = !r.autoRefillEnabled;
          showToast({
            type: updated ? 'success' : 'info',
            title: updated ? 'Auto-Refill Activated' : 'Auto-Refill Paused',
            message: `${r.medicineName} will ${updated ? 'automatically reorder before supply runs out.' : 'now require manual reordering.'}`
          });
          return { ...r, autoRefillEnabled: updated };
        }
        return r;
      })
    );
  };

  const handleInstantRefill = (reminder: RefillReminder) => {
    const med = getMedicineById(reminder.medicineId);
    if (med) {
      addToCart(med, 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-brand-blue" />
            <h3 className="text-lg font-heading font-bold text-brand-text">
              Smart Medication Refill Tracker
            </h3>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            Never miss a dose. Automated supply calculations based on your prescribed daily intake.
          </p>
        </div>

        <Badge variant="success" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
          AI Refill Engine
        </Badge>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map((rem) => {
          const isUrgent = rem.daysRemaining <= 5;
          const progressPercent = Math.min(100, Math.max(10, (rem.daysRemaining / 30) * 100));

          return (
            <div
              key={rem.id}
              className={`p-4 rounded-2xl border transition-all ${
                isUrgent
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-slate-50/60 border-slate-100'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-brand-blue'
                  }`}>
                    <Pill className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-brand-text truncate">
                      {rem.medicineName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Dosage: <strong>{rem.dailyDosage}</strong>
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span>Next Refill: <strong>{rem.nextRefillDate}</strong></span>
                      <span>•</span>
                      <span className={`font-bold ${isUrgent ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {rem.daysRemaining} Days Supply Remaining
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                  
                  {/* Auto refill toggle */}
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <span className="hidden sm:inline">Auto-Ship:</span>
                    <button
                      type="button"
                      onClick={() => toggleAutoRefill(rem.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        rem.autoRefillEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: rem.autoRefillEnabled ? 20 : 0 }}
                        className="w-5 h-5 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </label>

                  {/* Refill Now CTA */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInstantRefill(rem)}
                    className="px-3.5 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order Refill</span>
                  </motion.button>

                </div>
              </div>

              {/* Pill supply remaining progress bar */}
              <div className="mt-3 w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isUrgent ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
