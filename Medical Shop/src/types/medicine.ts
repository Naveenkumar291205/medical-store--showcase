export type TherapeuticCategory =
  | 'Cardiology'
  | 'Antibiotics'
  | 'Pain Relief'
  | 'Diabetes Care'
  | 'Dermatology'
  | 'Vitamins & Supplements'
  | 'Respiratory'
  | 'Gastrointestinal';

export type DosageForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Cream / Ointment' | 'Injection' | 'Inhaler' | 'Drops';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: TherapeuticCategory;
  dosageForm: DosageForm;
  strength: string; // e.g. "500mg", "10ml"
  packSize: string; // e.g. "Strip of 10 Tablets", "Bottle of 100ml"
  price: number;
  originalPrice: number; // for discount display
  inStock: boolean;
  stockCount: number;
  reorderPoint: number;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  prescriptionRequired: boolean;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  indications: string[]; // Uses
  dosageInstructions: string;
  activeIngredients: { name: string; amount: string }[];
  sideEffects: string[];
  precautions: string[];
  contraindications: string[]; // for pharmacist drug safety review
  manufacturer: string;
  storage: string;
  tags?: string[];
}

export interface CategoryInfo {
  id: TherapeuticCategory;
  name: string;
  icon: string;
  count: number;
  description: string;
  color: string;
}
