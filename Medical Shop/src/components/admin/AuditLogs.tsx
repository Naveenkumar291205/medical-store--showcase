import React from 'react';
import { ShieldCheck, AlertCircle, Info, Clock, UserCheck } from 'lucide-react';
import { mockAuditLogs } from '../../data/mockAnalytics';

export const AuditLogs: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-heading font-bold text-brand-text">
            Security & System Dispensation Audit Trail
          </h3>
          <p className="text-xs text-brand-muted mt-0.5">
            Immutable log of all pharmacist verifications, inventory adjustments, and AI OCR extractions.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-mono font-bold rounded-lg">
          21 CFR Part 11 Compliant
        </span>
      </div>

      <div className="divide-y divide-slate-100 text-xs">
        {mockAuditLogs.map((log) => (
          <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
            <div className="mt-0.5">
              {log.severity === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-brand-text">{log.action}</span>
                <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
              </div>
              <p className="text-slate-600 mt-0.5">{log.details}</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                <span>By: <strong>{log.userName}</strong> ({log.userRole})</span>
                <span>•</span>
                <span className="font-mono">ID: {log.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
