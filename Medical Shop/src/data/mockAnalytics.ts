import { SalesTrendPoint, CategorySalesPoint, TopSellingMedicine, SystemAuditLog } from '../types/analytics';

export const mockSalesTrends: SalesTrendPoint[] = [
  { date: 'Aug 01', revenue: 4210, orders: 84, prescriptions: 38 },
  { date: 'Aug 05', revenue: 5120, orders: 98, prescriptions: 44 },
  { date: 'Aug 10', revenue: 6480, orders: 122, prescriptions: 59 },
  { date: 'Aug 15', revenue: 5890, orders: 110, prescriptions: 52 },
  { date: 'Aug 20', revenue: 7340, orders: 145, prescriptions: 68 },
  { date: 'Aug 25', revenue: 8920, orders: 168, prescriptions: 81 },
  { date: 'Aug 30', revenue: 9450, orders: 182, prescriptions: 89 },
];

export const mockCategoryDistribution: CategorySalesPoint[] = [
  { category: 'Cardiology', sales: 34800, percentage: 28, color: '#EF4444' },
  { category: 'Vitamins & Supps', sales: 26100, percentage: 21, color: '#22C55E' },
  { category: 'Antibiotics', sales: 22400, percentage: 18, color: '#2563EB' },
  { category: 'Diabetes Care', sales: 18600, percentage: 15, color: '#0D9488' },
  { category: 'Pain Relief', sales: 12400, percentage: 10, color: '#F59E0B' },
  { category: 'Others (Skin/GI)', sales: 9940, percentage: 8, color: '#8B5CF6' },
];

export const mockTopMedicines: TopSellingMedicine[] = [
  { id: 'med-01', name: 'CardioMax Atorvastatin 20mg', category: 'Cardiology', unitsSold: 1420, revenue: 26270, stockRemaining: 142 },
  { id: 'med-07', name: 'Panadol Advance Fast Action', category: 'Pain Relief', unitsSold: 2890, revenue: 18785, stockRemaining: 320 },
  { id: 'med-15', name: 'VitaOmega-3 Gold Triple Strength', category: 'Vitamins & Supplements', unitsSold: 880, revenue: 22880, stockRemaining: 210 },
  { id: 'med-04', name: 'AmoxiClav Duo Forte 625mg', category: 'Antibiotics', unitsSold: 940, revenue: 15792, stockRemaining: 110 },
  { id: 'med-10', name: 'Glucophage XR 1000', category: 'Diabetes Care', unitsSold: 760, revenue: 14820, stockRemaining: 160 },
  { id: 'med-18', name: 'Ventolin HFA Inhaler', category: 'Respiratory', unitsSold: 610, revenue: 12078, stockRemaining: 82 },
];

export const mockAuditLogs: SystemAuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-08-30 11:02:14',
    userId: 'usr-pharm-01',
    userName: 'PharmD. Sarah Jenkins',
    userRole: 'Pharmacist',
    action: 'Prescription Verified & Approved',
    details: 'Prescription #rx-9021 approved for patient Eleanor Vance. Allocated Batch ATM-2024-88A.',
    severity: 'info'
  },
  {
    id: 'log-02',
    timestamp: '2026-08-30 10:48:32',
    userId: 'usr-admin-01',
    userName: 'Dr. Alexander Ward',
    userRole: 'Admin',
    action: 'Inventory Stock Reordered',
    details: 'Triggered automated PO #PO-8819 for 200 units of Metoprolol Succinate ER 50mg.',
    severity: 'info'
  },
  {
    id: 'log-03',
    timestamp: '2026-08-30 09:15:20',
    userId: 'system-ocr',
    userName: 'SmartPharma OCR AI Engine',
    userRole: 'System',
    action: 'AI Prescription Ingestion',
    details: 'Analyzed document Prescription_AcuteBronchitis_Aug30.jpg with 96.4% confidence score.',
    severity: 'info'
  },
  {
    id: 'log-04',
    timestamp: '2026-08-29 16:40:11',
    userId: 'usr-pharm-01',
    userName: 'PharmD. Sarah Jenkins',
    userRole: 'Pharmacist',
    action: 'Interaction Warning Flagged',
    details: 'Flagged potential duplicate therapy on pending Rx #rx-9023 and notified ordering physician.',
    severity: 'warning'
  }
];
