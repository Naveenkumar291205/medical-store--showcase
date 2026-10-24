import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Order, DeliveryAddress, DeliveryType, PaymentMethod, OrderStatus } from '../types/order';
import { Medicine } from '../types/medicine';
import { mockOrders } from '../data/mockOrders';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { useInventory } from './InventoryContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (medicine: Medicine, quantity?: number, attachedPrescriptionId?: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  removeFromCart: (medicineId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Checkout & Calculations
  discountCode: string;
  appliedDiscount: number;
  discountPercentage: number;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
  deliveryType: DeliveryType;
  setDeliveryType: (type: DeliveryType) => void;
  selectedAddress: DeliveryAddress;
  setSelectedAddress: (addr: DeliveryAddress) => void;
  
  // Financial totals
  totalItemsCount: number;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  hasPrescriptionRequiredItems: boolean;
  
  // Orders
  orders: Order[];
  createOrder: (paymentMethod: PaymentMethod, attachedPrescriptionIds?: string[]) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, description?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useNotification();
  const { currentUser } = useAuth();
  const { adjustStock } = useInventory();

  const [items, setItems] = useState<CartItem[]>(() => {
    return loadFromStorage<CartItem[]>('cart_items', []);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return loadFromStorage<Order[]>('orders_list', mockOrders);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('standard');
  
  const defaultAddress: DeliveryAddress = currentUser.addresses?.[0] || {
    id: 'addr-default',
    fullName: currentUser.name,
    phone: currentUser.phone,
    streetAddress: '742 Evergreen Terrace, Suite 4B',
    city: 'Springfield',
    state: 'Oregon',
    pincode: '97477',
    isDefault: true
  };
  
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress>(defaultAddress);

  useEffect(() => {
    saveToStorage('cart_items', items);
  }, [items]);

  useEffect(() => {
    saveToStorage('orders_list', orders);
  }, [orders]);

  const addToCart = (medicine: Medicine, quantity: number = 1, attachedPrescriptionId?: string) => {
    if (!medicine.inStock || medicine.stockCount <= 0) {
      showToast({
        type: 'error',
        title: 'Out of Stock',
        message: `${medicine.name} is currently out of stock.`
      });
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        const newQty = Math.min(medicine.stockCount, existing.quantity + quantity);
        return prev.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: newQty, attachedPrescriptionId: attachedPrescriptionId || item.attachedPrescriptionId }
            : item
        );
      }
      return [
        ...prev,
        {
          medicine,
          quantity: Math.min(medicine.stockCount, quantity),
          prescriptionRequired: medicine.prescriptionRequired,
          attachedPrescriptionId
        }
      ];
    });

    showToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${medicine.name} (${quantity} unit${quantity > 1 ? 's' : ''}) added to your basket.`
    });
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.medicine.id === medicineId) {
          const maxQty = item.medicine.stockCount;
          return { ...item, quantity: Math.min(maxQty, quantity) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (medicineId: string) => {
    setItems((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyDiscountCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'HEALTH20') {
      setDiscountCode('HEALTH20');
      setDiscountPercentage(20);
      showToast({
        type: 'success',
        title: 'Promo Applied!',
        message: '20% off your medicine order.'
      });
      return true;
    }
    if (clean === 'CARE10' || clean === 'FIRST10') {
      setDiscountCode(clean);
      setDiscountPercentage(10);
      showToast({
        type: 'success',
        title: 'Promo Applied!',
        message: '10% discount applied to your order.'
      });
      return true;
    }
    if (clean === 'FREESHIP') {
      setDiscountCode('FREESHIP');
      setDiscountPercentage(0);
      showToast({
        type: 'success',
        title: 'Free Delivery Applied!',
        message: 'Delivery fee waived.'
      });
      return true;
    }

    showToast({
      type: 'error',
      title: 'Invalid Promo Code',
      message: 'Please try HEALTH20 or CARE10.'
    });
    return false;
  };

  const removeDiscountCode = () => {
    setDiscountCode('');
    setDiscountPercentage(0);
  };

  // Calculations
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.medicine.price * item.quantity, 0);
  
  const discountAmount = discountPercentage > 0 ? (subtotal * discountPercentage) / 100 : 0;
  
  let baseDeliveryFee = 0;
  if (items.length > 0) {
    if (discountCode === 'FREESHIP') {
      baseDeliveryFee = 0;
    } else {
      baseDeliveryFee = deliveryType === 'express' ? 5.99 : (subtotal > 35 ? 0 : 3.50);
    }
  }
  const deliveryFee = baseDeliveryFee;
  
  const taxAmount = (subtotal - discountAmount) * 0.05; // 5% healthcare tax
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee + taxAmount);

  const hasPrescriptionRequiredItems = items.some((item) => item.prescriptionRequired);

  const createOrder = (paymentMethod: PaymentMethod, attachedPrescriptionIds: string[] = []): Order => {
    const orderNum = `SP-${Math.floor(10000 + Math.random() * 90000)}-${orders.length + 1}`;
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone,
      items: items.map((i) => ({
        medicineId: i.medicine.id,
        name: i.medicine.name,
        dosageForm: i.medicine.dosageForm,
        strength: i.medicine.strength,
        packSize: i.medicine.packSize,
        price: i.medicine.price,
        quantity: i.quantity,
        image: i.medicine.image,
        prescriptionRequired: i.medicine.prescriptionRequired
      })),
      attachedPrescriptionIds: attachedPrescriptionIds,
      subtotal,
      discount: discountAmount,
      discountCode: discountCode || undefined,
      deliveryFee,
      tax: taxAmount,
      total: totalAmount,
      deliveryType,
      estimatedDelivery: deliveryType === 'express' ? 'Today in 2 Hours' : 'Tomorrow by 2:00 PM',
      deliveryAddress: selectedAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery (COD)' ? 'Pending' : 'Paid',
      orderStatus: hasPrescriptionRequiredItems ? 'Pharmacist Verification' : 'Processing & Packed',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: 'Order received and payment authorization processed.'
        },
        ...(hasPrescriptionRequiredItems ? [{
          status: 'Pharmacist Verification' as OrderStatus,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: 'Transferred to Registered Pharmacist review queue.'
        }] : [{
          status: 'Processing & Packed' as OrderStatus,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: 'Being prepared in temperature-controlled packaging.'
        }])
      ],
      trackingInfo: {
        courierName: 'SmartPharma Care Express',
        trackingNumber: `TRK-SP-${Math.floor(100000 + Math.random() * 900000)}`,
        driverName: 'Alex Mercer',
        driverPhone: '+1 (555) 482-9012',
        currentLocation: 'Preparing dispatch from Central Hub #04'
      }
    };

    // Deduct stock in inventory
    items.forEach((item) => {
      adjustStock(item.medicine.id, item.medicine.stockCount - item.quantity);
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, description?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newHistory = [
            ...order.statusHistory,
            {
              status: newStatus,
              timestamp,
              description: description || `Status updated to ${newStatus}.`
            }
          ];
          return {
            ...order,
            orderStatus: newStatus,
            statusHistory: newHistory
          };
        }
        return order;
      })
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        discountCode,
        appliedDiscount: discountAmount,
        discountPercentage,
        applyDiscountCode,
        removeDiscountCode,
        deliveryType,
        setDeliveryType,
        selectedAddress,
        setSelectedAddress,
        totalItemsCount,
        subtotal,
        discountAmount,
        deliveryFee,
        taxAmount,
        totalAmount,
        hasPrescriptionRequiredItems,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
