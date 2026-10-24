import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  PhoneCall,
  UserCheck,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/order';
import { Badge } from '../common/Badge';

interface OrderTimelineProps {
  order: Order;
  onAdvanceStatus?: (nextStatus: OrderStatus) => void;
}

const statusStages: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
  {
    status: 'Order Placed',
    label: 'Order Placed',
    icon: CheckCircle2,
    desc: 'Order confirmed and payment verified'
  },
  {
    status: 'Pharmacist Verification',
    label: 'Pharmacist Verification',
    icon: ShieldCheck,
    desc: 'Doctor Rx & interaction safety cleared'
  },
  {
    status: 'Processing & Packed',
    label: 'Packed & Cold-Chain Secured',
    icon: Package,
    desc: 'Dispensed from hub in tamper-evident seal'
  },
  {
    status: 'Out for Delivery',
    label: 'Out for Delivery',
    icon: Truck,
    desc: 'Dispatched with designated driver'
  },
  {
    status: 'Delivered',
    label: 'Delivered Safely',
    icon: MapPin,
    desc: 'Delivered to resident with verification'
  }
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order, onAdvanceStatus }) => {
  const currentStageIndex = statusStages.findIndex((s) => s.status === order.orderStatus);
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-8">
      
      {/* Order Header Snapshot */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-heading font-extrabold text-brand-text">
              Order #{order.orderNumber}
            </span>
            <Badge
              variant={
                order.orderStatus === 'Delivered'
                  ? 'success'
                  : order.orderStatus === 'Cancelled'
                  ? 'danger'
                  : 'primary'
              }
              size="sm"
              dot
            >
              {order.orderStatus}
            </Badge>
          </div>
          <p className="text-xs text-brand-muted">
            Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s) • Total: <strong>${order.total.toFixed(2)}</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Estimated Arrival</span>
          <span className="text-sm font-bold text-brand-blue font-heading">
            {order.estimatedDelivery}
          </span>
        </div>
      </div>

      {/* Animated Visual Step Tracker */}
      <div className="relative">
        <div className="hidden md:flex items-center justify-between relative">
          
          {/* Connecting Progress Track */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 -z-0">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(activeIndex / (statusStages.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-brand-blue to-emerald-500 rounded-full"
            />
          </div>

          {/* Step nodes */}
          {statusStages.map((stage, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.status} className="flex flex-col items-center text-center z-10 w-28">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.15 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-brand-blue border-brand-blue text-white shadow-md shadow-blue-500/25'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-xs font-bold mt-2.5 ${isCompleted ? 'text-brand-text' : 'text-slate-400'}`}>
                  {stage.label}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight mt-0.5 max-w-[100px]">
                  {stage.desc}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden space-y-6 relative pl-6 border-l-2 border-slate-100 ml-3">
          {statusStages.map((stage, idx) => {
            const isCompleted = idx <= activeIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.status} className="relative">
                <div
                  className={`absolute -left-[31px] top-0.5 w-7 h-7 rounded-xl flex items-center justify-center border-2 ${
                    isCompleted
                      ? 'bg-brand-blue border-brand-blue text-white shadow-sm'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className={`text-xs font-bold ${isCompleted ? 'text-brand-text' : 'text-slate-400'}`}>
                    {stage.label}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Courier & Simulated Map Card (When Out for Delivery or Processing) */}
      {order.trackingInfo && order.orderStatus === 'Out for Delivery' && (
        <div className="p-4 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 rounded-2xl border border-blue-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-brand-text block">Live Courier GPS Status</span>
                <span className="text-[11px] text-brand-blue font-semibold">{order.trackingInfo.currentLocation}</span>
              </div>
            </div>

            {order.trackingInfo.driverPhone && (
              <a
                href={`tel:${order.trackingInfo.driverPhone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl text-xs font-bold text-brand-blue border border-blue-200 shadow-xs hover:bg-blue-50 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Driver</span>
              </a>
            )}
          </div>

          {/* Simulated Mini Map Visual */}
          <div className="relative h-32 w-full bg-slate-200 rounded-xl overflow-hidden border border-slate-300/80 flex items-center justify-center">
            {/* Background grid texture */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full">
              <path
                d="M 30 90 Q 150 20 280 60 T 500 40"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Courier pin */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded-md shadow-md mb-1">
                James • 18 min ETA
              </span>
              <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-lg ring-4 ring-blue-300/50 animate-bounce">
                <Truck className="w-3 h-3" />
              </div>
            </div>

            {/* Destination pin */}
            <div className="absolute top-8 right-12 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <MapPin className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ordered Items Summary */}
      <div className="space-y-3 pt-2">
        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Package Contents ({order.items.length} items)
        </h5>
        <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl p-3 border border-slate-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-xl object-cover bg-white"
                />
                <div>
                  <div className="font-bold text-brand-text">{item.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {item.strength} • Qty: {item.quantity}
                  </div>
                </div>
              </div>
              <div className="font-mono font-bold text-brand-text">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
