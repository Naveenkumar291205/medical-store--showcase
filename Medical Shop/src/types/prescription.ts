export type PrescriptionStatus = 
  | 'ocr_processing'
  | 'ocr_completed'
  | 'pending_pharmacist_review'
  | 'approved'
  | 'modifications_suggested'
  | 'rejected';

export interface ExtractedMedicine {
  id: string;
  detectedName: string;
  detectedDosage: string;
  frequency: string; // e.g. "1-0-1 after meals"
  duration: string;  // e.g. "5 days"
  confidence: number; // 0-100%
  matchedMedicineId?: string;
  matchedMedicineName?: string;
  matchedStrength?: string;
  matchedPrice?: number;
  matchedPackSize?: string;
  quantityNeeded: number;
  selected: boolean;
  notes?: string;
}

export interface Prescription {
  id: string;
  userId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  doctorName: string;
  clinicOrHospital: string;
  doctorRegNo: string;
  issueDate: string;
  imageUrl: string;
  fileName: string;
  uploadedAt: string;
  status: PrescriptionStatus;
  extractedMedicines: ExtractedMedicine[];
  pharmacistNotes?: string;
  verifiedByPharmacistId?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  potentialInteractions?: {
    severity: 'high' | 'moderate' | 'mild';
    description: string;
    drugsInvolved: string[];
  }[];
}
