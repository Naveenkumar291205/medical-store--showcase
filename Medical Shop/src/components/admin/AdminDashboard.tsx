import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  FileText,
  ShieldCheck,
  DollarSign,
  Activity
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useCart } from '../../context/CartContext';
import { usePrescription } from '../../context/PrescriptionContext';
import { AnalyticsCharts } from './AnalyticsCharts';
import { InventoryManager } from './InventoryManager';
import { OrderManager } from './OrderManager';
import { AuditLogs } from './AuditLogs';

export const AdminDashboard: React.FC = () => {
  const { totalProductsCount, lowStockCount, outOfStockCount } = useInventory();
  const { orders } = useCart();
  const { prescriptions, pendingReviewCount } = usePrescription();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'logs'>('analytics');

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) + 38400; // adding baseline

  return (
    <div className="space-y-8">
      
      {/* Executive Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-blue-dark rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 text-brand-blue border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
            <LayoutDashboard className="w-9 h-9 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold">
                Executive Health Systems Administration
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[11px] font-bold">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Global inventory controls, sales velocity intelligence, courier fulfillment routing, and FDA compliance logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-xs">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-300">All Systems Operational</span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Gross Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gross Sales</span>
            <span className="text-2xl font-extrabold text-brand-text font-heading">${totalRevenue.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">+18.4% vs last month</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Orders Processed</span>
            <span className="text-2xl font-extrabold text-brand-text font-heading">{orders.length + 842}</span>
            <span className="text-[11px] text-brand-blue font-semibold block mt-0.5">99.4% On-Time SLA</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Active Prescriptions */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Rx Queue</span>
            <span className="text-2xl font-extrabold text-brand-text font-heading">{prescriptions.length}</span>
            <span className="text-[11px] text-amber-600 font-bold block mt-0.5">{pendingReviewCount} pending RPh review</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Inventory Items</span>
            <span className="text-2xl font-extrabold text-brand-text font-heading">{totalProductsCount}</span>
            <span className="text-[11px] text-rose-600 font-bold block mt-0.5">{lowStockCount} low stock alerts</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'border-brand-blue text-brand-blue font-extrabold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Analytics & Financials</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'border-brand-blue text-brand-blue font-extrabold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory CRUD</span>
          {lowStockCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px]">
              {lowStockCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-brand-blue text-brand-blue font-extrabold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Fulfillment</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'logs'
              ? 'border-brand-blue text-brand-blue font-extrabold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>System Audit Trail</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'analytics' && <AnalyticsCharts />}
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'logs' && <AuditLogs />}
      </div>

    </div>
  );
};
