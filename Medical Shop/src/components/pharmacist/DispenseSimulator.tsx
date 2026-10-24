import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, ShieldCheck, CheckCircle2, Box, Thermometer, QrCode, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { Badge } from '../common/Badge';

export const DispenseSimulator: React.FC = () => {
  const { orders, updateOrderStatus } = useCart();
  const { showToast } = useNotification();
  const [scannedBatch, setScannedBatch] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '');

  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pharmacist Verification' || o.orderStatus === 'Processing & Packed');

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedBatch(`LOT-${Math.floor(1000 + Math.random() * 9000)}-EXP27`);
      if (selectedOrderId) {
        updateOrderStatus(selectedOrderId, 'Processing & Packed', 'Batch barcoded, cold-chain temperature 4.2°C verified.');
        showToast({
          type: 'success',
          title: 'Batch Allocated & Packed',
          message: 'Order updated to Processing & Packed with tamper-evident seal.'
        });
      }
    }, 1100);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-6">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-brand-blue" />
          <h3 className="text-lg font-heading font-bold text-brand-text">
            Dispensation & Barcode Verification Hub
          </h3>
        </div>
        <Badge variant="primary" size="sm">
          {pendingOrders.length} Orders in Queue
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Left: Barcode Scanner View */}
        <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Laser Scanner: Active</span>
            <span className="font-mono text-cyan-400">Scanner #HUB-04</span>
          </div>

          <div className="py-6 flex flex-col items-center justify-center relative">
            <QrCode className="w-20 h-20 text-slate-400 opacity-60" />
            {isScanning && (
              <motion.div
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="absolute inset-x-8 h-1 bg-red-500 shadow-[0_0_12px_#ef4444]"
              />
            )}
            <span className="text-[11px] font-mono text-slate-300 mt-2">
              {scannedBatch || 'Align barcode with camera or click simulate'}
            </span>
          </div>

          <button
            onClick={handleSimulateScan}
            disabled={isScanning || !selectedOrderId}
            className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Scan className="w-4 h-4" />
            <span>{isScanning ? 'Reading Barcode...' : 'Simulate Barcode & Batch Scan'}</span>
          </button>
        </div>

        {/* Right: Quality Checks */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
          <span className="font-bold text-slate-700 block uppercase tracking-wider">
            Cold-Chain & Packaging Checks:
          </span>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
              <span className="flex items-center gap-2 text-slate-700">
                <Thermometer className="w-4 h-4 text-cyan-600" />
                <span>Storage Temperature</span>
              </span>
              <strong className="text-emerald-700 font-mono">4.2°C (Optimal)</strong>
            </div>

            <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
              <span className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tamper-Evident Safety Seal</span>
              </span>
              <strong className="text-emerald-700">Verified Applied</strong>
            </div>

            <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
              <span className="flex items-center gap-2 text-slate-700">
                <Box className="w-4 h-4 text-blue-600" />
                <span>Child-Resistant Cap Check</span>
              </span>
              <strong className="text-emerald-700">Passed</strong>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-1">
            Compliant with FDA 21 CFR Part 11 electronic batch records.
          </div>
        </div>

      </div>

    </div>
  );
};
