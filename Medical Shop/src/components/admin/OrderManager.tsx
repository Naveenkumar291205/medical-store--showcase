import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  User,
  Phone,
  Search,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { OrderStatus } from '../../types/order';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus } = useCart();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchOrder, setSearchOrder] = useState('');

  const statusOptions: OrderStatus[] = [
    'Order Placed',
    'Pharmacist Verification',
    'Processing & Packed',
    'Out for Delivery',
    'Delivered'
  ];

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.orderStatus !== filterStatus) return false;
    if (searchOrder.trim()) {
      const q = searchOrder.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchCust = o.customerName.toLowerCase().includes(q);
      if (!matchNum && !matchCust) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-brand-text">
              Order Fulfillment & Courier Dispatch
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Live progression of patient orders across verification, packaging, and dispatch stages.
            </p>
          </div>

          <Badge variant="primary" size="md">
            {orders.length} Total Orders Recorded
          </Badge>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              placeholder="Search by Order #, Customer..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Pharmacist Verification">Pharmacist Verification</option>
            <option value="Processing & Packed">Processing & Packed</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => {
          const nextIndex = statusOptions.indexOf(ord.orderStatus) + 1;
          const nextStatus = nextIndex < statusOptions.length ? statusOptions[nextIndex] : null;

          return (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold font-mono">
                    #{ord.orderNumber.slice(-3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
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
                    <p className="text-[11px] text-slate-400">
                      Customer: <strong>{ord.customerName}</strong> ({ord.customerPhone}) • Created: {formatDate(ord.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-brand-blue block">
                    ${ord.total.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {ord.paymentMethod} • {ord.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                {ord.items.map((item, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded-xl flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 rounded-lg object-cover bg-white"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-brand-text block truncate">{item.name}</span>
                      <span className="text-[10px] text-slate-500">Qty: {item.quantity} • ${item.price.toFixed(2)}/ea</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status advancement footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-xs">{ord.deliveryAddress.streetAddress}, {ord.deliveryAddress.city}</span>
                </div>

                {nextStatus && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, nextStatus)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Advance to "{nextStatus}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
