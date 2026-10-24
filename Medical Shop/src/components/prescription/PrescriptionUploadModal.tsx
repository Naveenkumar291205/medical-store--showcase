import React, { useState } from 'react';
import { MotionModal } from '../common/MotionModal';
import { PrescriptionDropzone } from './PrescriptionDropzone';
import { OCRProcessingView } from './OCRProcessingView';
import { OCRResultsReview } from './OCRResultsReview';
import { usePrescription } from '../../context/PrescriptionContext';
import { Prescription } from '../../types/prescription';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigate?: (view: string) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccessNavigate
}) => {
  const { uploadAndProcessPrescription, isUploading, ocrSteps } = usePrescription();
  const [currentFileName, setCurrentFileName] = useState('');
  const [processedRx, setProcessedRx] = useState<Prescription | null>(null);

  const handleFileSelect = async (
    file: File | { name: string; url?: string },
    templateIdx: number = 0
  ) => {
    setCurrentFileName(file.name);
    try {
      const rx = await uploadAndProcessPrescription(file, templateIdx);
      setProcessedRx(rx);
    } catch (err) {
      console.error('OCR Processing error:', err);
    }
  };

  const handleClose = () => {
    setProcessedRx(null);
    onClose();
  };

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="3xl"
      title={
        isUploading
          ? 'Scanning Prescription with AI Engine...'
          : processedRx
          ? 'Extracted Prescription & Dosage Review'
          : 'Upload Doctor Prescription'
      }
      subtitle={
        isUploading
          ? 'Optical character recognition and drug interaction safety pairing active'
          : processedRx
          ? `Transcribed from ${currentFileName}`
          : 'High-speed OCR transcribes handwritten doctor notes in seconds'
      }
    >
      <div>
        {isUploading ? (
          <OCRProcessingView steps={ocrSteps} fileName={currentFileName} />
        ) : processedRx ? (
          <OCRResultsReview
            prescription={processedRx}
            onAddToCartSuccess={() => {
              handleClose();
              if (onSuccessNavigate) onSuccessNavigate('shop');
            }}
            onContinueShopping={() => {
              handleClose();
              if (onSuccessNavigate) onSuccessNavigate('shop');
            }}
          />
        ) : (
          <PrescriptionDropzone
            onFileSelect={handleFileSelect}
            isProcessing={isUploading}
          />
        )}
      </div>
    </MotionModal>
  );
};
