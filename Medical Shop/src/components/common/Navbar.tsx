import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  UploadCloud,
  Search,
  Bell,
  UserCheck,
  ShieldCheck,
  Stethoscope,
  LayoutDashboard,
  ChevronDown,
  Pill,
  Sparkles,
  HeartPulse,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { useInventory } from '../../context/InventoryContext';
import { usePrescription } from '../../context/PrescriptionContext';
import { UserRole } from '../../types/user';
import { DatabaseModal } from './DatabaseModal';
import { Database } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenUploadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenUploadModal
}) => {
  const { currentUser, currentRole, switchRole } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { unreadActivitiesCount, setIsDrawerOpen } = useNotification();
  const { searchQuery, setSearchQuery, medicines } = useInventory();
  const { pendingReviewCount } = usePrescription();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  const searchResults = searchQuery.trim()
    ? medicines.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const rolesList: { role: UserRole; title: string; desc: string; icon: any; badge: string }[] = [
    {
      role: 'customer',
      title: 'Customer View',
      desc: 'Browse catalog, upload Rx, manage orders & refills',
      icon: UserCheck,
      badge: 'Shopper'
    },
    {
      role: 'pharmacist',
      title: 'Pharmacist Portal',
      desc: 'Verify prescriptions, review interactions, dispense',
      icon: Stethoscope,
      badge: `${pendingReviewCount} Pending Rx`
    },
    {
      role: 'admin',
      title: 'Admin Executive',
      desc: 'Inventory CRUD, stock alerts, sales analytics & logs',
      icon: LayoutDashboard,
      badge: 'Full Access'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      {/* Top micro-announcement banner */}
      <div className="bg-gradient-to-r from-brand-blue-dark via-brand-blue to-indigo-700 text-white text-[11px] font-medium py-1 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>
          <strong>Express 2-Hour Delivery</strong> active in your area • Use code <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">HEALTH20</span> for 20% off
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2.5 gap-4">
          
          {/* Brand Logo */}
          <div
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-blue to-indigo-700 flex items-center justify-center text-white shadow-md shadow-brand-blue/30 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-brand-text">
                  Smart<span className="text-brand-blue">Pharma</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                  Rx Live
                </span>
              </div>
              <p className="text-[10px] text-brand-muted font-medium tracking-wide">
                Precision Meets Care
              </p>
            </div>
          </div>

          {/* Search Bar with live autocomplete popup */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className={`relative flex items-center rounded-2xl border transition-all ${
              isSearchFocused
                ? 'border-brand-blue ring-2 ring-brand-blue/15 bg-white shadow-soft'
                : 'border-slate-200 bg-slate-50/80 hover:border-slate-300'
            }`}>
              <Search className="w-4 h-4 text-slate-400 ml-3.5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search medicines, generics, health concerns..."
                className="w-full py-2 pl-2.5 pr-8 bg-transparent text-sm text-brand-text placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Autocomplete Popup */}
            <AnimatePresence>
              {isSearchFocused && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute top-full mt-2 inset-x-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 overflow-hidden"
                >
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    Medicines ({searchResults.length})
                  </div>
                  {searchResults.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => {
                        setCurrentView('shop');
                        setIsSearchFocused(false);
                      }}
                      className="flex items-center justify-between px-3 py-2 hover:bg-blue-50/70 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={med.image}
                          alt={med.name}
                          className="w-8 h-8 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <div className="text-xs font-semibold text-brand-text">{med.name}</div>
                          <div className="text-[10px] text-brand-muted">{med.genericName} • {med.strength}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-brand-blue">${med.price.toFixed(2)}</span>
                        {med.prescriptionRequired && (
                          <span className="block text-[9px] text-amber-600 font-medium">Rx Req</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setCurrentView('shop');
                      setIsSearchFocused(false);
                    }}
                    className="w-full text-center text-xs font-semibold text-brand-blue hover:text-brand-blue-dark py-2 border-t border-slate-100 mt-1 flex items-center justify-center gap-1"
                  >
                    <span>View all matching results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'home'
                  ? 'bg-blue-50 text-brand-blue'
                  : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentView('shop')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'shop'
                  ? 'bg-blue-50 text-brand-blue'
                  : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'
              }`}
            >
              Shop Medicines
            </button>

            <button
              onClick={() => setCurrentView('orders')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'orders'
                  ? 'bg-blue-50 text-brand-blue'
                  : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'
              }`}
            >
              Track Order
            </button>

            {currentRole === 'customer' && (
              <button
                onClick={() => setCurrentView('prescriptions')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentView === 'prescriptions'
                    ? 'bg-blue-50 text-brand-blue'
                    : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'
                }`}
              >
                My Prescriptions
              </button>
            )}

            {currentRole === 'pharmacist' && (
              <button
                onClick={() => setCurrentView('pharmacist')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  currentView === 'pharmacist'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>Verification Queue</span>
                {pendingReviewCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {pendingReviewCount}
                  </span>
                )}
              </button>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  currentView === 'admin'
                    ? 'bg-blue-50 text-brand-blue font-bold'
                    : 'text-slate-700 hover:text-brand-blue hover:bg-blue-50/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-brand-blue" />
                <span>Admin Analytics</span>
              </button>
            )}
          </nav>

          {/* Action CTAs: Upload Rx, Notifications, Cart, Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* MySQL Database Status Indicator */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsDbModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all shadow-xs"
              title="Inspect MySQL Database on 127.0.0.1:3306"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">MySQL Live</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </motion.button>

            {/* Upload Prescription Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onOpenUploadModal}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Rx</span>
            </motion.button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-2xl text-slate-600 hover:text-brand-blue hover:bg-blue-50/80 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadActivitiesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadActivitiesCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-brand-blue-light text-brand-blue hover:bg-brand-blue hover:text-white transition-all duration-200 flex items-center gap-1.5 px-3"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <motion.span
                  key={totalItemsCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="w-5 h-5 rounded-full bg-brand-blue text-white text-[11px] font-bold flex items-center justify-center border-2 border-white"
                >
                  {totalItemsCount}
                </motion.span>
              )}
            </motion.button>

            {/* Interactive Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-xl object-cover ring-1 ring-white"
                />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-brand-text leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-brand-muted uppercase font-semibold">
                    {currentRole === 'pharmacist' ? 'PharmD Staff' : currentRole}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Selection Dropdown Menu */}
              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Switch Persona / Portal
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Seamlessly test all 3 integrated user experiences:
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      {rolesList.map((item) => {
                        const Icon = item.icon;
                        const isSelected = currentRole === item.role;
                        return (
                          <div
                            key={item.role}
                            onClick={() => {
                              switchRole(item.role);
                              setIsRoleDropdownOpen(false);
                              if (item.role === 'pharmacist') setCurrentView('pharmacist');
                              else if (item.role === 'admin') setCurrentView('admin');
                              else setCurrentView('shop');
                            }}
                            className={`p-2.5 rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50 border border-blue-200'
                                : 'hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? 'bg-brand-blue text-white shadow-sm shadow-blue-500/30'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-brand-text">{item.title}</span>
                                <span
                                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                    isSelected
                                      ? 'bg-blue-200 text-brand-blue-dark'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-brand-muted mt-0.5 line-clamp-1">{item.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* MySQL Connection Inspector Modal */}
      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />
    </header>
  );
};
