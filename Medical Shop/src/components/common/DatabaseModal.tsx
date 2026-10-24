import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Server, ShieldCheck, HardDrive, Terminal, Copy, Check } from 'lucide-react';
import { MotionModal } from './MotionModal';
import { checkDatabaseHealth, DatabaseStatus } from '../../services/api';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await checkDatabaseHealth();
      setDbStatus(res);
      setLastChecked(new Date().toLocaleTimeString());
    } catch {
      setDbStatus({
        status: 'offline',
        host: '127.0.0.1:3306',
        mysqlAlive: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  const copySql = () => {
    navigator.clipboard.writeText("ALTER USER 'root'@'localhost' IDENTIFIED BY 'Medical'; FLUSH PRIVILEGES;");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLive = dbStatus?.status === 'connected';

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="MySQL Database Status & Configuration"
      subtitle="SmartPharma backend API & database connection manager"
    >
      <div className="space-y-4 text-xs">
        
        {/* Connection Status Card */}
        <div className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
          isLive
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isLive ? 'bg-emerald-600 text-white shadow-sm' : 'bg-amber-600 text-white shadow-sm'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold">
                  {isLive ? 'API & Database Active' : 'Connecting to Server...'}
                </h4>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] opacity-80 mt-0.5">
                Host: <strong className="font-mono">127.0.0.1:3306</strong> • User: <strong className="font-mono">root</strong> • DB: <strong className="font-mono">smartpharma_db</strong>
              </p>
            </div>
          </div>

          <button
            onClick={fetchHealth}
            disabled={isLoading}
            className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors flex-shrink-0"
            title="Refresh Connection Status"
          >
            <RefreshCw className={`w-4 h-4 text-slate-700 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Database Config Specs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Server className="w-3.5 h-3.5 text-brand-blue" />
              <span>Target Host & Port</span>
            </div>
            <p className="font-mono font-bold text-slate-800">127.0.0.1:3306</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <HardDrive className="w-3.5 h-3.5 text-brand-blue" />
              <span>Database Schema</span>
            </div>
            <p className="font-mono font-bold text-slate-800">smartpharma_db</p>
          </div>
        </div>

        {/* Tables & Record Counts */}
        {dbStatus?.stats && (
          <div className="space-y-2">
            <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px]">
              Live Records Loaded:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Medicines</span>
                <span className="text-lg font-bold font-heading text-brand-blue">{dbStatus.stats.medicines}</span>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Orders</span>
                <span className="text-lg font-bold font-heading text-emerald-600">{dbStatus.stats.orders}</span>
              </div>
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100 text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Prescriptions</span>
                <span className="text-lg font-bold font-heading text-amber-600">{dbStatus.stats.prescriptions}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick SQL Unlock Helper */}
        <div className="p-3.5 bg-slate-900 rounded-2xl text-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-mono font-bold text-[11px] text-white">MySQL 8.0 Terminal Command</span>
            </div>
            <button
              onClick={copySql}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
            </button>
          </div>
          <div className="p-2.5 bg-black/40 rounded-xl font-mono text-[11px] text-emerald-300 select-all overflow-x-auto">
            ALTER USER 'root'@'localhost' IDENTIFIED BY 'Medical'; FLUSH PRIVILEGES;
          </div>
          <p className="text-[10px] text-slate-400">
            Paste in MySQL Command Line Client or MySQL Workbench to grant password access.
          </p>
        </div>

        {/* Modal footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            {lastChecked ? `Status checked: ${lastChecked}` : ''}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </MotionModal>
  );
};
