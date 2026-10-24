import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  ShoppingBag,
  FileText,
  Clock,
  MapPin,
  ShieldAlert,
  AlertTriangle,
  Download,
  RotateCcw,
  CheckCircle2,
  Phone,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { usePrescription } from '../../context/PrescriptionContext';
import { RefillScheduleCard } from './RefillScheduleCard';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

interface CustomerDashboardProps {
  onTrackOrder: (orderId: string) => void;
  onOpenUploadModal: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onTrackOrder,
  onOpenUploadModal
}) => {
  const { currentUser } = useAuth();
  const { orders } = useCart();
  const { prescriptions } = usePrescription();

  const userOrders = orders.filter((o) => o.userId === currentUser.id || o.customerName === currentUser.name);

  return (
    <div className="space-y-8">
      
      {/* Patient Profile Banner */}
      <div className="bg-gradient-to-r from-brand-blue-dark via-brand-blue to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/30 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold">{currentUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-sm">
                Patient Member
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              Member since {currentUser.dateJoined} • {currentUser.email} • {currentUser.phone}
            </p>
          </div>
        </div>

        {/* Clinical Safety & Allergy Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.allergies && currentUser.allergies.length > 0 && (
            <div className="bg-rose-500/30 border border-rose-300/40 rounded-2xl px-3.5 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-200">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
                <span>Known Drug Allergies:</span>
              </div>
              <p className="text-xs text-white font-medium mt-0.5">
                {currentUser.allergies.join(', ')}
              </p>
            </div>
          )}

          {currentUser.chronicConditions && currentUser.chronicConditions.length > 0 && (
            <div className="bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2 backdrop-blur-sm">
              <span className="text-[11px] text-blue-200 block font-semibold">Conditions Tracked:</span>
              <p className="text-xs text-white font-medium mt-0.5">
                {currentUser.chronicConditions.join(' • ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
            <span className="text-2xl font-extrabold text-brand-text font-heading">{userOrders.length}</span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Active fulfillment live</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Prescriptions</span>
            <span className="text-2xl font-extrabold text-brand-text font-heading">{prescriptions.length}</span>
            <p className="text-[11px] text-brand-blue font-semibold mt-0.5">Digital scripts verified</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Prescription Action</span>
            <span className="text-sm font-bold text-brand-text block mt-1">Upload New Script</span>
            <button
              onClick={onOpenUploadModal}
              className="text-[11px] text-brand-blue font-bold hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>Scan with AI</span>
            </button>
          </div>
          <button
            onClick={onOpenUploadModal}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Refill Schedule Tracker */}
      <RefillScheduleCard />

      {/* Order History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-heading font-bold text-brand-text">Recent Orders & Dispensation</h3>
            <p className="text-xs text-brand-muted mt-0.5">View tracking timelines, invoice receipts, and instant re-order.</p>
          </div>
          <Badge variant="primary" size="sm">
            {userOrders.length} Orders
          </Badge>
        </div>

        <div className="divide-y divide-slate-100">
          {userOrders.map((ord) => (
            <div key={ord.id} className="py-4 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-brand-text">
                    Order #{ord.orderNumber}
                  </span>
                  <Badge
                    variant={ord.orderStatus === 'Delivered' ? 'success' : 'primary'}
                    size="sm"
                    dot
                  >
                    {ord.orderStatus}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {formatDate(ord.createdAt)} • {ord.items.length} medication item(s) • Total: <strong>${ord.total.toFixed(2)}</strong> via {ord.paymentMethod}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-600">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-sm">{ord.deliveryAddress.streetAddress}, {ord.deliveryAddress.city}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTrackOrder(ord.id)}
                  className="px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-sm shadow-blue-500/20 hover:bg-brand-blue-dark transition-all"
                >
                  Live Tracking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
