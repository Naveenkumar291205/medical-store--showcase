import { Order } from '../types/order';

export const mockOrders: Order[] = [
  {
    id: 'ord-10081',
    orderNumber: 'SP-88219-01',
    userId: 'usr-cust-01',
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor.vance@example.com',
    customerPhone: '+1 (555) 392-1084',
    items: [
      {
        medicineId: 'med-01',
        name: 'CardioMax Atorvastatin',
        dosageForm: 'Tablet',
        strength: '20mg',
        packSize: 'Strip of 15 Tablets',
        price: 18.50,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        prescriptionRequired: true
      },
      {
        medicineId: 'med-15',
        name: 'VitaOmega-3 Gold Triple Strength',
        dosageForm: 'Capsule',
        strength: '1000mg',
        packSize: 'Bottle of 60 Enteric Softgels',
        price: 26.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        prescriptionRequired: false
      }
    ],
    attachedPrescriptionIds: ['rx-9021'],
    subtotal: 63.00,
    discount: 10.00,
    discountCode: 'HEALTH20',
    deliveryFee: 0.00,
    tax: 3.18,
    total: 56.18,
    deliveryType: 'express',
    estimatedDelivery: 'Today by 3:30 PM (Express 2-Hour Courier)',
    deliveryAddress: {
      id: 'addr-01',
      fullName: 'Eleanor Vance',
      phone: '+1 (555) 392-1084',
      streetAddress: '742 Evergreen Terrace, Suite 4B',
      landmark: 'Near Central City Park',
      city: 'Springfield',
      state: 'Oregon',
      pincode: '97477',
      isDefault: true
    },
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    createdAt: '2026-08-30T10:45:00Z',
    statusHistory: [
      {
        status: 'Order Placed',
        timestamp: '2026-08-30 10:45 AM',
        description: 'Order received and payment confirmed.'
      },
      {
        status: 'Pharmacist Verification',
        timestamp: '2026-08-30 11:02 AM',
        description: 'Prescription verified and batch ATM-2024-88A allocated by Pharmacist Sarah.'
      },
      {
        status: 'Processing & Packed',
        timestamp: '2026-08-30 11:30 AM',
        description: 'Cold-chain and tamper-evident packaging secured.'
      },
      {
        status: 'Out for Delivery',
        timestamp: '2026-08-30 12:10 PM',
        description: 'Assigned to courier James. On the way to delivery address.'
      }
    ],
    trackingInfo: {
      courierName: 'SmartPharma Direct Express',
      trackingNumber: 'TRK-SP-991204',
      driverName: 'James Carter',
      driverPhone: '+1 (555) 831-9922',
      currentLocation: 'Maple Avenue, 1.4 miles away (ETA: 18 mins)',
      liveCoordinates: { lat: 44.0462, lng: -123.0220 }
    }
  },
  {
    id: 'ord-10080',
    orderNumber: 'SP-77192-09',
    userId: 'usr-cust-01',
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor.vance@example.com',
    customerPhone: '+1 (555) 392-1084',
    items: [
      {
        medicineId: 'med-07',
        name: 'Panadol Advance Fast Action',
        dosageForm: 'Tablet',
        strength: '500mg',
        packSize: 'Pack of 20 Tablets',
        price: 6.50,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
        prescriptionRequired: false
      },
      {
        medicineId: 'med-16',
        name: 'D3-K2 Max Bone & Immunity Drops',
        dosageForm: 'Drops',
        strength: '5000 IU / 100mcg per ml',
        packSize: '30ml Organic MCT Oil Dropper Bottle',
        price: 21.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
        prescriptionRequired: false
      }
    ],
    attachedPrescriptionIds: [],
    subtotal: 34.50,
    discount: 0.00,
    deliveryFee: 2.50,
    tax: 1.85,
    total: 38.85,
    deliveryType: 'standard',
    estimatedDelivery: 'Aug 24, 2026',
    deliveryAddress: {
      id: 'addr-01',
      fullName: 'Eleanor Vance',
      phone: '+1 (555) 392-1084',
      streetAddress: '742 Evergreen Terrace, Suite 4B',
      city: 'Springfield',
      state: 'Oregon',
      pincode: '97477',
      isDefault: true
    },
    paymentMethod: 'Credit / Debit Card',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    createdAt: '2026-08-23T14:15:00Z',
    statusHistory: [
      { status: 'Order Placed', timestamp: '2026-08-23 02:15 PM', description: 'Order confirmed.' },
      { status: 'Processing & Packed', timestamp: '2026-08-23 03:00 PM', description: 'Packed in secure eco-box.' },
      { status: 'Out for Delivery', timestamp: '2026-08-24 09:30 AM', description: 'Dispatched with morning route.' },
      { status: 'Delivered', timestamp: '2026-08-24 11:45 AM', description: 'Delivered to resident at door.' }
    ]
  }
];
