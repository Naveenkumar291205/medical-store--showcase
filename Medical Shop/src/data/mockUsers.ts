import { User, RefillReminder } from '../types/user';

export const mockUsers: Record<string, User> = {
  customer: {
    id: 'usr-cust-01',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '+1 (555) 392-1084',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    dateJoined: '2025-01-14',
    allergies: ['Penicillin (Mild urticaria)', 'Sulfa Drugs'],
    chronicConditions: ['Hypertension', 'Mild Dyslipidemia'],
    addresses: [
      {
        id: 'addr-01',
        fullName: 'Eleanor Vance',
        phone: '+1 (555) 392-1084',
        streetAddress: '742 Evergreen Terrace, Suite 4B',
        landmark: 'Opposite Central City Park',
        city: 'Springfield',
        state: 'Oregon',
        pincode: '97477',
        isDefault: true
      },
      {
        id: 'addr-02',
        fullName: 'Eleanor Vance (Office)',
        phone: '+1 (555) 392-1084',
        streetAddress: '100 Innovation Parkway, Level 8',
        landmark: 'Tech Valley Tower 2',
        city: 'Springfield',
        state: 'Oregon',
        pincode: '97478',
        isDefault: false
      }
    ]
  },
  pharmacist: {
    id: 'usr-pharm-01',
    name: 'PharmD. Sarah Jenkins',
    email: 'sarah.jenkins@smartpharma.org',
    phone: '+1 (555) 749-2819',
    role: 'pharmacist',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    licenseNumber: 'RPH-8941029-USA',
    pharmacyName: 'SmartPharma Central Dispensation Hub #04',
    dateJoined: '2024-03-10'
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Dr. Alexander Ward',
    email: 'alexander.ward@smartpharma.org',
    phone: '+1 (555) 902-8311',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dateJoined: '2023-11-01'
  }
};

export const mockRefillReminders: RefillReminder[] = [
  {
    id: 'ref-01',
    medicineName: 'CardioMax Atorvastatin 20mg',
    medicineId: 'med-01',
    dailyDosage: '1 tablet daily at night',
    daysRemaining: 4,
    totalPills: 30,
    nextRefillDate: '2026-09-03',
    autoRefillEnabled: true,
    status: 'Refill Soon'
  },
  {
    id: 'ref-02',
    medicineName: 'Metoprolol Succinate ER 50mg',
    medicineId: 'med-03',
    dailyDosage: '1 tablet with morning meal',
    daysRemaining: 18,
    totalPills: 30,
    nextRefillDate: '2026-09-17',
    autoRefillEnabled: false,
    status: 'Normal'
  },
  {
    id: 'ref-03',
    medicineName: 'VitaOmega-3 Triple Strength',
    medicineId: 'med-15',
    dailyDosage: '2 softgels daily',
    daysRemaining: 28,
    totalPills: 60,
    nextRefillDate: '2026-09-27',
    autoRefillEnabled: true,
    status: 'Normal'
  }
];
