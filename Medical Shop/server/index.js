import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, pool, isMySQLConnected, memoryStore, saveLocalStore } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Health & Status Check
app.get('/api/health', async (req, res) => {
  try {
    if (isMySQLConnected && pool) {
      const [medCount] = await pool.query('SELECT COUNT(*) as count FROM medicines');
      const [orderCount] = await pool.query('SELECT COUNT(*) as count FROM orders');
      const [rxCount] = await pool.query('SELECT COUNT(*) as count FROM prescriptions');
      
      return res.json({
        status: 'connected',
        engine: 'MySQL 8.0',
        database: process.env.DB_NAME || 'smartpharma_db',
        host: `${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}`,
        mysqlAlive: true,
        stats: {
          medicines: medCount[0].count,
          orders: orderCount[0].count,
          prescriptions: rxCount[0].count,
        },
        serverTime: new Date().toISOString(),
      });
    } else {
      return res.json({
        status: 'connected',
        engine: 'SmartPharma Persistence Engine',
        database: 'smartpharma_db (Local Persistent)',
        host: `${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}`,
        mysqlAlive: false,
        mysqlNotice: "Run: ALTER USER 'root'@'localhost' IDENTIFIED BY 'Medical'; FLUSH PRIVILEGES; in MySQL to activate live MySQL engine.",
        stats: {
          medicines: memoryStore.medicines.length,
          orders: memoryStore.orders.length,
          prescriptions: memoryStore.prescriptions.length,
        },
        serverTime: new Date().toISOString(),
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      host: `${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}`
    });
  }
});

// ----------------- MEDICINES API -----------------
app.get('/api/medicines', async (req, res) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows] = await pool.query('SELECT * FROM medicines ORDER BY rating DESC');
      const medicines = rows.map((r) => ({
        ...r,
        price: parseFloat(r.price),
        originalPrice: parseFloat(r.originalPrice),
        rating: parseFloat(r.rating),
        inStock: Boolean(r.inStock),
        prescriptionRequired: Boolean(r.prescriptionRequired),
        indications: typeof r.indications === 'string' ? JSON.parse(r.indications) : r.indications || [],
        activeIngredients: typeof r.activeIngredients === 'string' ? JSON.parse(r.activeIngredients) : r.activeIngredients || [],
        sideEffects: typeof r.sideEffects === 'string' ? JSON.parse(r.sideEffects) : r.sideEffects || [],
        precautions: typeof r.precautions === 'string' ? JSON.parse(r.precautions) : r.precautions || [],
        contraindications: typeof r.contraindications === 'string' ? JSON.parse(r.contraindications) : r.contraindications || [],
        tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags || [],
      }));
      return res.json(medicines);
    } else {
      return res.json(memoryStore.medicines);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/medicines', async (req, res) => {
  try {
    const med = req.body;
    const id = med.id || `med-${Date.now()}`;
    const newMed = { ...med, id };

    if (isMySQLConnected && pool) {
      await pool.query(
        `INSERT INTO medicines (
          id, name, genericName, brand, category, dosageForm, strength, packSize,
          price, originalPrice, inStock, stockCount, reorderPoint, batchNumber,
          expiryDate, prescriptionRequired, rating, reviewCount, image, description,
          indications, dosageInstructions, activeIngredients, sideEffects,
          precautions, contraindications, manufacturer, storage, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, med.name, med.genericName, med.brand || med.name, med.category, med.dosageForm,
          med.strength, med.packSize, med.price, med.originalPrice || med.price,
          med.stockCount > 0 ? 1 : 0, med.stockCount, med.reorderPoint || 20,
          med.batchNumber || 'BAT-2026', med.expiryDate || '2027-12-31',
          med.prescriptionRequired ? 1 : 0, med.rating || 4.8, med.reviewCount || 0,
          med.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
          med.description || '', JSON.stringify(med.indications || []), med.dosageInstructions || '',
          JSON.stringify(med.activeIngredients || []), JSON.stringify(med.sideEffects || []),
          JSON.stringify(med.precautions || []), JSON.stringify(med.contraindications || []),
          med.manufacturer || 'SmartPharma Labs', med.storage || 'Store below 25°C.',
          JSON.stringify(med.tags || [])
        ]
      );
    }

    memoryStore.medicines.unshift(newMed);
    saveLocalStore();

    res.status(201).json(newMed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const med = req.body;

    if (isMySQLConnected && pool) {
      await pool.query(
        `UPDATE medicines SET
          name = ?, genericName = ?, brand = ?, category = ?, dosageForm = ?,
          strength = ?, packSize = ?, price = ?, originalPrice = ?, inStock = ?,
          stockCount = ?, reorderPoint = ?, batchNumber = ?, expiryDate = ?,
          prescriptionRequired = ?, description = ?, manufacturer = ?, storage = ?
         WHERE id = ?`,
        [
          med.name, med.genericName, med.brand, med.category, med.dosageForm,
          med.strength, med.packSize, med.price, med.originalPrice, med.stockCount > 0 ? 1 : 0,
          med.stockCount, med.reorderPoint, med.batchNumber, med.expiryDate,
          med.prescriptionRequired ? 1 : 0, med.description, med.manufacturer, med.storage,
          id
        ]
      );
    }

    memoryStore.medicines = memoryStore.medicines.map((m) => (m.id === id ? { ...m, ...med } : m));
    saveLocalStore();

    res.json({ message: 'Medicine updated', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/medicines/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stockCount } = req.body;
    const count = Math.max(0, parseInt(stockCount, 10));

    if (isMySQLConnected && pool) {
      await pool.query(
        'UPDATE medicines SET stockCount = ?, inStock = ? WHERE id = ?',
        [count, count > 0 ? 1 : 0, id]
      );
    }

    memoryStore.medicines = memoryStore.medicines.map((m) =>
      m.id === id ? { ...m, stockCount: count, inStock: count > 0 } : m
    );
    saveLocalStore();

    res.json({ id, stockCount: count, inStock: count > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMySQLConnected && pool) {
      await pool.query('DELETE FROM medicines WHERE id = ?', [id]);
    }
    memoryStore.medicines = memoryStore.medicines.filter((m) => m.id !== id);
    saveLocalStore();

    res.json({ message: 'Medicine deleted', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- PRESCRIPTIONS API -----------------
app.get('/api/prescriptions', async (req, res) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows] = await pool.query('SELECT * FROM prescriptions ORDER BY createdAt DESC');
      const prescriptions = rows.map((r) => ({
        ...r,
        extractedMedicines: typeof r.extractedMedicines === 'string' ? JSON.parse(r.extractedMedicines) : r.extractedMedicines || [],
        potentialInteractions: typeof r.potentialInteractions === 'string' ? JSON.parse(r.potentialInteractions) : r.potentialInteractions || [],
      }));
      return res.json(prescriptions);
    } else {
      return res.json(memoryStore.prescriptions);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/prescriptions', async (req, res) => {
  try {
    const rx = req.body;
    const id = rx.id || `rx-${Date.now()}`;
    const newRx = { ...rx, id };

    if (isMySQLConnected && pool) {
      await pool.query(
        `INSERT INTO prescriptions (
          id, userId, patientName, patientAge, patientGender, doctorName, clinicOrHospital,
          doctorRegNo, issueDate, imageUrl, fileName, uploadedAt, status,
          extractedMedicines, pharmacistNotes, verifiedByPharmacistId, verifiedAt,
          rejectionReason, potentialInteractions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, rx.userId || 'usr-cust-01', rx.patientName, rx.patientAge, rx.patientGender,
          rx.doctorName, rx.clinicOrHospital, rx.doctorRegNo, rx.issueDate,
          rx.imageUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
          rx.fileName, rx.uploadedAt || new Date().toISOString(), rx.status || 'pending_pharmacist_review',
          JSON.stringify(rx.extractedMedicines || []), rx.pharmacistNotes || null,
          rx.verifiedByPharmacistId || null, rx.verifiedAt || null,
          rx.rejectionReason || null, JSON.stringify(rx.potentialInteractions || [])
        ]
      );
    }

    memoryStore.prescriptions.unshift(newRx);
    saveLocalStore();

    res.status(201).json(newRx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/prescriptions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pharmacistNotes, rejectionReason, verifiedByPharmacistId } = req.body;

    if (isMySQLConnected && pool) {
      await pool.query(
        `UPDATE prescriptions SET
          status = ?,
          pharmacistNotes = COALESCE(?, pharmacistNotes),
          rejectionReason = COALESCE(?, rejectionReason),
          verifiedByPharmacistId = COALESCE(?, verifiedByPharmacistId),
          verifiedAt = ?
         WHERE id = ?`,
        [status, pharmacistNotes || null, rejectionReason || null, verifiedByPharmacistId || 'usr-pharm-01', new Date().toISOString(), id]
      );
    }

    memoryStore.prescriptions = memoryStore.prescriptions.map((rx) =>
      rx.id === id
        ? {
            ...rx,
            status,
            pharmacistNotes: pharmacistNotes || rx.pharmacistNotes,
            rejectionReason: rejectionReason || rx.rejectionReason,
            verifiedByPharmacistId: verifiedByPharmacistId || rx.verifiedByPharmacistId,
            verifiedAt: new Date().toISOString(),
          }
        : rx
    );
    saveLocalStore();

    res.json({ message: 'Prescription status updated', id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- ORDERS API -----------------
app.get('/api/orders', async (req, res) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows] = await pool.query('SELECT * FROM orders ORDER BY createdAt DESC');
      const orders = rows.map((r) => ({
        ...r,
        subtotal: parseFloat(r.subtotal),
        discount: parseFloat(r.discount),
        deliveryFee: parseFloat(r.deliveryFee),
        tax: parseFloat(r.tax),
        total: parseFloat(r.total),
        items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items || [],
        attachedPrescriptionIds: typeof r.attachedPrescriptionIds === 'string' ? JSON.parse(r.attachedPrescriptionIds) : r.attachedPrescriptionIds || [],
        deliveryAddress: typeof r.deliveryAddress === 'string' ? JSON.parse(r.deliveryAddress) : r.deliveryAddress || {},
        statusHistory: typeof r.statusHistory === 'string' ? JSON.parse(r.statusHistory) : r.statusHistory || [],
        trackingInfo: typeof r.trackingInfo === 'string' ? JSON.parse(r.trackingInfo) : r.trackingInfo || null,
      }));
      return res.json(orders);
    } else {
      return res.json(memoryStore.orders);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const ord = req.body;
    const id = ord.id || `ord-${Date.now()}`;
    const newOrd = { ...ord, id };

    if (isMySQLConnected && pool) {
      await pool.query(
        `INSERT INTO orders (
          id, orderNumber, userId, customerName, customerEmail, customerPhone,
          items, attachedPrescriptionIds, subtotal, discount, discountCode,
          deliveryFee, tax, total, deliveryType, estimatedDelivery,
          deliveryAddress, paymentMethod, paymentStatus, orderStatus,
          statusHistory, trackingInfo, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, ord.orderNumber, ord.userId, ord.customerName, ord.customerEmail, ord.customerPhone,
          JSON.stringify(ord.items), JSON.stringify(ord.attachedPrescriptionIds || []),
          ord.subtotal, ord.discount, ord.discountCode || null, ord.deliveryFee,
          ord.tax, ord.total, ord.deliveryType, ord.estimatedDelivery,
          JSON.stringify(ord.deliveryAddress), ord.paymentMethod, ord.paymentStatus,
          ord.orderStatus, JSON.stringify(ord.statusHistory),
          JSON.stringify(ord.trackingInfo || null), ord.createdAt || new Date().toISOString()
        ]
      );
    }

    memoryStore.orders.unshift(newOrd);
    saveLocalStore();

    res.status(201).json(newOrd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, description } = req.body;
    
    memoryStore.orders = memoryStore.orders.map((order) => {
      if (order.id === id) {
        const history = [
          ...order.statusHistory,
          {
            status: orderStatus,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: description || `Status updated to ${orderStatus}.`
          }
        ];
        return { ...order, orderStatus, statusHistory: history };
      }
      return order;
    });
    saveLocalStore();

    if (isMySQLConnected && pool) {
      const targetOrder = memoryStore.orders.find((o) => o.id === id);
      await pool.query(
        'UPDATE orders SET orderStatus = ?, statusHistory = ? WHERE id = ?',
        [orderStatus, JSON.stringify(targetOrder?.statusHistory || []), id]
      );
    }

    res.json({ id, orderStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- USERS API -----------------
app.get('/api/users', async (req, res) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows] = await pool.query('SELECT * FROM users');
      const users = {};
      rows.forEach((r) => {
        users[r.role] = {
          ...r,
          addresses: typeof r.addresses === 'string' ? JSON.parse(r.addresses) : r.addresses || [],
          allergies: typeof r.allergies === 'string' ? JSON.parse(r.allergies) : r.allergies || [],
          chronicConditions: typeof r.chronicConditions === 'string' ? JSON.parse(r.chronicConditions) : r.chronicConditions || [],
        };
      });
      return res.json(users);
    } else {
      return res.json(memoryStore.users);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- AUDIT LOGS API -----------------
app.get('/api/audit-logs', async (req, res) => {
  try {
    if (isMySQLConnected && pool) {
      const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY createdAt DESC LIMIT 50');
      return res.json(rows);
    } else {
      return res.json(memoryStore.audit_logs);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`\n=================================================`);
      console.log(`🚀 SmartPharma Express API Server Live!`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🗄️  Target Host: ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}`);
      console.log(`🔑 Database: ${process.env.DB_NAME || 'smartpharma_db'}`);
      console.log(`=================================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
