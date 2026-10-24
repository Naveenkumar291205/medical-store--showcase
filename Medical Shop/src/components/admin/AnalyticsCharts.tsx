import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { mockSalesTrends, mockCategoryDistribution, mockTopMedicines } from '../../data/mockAnalytics';
import { formatCurrency } from '../../utils/formatters';

export const AnalyticsCharts: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* 30-Day Revenue & Volume Trend Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-heading font-bold text-brand-text">
              Revenue & Prescription Growth Velocity
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Daily gross receipts, verified Rx orders, and fulfillment throughput.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-brand-blue">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
              <span>Gross Revenue ($)</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Orders Fulfilled</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockSalesTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue ($)"
                stroke="#2563EB"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#22C55E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Sales Distribution + Top Selling Drugs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Share Donut */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-4">
          <h3 className="text-base font-heading font-bold text-brand-text">
            Therapeutic Class Share
          </h3>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="sales"
                >
                  {mockCategoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {mockCategoryDistribution.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.category} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Pharmaceuticals Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-brand-text">
              Top Dispensed Formulations
            </h3>
            <span className="text-xs text-brand-blue font-semibold">Monthly Snapshot</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {mockTopMedicines.map((med, idx) => (
              <div key={med.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-slate-400 font-bold font-mono">#{idx + 1}</span>
                  <div className="min-w-0">
                    <span className="font-bold text-brand-text block truncate">{med.name}</span>
                    <span className="text-[10px] text-slate-400">{med.category} • {med.unitsSold} units dispensed</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="font-extrabold text-brand-text block">{formatCurrency(med.revenue)}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">{med.stockRemaining} in stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
