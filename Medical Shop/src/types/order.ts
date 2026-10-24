import { Medicine } from './medicine';

export type OrderStatus =
  | 'Order Placed'
  | 'Pharmacist Verification'
  | 'Processing & Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery (COD)' | 'Health Insurance Co-Pay';
export type DeliveryType = 'standard' | 'express'; // Standard (24h) vs Express (2 Hours)

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  prescriptionRequired: boolean;
  attachedPrescriptionId?: string;
}

export interface OrderItem {
  medicineId: string;
  name: string;
  dosageForm: string;
  strength: string;
  packSize: string;
  price: number;
  quantity: number;
  image: string;
  prescriptionRequired: boolean;
}

export interface DeliveryAddress {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  attachedPrescriptionIds: string[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryType: DeliveryType;
  estimatedDelivery: string;
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  orderStatus: OrderStatus;
  createdAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
  trackingInfo?: {
    courierName: string;
    trackingNumber: string;
    driverName?: string;
    driverPhone?: string;
    currentLocation?: string;
    liveCoordinates?: { lat: number; lng: number };
  };
}
