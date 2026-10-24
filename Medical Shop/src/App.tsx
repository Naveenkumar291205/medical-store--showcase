import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { CartProvider, useCart } from './context/CartContext';
import { PrescriptionProvider } from './context/PrescriptionContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeMotionProvider } from './context/ThemeMotionContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MotionToast } from './components/common/MotionToast';
import { NotificationDrawer } from './components/common/NotificationDrawer';

// Home Views
import { HeroSection } from './components/home/HeroSection';
import { CategoryShowcase } from './components/home/CategoryShowcase';
import { BestSellersSection } from './components/home/BestSellersSection';
import { HowItWorksTimeline } from './components/home/HowItWorksTimeline';
import { PrescriptionBanner } from './components/home/PrescriptionBanner';
import { TestimonialsSection } from './components/home/TestimonialsSection';

// E-commerce Views
import { MedicineGrid } from './components/ecommerce/MedicineGrid';
import { MedicineFilters } from './components/ecommerce/MedicineFilters';
import { MedicineDetailModal } from './components/ecommerce/MedicineDetailModal';
import { CartDrawer } from './components/ecommerce/CartDrawer';
import { CheckoutModal } from './components/ecommerce/CheckoutModal';
import { OrderTimeline } from './components/ecommerce/OrderTimeline';

// Prescription Views
import { PrescriptionUploadModal } from './components/prescription/PrescriptionUploadModal';
import { PrescriptionStatusTracker } from './components/prescription/PrescriptionStatusTracker';

// Role Portals
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { PharmacistPortal } from './components/pharmacist/PharmacistPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Medicine } from './types/medicine';
import { UploadCloud, Search, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentRole } = useAuth();
  const { filteredMedicines, setSelectedCategory, searchQuery, setSearchQuery } = useInventory();
  const { orders } = useCart();

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>(orders[0]?.id || '');

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrder = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setCurrentView('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setCurrentView('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedTrackingOrder = orders.find((o) => o.id === activeTrackingOrderId) || orders[0];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-bg text-brand-text antialiased">
      {/* Toast Notification Container */}
      <MotionToast />

      {/* Top Sticky Glass Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* 1. HOME VIEW */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <HeroSection
                onExploreShop={() => {
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
                onSelectCategory={handleSelectCategory}
              />

              <CategoryShowcase onSelectCategory={handleSelectCategory} />

              <BestSellersSection
                medicines={filteredMedicines}
                onOpenDetails={(med) => setSelectedMedicine(med)}
                onViewAllShop={() => {
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <HowItWorksTimeline />

              <PrescriptionBanner onOpenUploadModal={() => setIsUploadModalOpen(true)} />

              <TestimonialsSection />
            </motion.div>
          )}

          {/* 2. BUY MEDICINES SHOP VIEW */}
          {currentView === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-text">
                    Pharmacy Medicine Catalog
                  </h1>
                  <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                    Browse authentic medications, compare generics, and check dosage instructions.
                  </p>
                </div>

                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Doctor Prescription</span>
                </button>
              </div>

              {/* Grid with Filters Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-3 lg:sticky lg:top-24">
                  <MedicineFilters />
                </div>
                <div className="lg:col-span-9">
                  <MedicineGrid
                    medicines={filteredMedicines}
                    onOpenDetails={(med) => setSelectedMedicine(med)}
                    onResetFilters={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. ORDER TRACKING VIEW */}
          {currentView === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-heading font-extrabold text-brand-text">
                    Order Tracking & Delivery Status
                  </h1>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Real-time cold-chain verification, courier dispatch progress, and delivery estimation.
                  </p>
                </div>

                {orders.length > 1 && (
                  <select
                    value={activeTrackingOrderId}
                    onChange={(e) => setActiveTrackingOrderId(e.target.value)}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-2xl px-3 py-2 text-brand-text shadow-xs"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        Order #{o.orderNumber} ({o.orderStatus})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedTrackingOrder ? (
                <OrderTimeline order={selectedTrackingOrder} />
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-soft">
                  <p className="text-slate-500 text-sm">No orders placed yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* 4. PRESCRIPTIONS VIEW */}
          {currentView === 'prescriptions' && (
            <motion.div
              key="prescriptions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <PrescriptionStatusTracker />
            </motion.div>
          )}

          {/* 5. REFILLS & CARE VIEW */}
          {currentView === 'refills' && (
            <motion.div
              key="refills"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <CustomerDashboard
                onTrackOrder={handleTrackOrder}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
              />
            </motion.div>
          )}

          {/* 6. PHARMACIST PORTAL */}
          {currentView === 'pharmacist' && (
            <motion.div
              key="pharmacist"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <PharmacistPortal />
            </motion.div>
          )}

          {/* 7. ADMIN PORTAL */}
          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <AdminDashboard />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Global Modals & Drawers */}
      
      {/* 1. Medicine Quick Details Modal */}
      <MedicineDetailModal
        medicine={selectedMedicine}
        isOpen={!!selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
      />

      {/* 2. Cart Slide-Out Drawer */}
      <CartDrawer
        onOpenCheckout={() => setIsCheckoutModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* 3. Secure Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 4. AI Prescription Upload & OCR Modal */}
      <PrescriptionUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccessNavigate={(v) => setCurrentView(v)}
      />

      {/* 5. Notifications Drawer */}
      <NotificationDrawer
        onNavigateAction={(action) => {
          if (action === 'order_tracking') setCurrentView('orders');
          else if (action === 'prescriptions') setCurrentView('prescriptions');
          else if (action === 'refills') setCurrentView('refills');
          else setCurrentView('shop');
        }}
      />

      {/* Footer */}
      <Footer setCurrentView={setCurrentView} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeMotionProvider>
      <AuthProvider>
        <NotificationProvider>
          <InventoryProvider>
            <CartProvider>
              <PrescriptionProvider>
                <MainAppContent />
              </PrescriptionProvider>
            </CartProvider>
          </InventoryProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeMotionProvider>
  );
};

export default App;
