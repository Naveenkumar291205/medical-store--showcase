import { DeliveryAddress } from './order';

export type UserRole = 'customer' | 'pharmacist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  addresses?: DeliveryAddress[];
  licenseNumber?: string; // For pharmacist
  pharmacyName?: string;  // For pharmacist
  dateJoined: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface RefillReminder {
  id: string;
  medicineName: string;
  medicineId: string;
  dailyDosage: string;
  daysRemaining: number;
  totalPills: number;
  nextRefillDate: string;
  autoRefillEnabled: boolean;
  status: 'Normal' | 'Refill Soon' | 'Overdue';
}
