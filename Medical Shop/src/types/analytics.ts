export interface SalesTrendPoint {
  date: string;
  revenue: number;
  orders: number;
  prescriptions: number;
}

export interface CategorySalesPoint {
  category: string;
  sales: number;
  percentage: number;
  color: string;
}

export interface TopSellingMedicine {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  stockRemaining: number;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}
