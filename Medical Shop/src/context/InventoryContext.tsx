import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine, TherapeuticCategory } from '../types/medicine';
import { mockMedicines } from '../data/mockMedicines';
import { loadFromStorage, saveToStorage } from '../utils/storage';

interface InventoryContextType {
  medicines: Medicine[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  prescriptionFilter: 'all' | 'rx_only' | 'otc_only';
  setPrescriptionFilter: (filter: 'all' | 'rx_only' | 'otc_only') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: 'popularity' | 'price_low' | 'price_high' | 'rating' | 'name';
  setSortBy: (val: 'popularity' | 'price_low' | 'price_high' | 'rating' | 'name') => void;
  filteredMedicines: Medicine[];
  addMedicine: (med: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, updated: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  adjustStock: (id: string, newStock: number) => void;
  getMedicineById: (id: string) => Medicine | undefined;
  lowStockCount: number;
  outOfStockCount: number;
  totalProductsCount: number;
  resetInventoryToDefault: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    return loadFromStorage<Medicine[]>('medicines_catalog', mockMedicines);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'all' | 'rx_only' | 'otc_only'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_low' | 'price_high' | 'rating' | 'name'>('popularity');

  useEffect(() => {
    saveToStorage('medicines_catalog', medicines);
  }, [medicines]);

  const addMedicine = (newMedData: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = {
      ...newMedData,
      id: `med-${Date.now()}`
    };
    setMedicines((prev) => [newMed, ...prev]);
  };

  const updateMedicine = (id: string, updated: Partial<Medicine>) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updated } : med))
    );
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((med) => med.id !== id));
  };

  const adjustStock = (id: string, newStock: number) => {
    setMedicines((prev) =>
      prev.map((med) =>
        med.id === id
          ? {
              ...med,
              stockCount: Math.max(0, newStock),
              inStock: newStock > 0
            }
          : med
      )
    );
  };

  const getMedicineById = (id: string) => {
    return medicines.find((m) => m.id === id);
  };

  const resetInventoryToDefault = () => {
    setMedicines(mockMedicines);
    saveToStorage('medicines_catalog', mockMedicines);
  };

  const lowStockCount = medicines.filter((m) => m.inStock && m.stockCount <= m.reorderPoint).length;
  const outOfStockCount = medicines.filter((m) => !m.inStock || m.stockCount === 0).length;
  const totalProductsCount = medicines.length;

  // Filtered & Sorted medicines list
  const filteredMedicines = medicines
    .filter((med) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = med.name.toLowerCase().includes(q);
        const matchesGeneric = med.genericName.toLowerCase().includes(q);
        const matchesCategory = med.category.toLowerCase().includes(q);
        const matchesIndication = med.indications.some((ind) => ind.toLowerCase().includes(q));
        const matchesTags = med.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesGeneric && !matchesCategory && !matchesIndication && !matchesTags) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && med.category !== selectedCategory) {
        return false;
      }

      // Rx
      if (prescriptionFilter === 'rx_only' && !med.prescriptionRequired) return false;
      if (prescriptionFilter === 'otc_only' && med.prescriptionRequired) return false;

      // In stock
      if (inStockOnly && (!med.inStock || med.stockCount <= 0)) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.reviewCount - a.reviewCount; // Popularity default
    });

  return (
    <InventoryContext.Provider
      value={{
        medicines,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        prescriptionFilter,
        setPrescriptionFilter,
        inStockOnly,
        setInStockOnly,
        sortBy,
        setSortBy,
        filteredMedicines,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        adjustStock,
        getMedicineById,
        lowStockCount,
        outOfStockCount,
        totalProductsCount,
        resetInventoryToDefault
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
