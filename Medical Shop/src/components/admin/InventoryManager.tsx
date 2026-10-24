import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Package,
  RotateCcw,
  Sparkles,
  Filter,
  Save,
  X
} from 'lucide-react';
import { Medicine, TherapeuticCategory, DosageForm } from '../../types/medicine';
import { useInventory } from '../../context/InventoryContext';
import { useNotification } from '../../context/NotificationContext';
import { Badge } from '../common/Badge';
import { MotionModal } from '../common/MotionModal';

export const InventoryManager: React.FC = () => {
  const {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    adjustStock,
    lowStockCount,
    outOfStockCount,
    resetInventoryToDefault
  } = useInventory();

  const { showToast } = useNotification();

  const [searchTable, setSearchTable] = useState('');
  const [filterAlerts, setFilterAlerts] = useState<'all' | 'low' | 'out'>('all');
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: '',
    genericName: '',
    brand: '',
    category: 'Cardiology',
    dosageForm: 'Tablet',
    strength: '10mg',
    packSize: 'Strip of 10 Tablets',
    price: 15.0,
    originalPrice: 20.0,
    inStock: true,
    stockCount: 100,
    reorderPoint: 20,
    batchNumber: 'LOT-2026-01',
    expiryDate: '2027-12-31',
    prescriptionRequired: false,
    rating: 4.8,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: 'Clinically tested therapeutic formulation for primary health care.',
    indications: ['General Therapeutic Care'],
    dosageInstructions: 'Take as prescribed by healthcare provider.',
    activeIngredients: [{ name: 'Active Compound', amount: '10mg' }],
    sideEffects: ['Mild nausea in rare cases'],
    precautions: ['Store in cool dry conditions'],
    contraindications: ['Known hypersensitivity'],
    manufacturer: 'AstraNova Health Labs',
    storage: 'Store below 25°C.'
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      genericName: '',
      brand: '',
      category: 'Cardiology',
      dosageForm: 'Tablet',
      strength: '500mg',
      packSize: 'Strip of 10 Tablets',
      price: 12.50,
      originalPrice: 18.00,
      inStock: true,
      stockCount: 100,
      reorderPoint: 20,
      batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: '2027-12-31',
      prescriptionRequired: true,
      rating: 4.8,
      reviewCount: 12,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      description: 'Prescription grade medication formulated under GMP standards.',
      indications: ['Primary Care', 'Maintenance Therapy'],
      dosageInstructions: 'Take once daily with water.',
      activeIngredients: [{ name: 'Core Molecule', amount: '500mg' }],
      sideEffects: ['Mild drowsiness'],
      precautions: ['Keep out of reach of children'],
      contraindications: ['Severe liver failure'],
      manufacturer: 'SmartPharma Certified Labs',
      storage: 'Store below 30°C.'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    addMedicine(formData as Omit<Medicine, 'id'>);
    setIsAddModalOpen(false);
    showToast({
      type: 'success',
      title: 'Medicine Added',
      message: `${formData.name} successfully registered in inventory database.`
    });
  };

  const handleOpenEdit = (med: Medicine) => {
    setEditingMed(med);
    setFormData(med);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMed) return;

    updateMedicine(editingMed.id, formData);
    setEditingMed(null);
    showToast({
      type: 'success',
      title: 'Medicine Updated',
      message: `${formData.name} details have been refreshed.`
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalog?`)) {
      deleteMedicine(id);
      showToast({
        type: 'warning',
        title: 'Medicine Removed',
        message: `${name} has been deleted from active catalog.`
      });
    }
  };

  const filteredMedicines = medicines.filter((m) => {
    if (filterAlerts === 'low' && (!m.inStock || m.stockCount > m.reorderPoint)) return false;
    if (filterAlerts === 'out' && (m.inStock && m.stockCount > 0)) return false;

    if (searchTable.trim()) {
      const q = searchTable.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchGeneric = m.genericName.toLowerCase().includes(q);
      const matchBatch = m.batchNumber.toLowerCase().includes(q);
      if (!matchName && !matchGeneric && !matchBatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header with Add CTA and Filter Tabs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-brand-text">
              Pharmaceutical Inventory Control
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Live batch numbers, stock levels, reorder thresholds, and catalog CRUD operations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetInventoryToDefault}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Reset to default mock catalog"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Catalog</span>
            </button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-2xl bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Medicine</span>
            </motion.button>
          </div>
        </div>

        {/* Search & Stock Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              placeholder="Search by name, generic, batch lot..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setFilterAlerts('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterAlerts === 'all'
                  ? 'bg-blue-50 text-brand-blue'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({medicines.length})
            </button>

            <button
              onClick={() => setFilterAlerts('low')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                filterAlerts === 'low'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Low Stock ({lowStockCount})</span>
            </button>

            <button
              onClick={() => setFilterAlerts('out')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                filterAlerts === 'out'
                  ? 'bg-red-100 text-red-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Out of Stock ({outOfStockCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Medicine & Form</th>
                <th className="py-3.5 px-4">Therapeutic Class</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Batch / Expiry</th>
                <th className="py-3.5 px-4">Rx Type</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredMedicines.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/60 transition-colors">
                  
                  {/* Name & Generic */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={med.image}
                        alt={med.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-brand-text block">{med.name}</span>
                        <span className="text-[11px] text-slate-400">{med.genericName} • {med.strength}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {med.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-bold text-brand-text">
                    ${med.price.toFixed(2)}
                  </td>

                  {/* Stock adjust controls */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${
                        med.stockCount <= 0
                          ? 'text-red-600'
                          : med.stockCount <= med.reorderPoint
                          ? 'text-amber-600'
                          : 'text-emerald-700'
                      }`}>
                        {med.stockCount} units
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => adjustStock(med.id, Math.max(0, med.stockCount - 10))}
                          className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold"
                          title="Reduce 10 units"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => adjustStock(med.id, med.stockCount + 50)}
                          className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-brand-blue text-[10px] font-bold"
                          title="Restock 50 units"
                        >
                          +50
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Batch & Expiry */}
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] block text-slate-800">{med.batchNumber}</span>
                    <span className="text-[10px] text-slate-400">Exp: {med.expiryDate}</span>
                  </td>

                  {/* Rx / OTC */}
                  <td className="py-3 px-4">
                    {med.prescriptionRequired ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                        Rx Required
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        OTC
                      </span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(med)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-blue hover:bg-blue-50 transition-colors"
                        title="Edit Formulation"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(med.id, med.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete from Catalog"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      <MotionModal
        isOpen={isAddModalOpen || !!editingMed}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMed(null);
        }}
        maxWidth="2xl"
        title={editingMed ? `Edit Medicine: ${editingMed.name}` : 'Register New Pharmaceutical Formulation'}
        subtitle="Catalog entries are immediately available in the patient shop and OCR matcher."
      >
        <form onSubmit={editingMed ? handleSaveEdit : handleSaveAdd} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                placeholder="e.g. CardioMax Atorvastatin"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Generic / Molecule *</label>
              <input
                type="text"
                required
                value={formData.genericName || ''}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                placeholder="e.g. Atorvastatin Calcium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Therapeutic Class</label>
              <select
                value={formData.category || 'Cardiology'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TherapeuticCategory })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Diabetes Care">Diabetes Care</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Gastrointestinal">Gastrointestinal</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dosage Form</label>
              <select
                value={formData.dosageForm || 'Tablet'}
                onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value as DosageForm })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Cream / Ointment">Cream / Ointment</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Drops">Drops</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Strength / Potency</label>
              <input
                type="text"
                value={formData.strength || ''}
                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                placeholder="e.g. 500mg or 100ml"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={formData.stockCount || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockCount: parseInt(e.target.value),
                    inStock: parseInt(e.target.value) > 0
                  })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reorder Point</label>
              <input
                type="number"
                value={formData.reorderPoint || 20}
                onChange={(e) => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Batch / Lot Code</label>
              <input
                type="text"
                value={formData.batchNumber || ''}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Expiry Date (YYYY-MM-DD)</label>
              <input
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={formData.prescriptionRequired || false}
                onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                className="w-4 h-4 text-brand-blue rounded"
              />
              <span>Prescription Required (Doctor script mandatory for checkout)</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingMed(null);
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingMed ? 'Update Medicine' : 'Save & Register'}</span>
            </button>
          </div>

        </form>
      </MotionModal>

    </div>
  );
};
