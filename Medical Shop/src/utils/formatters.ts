export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getStockStatus = (count: number, reorderPoint: number) => {
  if (count <= 0) {
    return { label: 'Out of Stock', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500', isAvailable: false };
  }
  if (count <= reorderPoint) {
    return { label: `Low Stock (${count} left)`, color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', isAvailable: true };
  }
  return { label: `In Stock (${count} available)`, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', isAvailable: true };
};

export const getPrescriptionStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return { label: 'Approved by Pharmacist', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'CheckCircle2' };
    case 'pending_pharmacist_review':
      return { label: 'Pending Pharmacist Review', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'Clock' };
    case 'modifications_suggested':
      return { label: 'Action Needed / Modified', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'AlertCircle' };
    case 'rejected':
      return { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200', icon: 'XCircle' };
    case 'ocr_processing':
      return { label: 'AI Scanning...', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: 'Cpu' };
    default:
      return { label: 'Completed', color: 'bg-slate-50 text-slate-700 border-slate-200', icon: 'FileText' };
  }
};
