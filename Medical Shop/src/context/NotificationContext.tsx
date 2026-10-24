import React, { createContext, useContext, useState } from 'react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

export interface ActivityNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'prescription' | 'refill' | 'promo' | 'security';
  timestamp: string;
  read: boolean;
  linkAction?: string;
}

const initialActivities: ActivityNotification[] = [
  {
    id: 'act-01',
    title: 'Order SP-88219-01 Out for Delivery',
    message: 'Your courier James is 18 minutes away with your cold-chain medications.',
    type: 'order',
    timestamp: '15 minutes ago',
    read: false,
    linkAction: 'order_tracking'
  },
  {
    id: 'act-02',
    title: 'Prescription Approved',
    message: 'Dr. Robert Harrison Rx for Atorvastatin 20mg has been verified by Pharmacist Sarah.',
    type: 'prescription',
    timestamp: '1 hour ago',
    read: false,
    linkAction: 'prescriptions'
  },
  {
    id: 'act-03',
    title: 'Refill Reminder: CardioMax Atorvastatin',
    message: 'Only 4 days of supply remaining. Tap to re-order in 1 click.',
    type: 'refill',
    timestamp: 'Yesterday',
    read: true,
    linkAction: 'refills'
  },
  {
    id: 'act-04',
    title: 'Wellness Weekend: 20% Off Vitamins',
    message: 'Use coupon code HEALTH20 at checkout for instant savings.',
    type: 'promo',
    timestamp: '2 days ago',
    read: true
  }
];

interface NotificationContextType {
  toasts: ToastNotification[];
  activities: ActivityNotification[];
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  markActivityAsRead: (id: string) => void;
  markAllActivitiesAsRead: () => void;
  unreadActivitiesCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [activities, setActivities] = useState<ActivityNotification[]>(initialActivities);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const showToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markActivityAsRead = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const markAllActivitiesAsRead = () => {
    setActivities((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unreadActivitiesCount = activities.filter((a) => !a.read).length;

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        activities,
        showToast,
        removeToast,
        markActivityAsRead,
        markAllActivitiesAsRead,
        unreadActivitiesCount,
        isDrawerOpen,
        setIsDrawerOpen
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
