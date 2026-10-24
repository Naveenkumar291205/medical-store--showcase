const API_BASE = 'http://localhost:5000/api';

export interface DatabaseStatus {
  status: 'connected' | 'offline';
  database?: string;
  host?: string;
  mysqlAlive?: boolean;
  stats?: {
    medicines: number;
    orders: number;
    prescriptions: number;
  };
}

export const checkDatabaseHealth = async (): Promise<DatabaseStatus> => {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return {
      status: 'offline',
      host: '127.0.0.1:3306',
      mysqlAlive: false
    };
  }
};

// Medicines API
export const apiGetMedicines = async () => {
  const res = await fetch(`${API_BASE}/medicines`);
  if (!res.ok) throw new Error('Failed to fetch medicines from MySQL');
  return res.json();
};

export const apiCreateMedicine = async (medicineData: any) => {
  const res = await fetch(`${API_BASE}/medicines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicineData)
  });
  if (!res.ok) throw new Error('Failed to create medicine in MySQL');
  return res.json();
};

export const apiUpdateMedicine = async (id: string, medicineData: any) => {
  const res = await fetch(`${API_BASE}/medicines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicineData)
  });
  if (!res.ok) throw new Error('Failed to update medicine in MySQL');
  return res.json();
};

export const apiAdjustMedicineStock = async (id: string, stockCount: number) => {
  const res = await fetch(`${API_BASE}/medicines/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stockCount })
  });
  if (!res.ok) throw new Error('Failed to adjust stock in MySQL');
  return res.json();
};

export const apiDeleteMedicine = async (id: string) => {
  const res = await fetch(`${API_BASE}/medicines/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete medicine in MySQL');
  return res.json();
};

// Prescriptions API
export const apiGetPrescriptions = async () => {
  const res = await fetch(`${API_BASE}/prescriptions`);
  if (!res.ok) throw new Error('Failed to fetch prescriptions from MySQL');
  return res.json();
};

export const apiCreatePrescription = async (rxData: any) => {
  const res = await fetch(`${API_BASE}/prescriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rxData)
  });
  if (!res.ok) throw new Error('Failed to save prescription to MySQL');
  return res.json();
};

export const apiUpdatePrescriptionStatus = async (id: string, updateData: any) => {
  const res = await fetch(`${API_BASE}/prescriptions/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  if (!res.ok) throw new Error('Failed to update prescription status in MySQL');
  return res.json();
};

// Orders API
export const apiGetOrders = async () => {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders from MySQL');
  return res.json();
};

export const apiCreateOrder = async (orderData: any) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error('Failed to create order in MySQL');
  return res.json();
};

export const apiUpdateOrderStatus = async (id: string, orderStatus: string, description?: string) => {
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderStatus, description })
  });
  if (!res.ok) throw new Error('Failed to update order status in MySQL');
  return res.json();
};
