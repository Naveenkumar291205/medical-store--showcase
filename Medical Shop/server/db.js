import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import {
  mockMedicines,
  mockPrescriptions,
  mockOrders,
  mockUsers,
  mockAuditLogs,
} from './mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Medical',
};

const DB_NAME = process.env.DB_NAME || 'smartpharma_db';
const DATA_FILE = join(__dirname, 'smartpharma_data.json');

export let pool = null;
export let isMySQLConnected = false;
export let memoryStore = {
  medicines: [],
  prescriptions: [],
  orders: [],
  users: {},
  audit_logs: [],
};

// Load fallback file storage if exists
function loadLocalStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      memoryStore = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading local data file:', e);
  }
}

export function saveLocalStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving local data file:', e);
  }
}

export async function initDatabase() {
  loadLocalStore();

  console.log(`\n======================================================`);
  console.log(`[MySQL] Testing connection to ${DB_CONFIG.host}:${DB_CONFIG.port} with user "${DB_CONFIG.user}"...`);

  try {
    const initialConnection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ [MySQL] Authenticated successfully with MySQL Server!');

    await initialConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`✅ [MySQL] Database "${DB_NAME}" active.`);
    await initialConnection.end();

    pool = mysql.createPool({
      ...DB_CONFIG,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0,
    });

    await createTables();
    await seedInitialData();
    isMySQLConnected = true;
    console.log(`🎉 [MySQL] Connected to database "${DB_NAME}".`);
  } catch (err) {
    isMySQLConnected = false;
    console.warn(`\n⚠️  [MySQL Authentication Status]`);
    console.warn(`Could not log in to MySQL on ${DB_CONFIG.host}:${DB_CONFIG.port} as '${DB_CONFIG.user}' with password '${DB_CONFIG.password}'.`);
    console.warn(`Reason: ${err.message}`);
    console.warn(`\n💡 TO UNLOCK DIRECT MYSQL ENGINE:`);
    console.warn(`Run this command in MySQL Command Line Client or Workbench:`);
    console.warn(`   ALTER USER 'root'@'localhost' IDENTIFIED BY 'Medical'; FLUSH PRIVILEGES;`);
    console.warn(`\n🟢 Embedded SmartPharma Persistence Engine is active & serving all REST API endpoints on port 5000.`);
    console.log(`======================================================\n`);

    if (!memoryStore.medicines || memoryStore.medicines.length === 0) {
      memoryStore = {
        medicines: mockMedicines,
        prescriptions: mockPrescriptions,
        orders: mockOrders,
        users: mockUsers,
        audit_logs: mockAuditLogs,
      };
      saveLocalStore();
    }
  }

  return { isMySQLConnected, pool };
}

async function createTables() {
  if (!pool) return;
  const queries = [
    `CREATE TABLE IF NOT EXISTS medicines (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      genericName VARCHAR(255) NOT NULL,
      brand VARCHAR(128) NOT NULL,
      category VARCHAR(64) NOT NULL,
      dosageForm VARCHAR(64) NOT NULL,
      strength VARCHAR(64) NOT NULL,
      packSize VARCHAR(128) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      originalPrice DECIMAL(10,2) NOT NULL,
      inStock BOOLEAN NOT NULL DEFAULT TRUE,
      stockCount INT NOT NULL DEFAULT 0,
      reorderPoint INT NOT NULL DEFAULT 20,
      batchNumber VARCHAR(64) NOT NULL,
      expiryDate VARCHAR(32) NOT NULL,
      prescriptionRequired BOOLEAN NOT NULL DEFAULT FALSE,
      rating DECIMAL(3,2) NOT NULL DEFAULT 4.8,
      reviewCount INT NOT NULL DEFAULT 0,
      image TEXT,
      description TEXT,
      indications JSON,
      dosageInstructions TEXT,
      activeIngredients JSON,
      sideEffects JSON,
      precautions JSON,
      contraindications JSON,
      manufacturer VARCHAR(255),
      storage VARCHAR(255),
      tags JSON,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS prescriptions (
      id VARCHAR(64) PRIMARY KEY,
      userId VARCHAR(64) NOT NULL,
      patientName VARCHAR(128) NOT NULL,
      patientAge INT NOT NULL,
      patientGender VARCHAR(16) NOT NULL,
      doctorName VARCHAR(128) NOT NULL,
      clinicOrHospital VARCHAR(255) NOT NULL,
      doctorRegNo VARCHAR(64) NOT NULL,
      issueDate VARCHAR(32) NOT NULL,
      imageUrl TEXT,
      fileName VARCHAR(255) NOT NULL,
      uploadedAt VARCHAR(64) NOT NULL,
      status VARCHAR(64) NOT NULL DEFAULT 'pending_pharmacist_review',
      extractedMedicines JSON,
      pharmacistNotes TEXT,
      verifiedByPharmacistId VARCHAR(64),
      verifiedAt VARCHAR(64),
      rejectionReason TEXT,
      potentialInteractions JSON,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) PRIMARY KEY,
      orderNumber VARCHAR(64) UNIQUE NOT NULL,
      userId VARCHAR(64) NOT NULL,
      customerName VARCHAR(128) NOT NULL,
      customerEmail VARCHAR(128) NOT NULL,
      customerPhone VARCHAR(32) NOT NULL,
      items JSON NOT NULL,
      attachedPrescriptionIds JSON,
      subtotal DECIMAL(10,2) NOT NULL,
      discount DECIMAL(10,2) NOT NULL DEFAULT 0,
      discountCode VARCHAR(32),
      deliveryFee DECIMAL(10,2) NOT NULL DEFAULT 0,
      tax DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL,
      deliveryType VARCHAR(32) NOT NULL DEFAULT 'standard',
      estimatedDelivery VARCHAR(128) NOT NULL,
      deliveryAddress JSON NOT NULL,
      paymentMethod VARCHAR(64) NOT NULL,
      paymentStatus VARCHAR(32) NOT NULL DEFAULT 'Paid',
      orderStatus VARCHAR(64) NOT NULL DEFAULT 'Order Placed',
      statusHistory JSON,
      trackingInfo JSON,
      createdAt VARCHAR(64) NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      email VARCHAR(128) UNIQUE NOT NULL,
      phone VARCHAR(32) NOT NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'customer',
      avatar TEXT,
      addresses JSON,
      licenseNumber VARCHAR(64),
      pharmacyName VARCHAR(255),
      dateJoined VARCHAR(32) NOT NULL,
      allergies JSON,
      chronicConditions JSON,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(64) PRIMARY KEY,
      timestamp VARCHAR(64) NOT NULL,
      userId VARCHAR(64) NOT NULL,
      userName VARCHAR(128) NOT NULL,
      userRole VARCHAR(32) NOT NULL,
      action VARCHAR(128) NOT NULL,
      details TEXT NOT NULL,
      severity VARCHAR(32) NOT NULL DEFAULT 'info',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
  ];

  for (const query of queries) {
    await pool.query(query);
  }
}

async function seedInitialData() {
  if (!pool) return;
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM medicines');
  if (rows[0].count === 0) {
    for (const med of mockMedicines) {
      await pool.query(
        `INSERT INTO medicines (
          id, name, genericName, brand, category, dosageForm, strength, packSize,
          price, originalPrice, inStock, stockCount, reorderPoint, batchNumber,
          expiryDate, prescriptionRequired, rating, reviewCount, image, description,
          indications, dosageInstructions, activeIngredients, sideEffects,
          precautions, contraindications, manufacturer, storage, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          med.id,
          med.name,
          med.genericName,
          med.brand,
          med.category,
          med.dosageForm,
          med.strength,
          med.packSize,
          med.price,
          med.originalPrice,
          med.inStock ? 1 : 0,
          med.stockCount,
          med.reorderPoint,
          med.batchNumber,
          med.expiryDate,
          med.prescriptionRequired ? 1 : 0,
          med.rating,
          med.reviewCount,
          med.image,
          med.description,
          JSON.stringify(med.indications),
          med.dosageInstructions,
          JSON.stringify(med.activeIngredients),
          JSON.stringify(med.sideEffects),
          JSON.stringify(med.precautions),
          JSON.stringify(med.contraindications),
          med.manufacturer,
          med.storage,
          JSON.stringify(med.tags || []),
        ]
      );
    }
  }

  const [rxRows] = await pool.query('SELECT COUNT(*) as count FROM prescriptions');
  if (rxRows[0].count === 0) {
    for (const rx of mockPrescriptions) {
      await pool.query(
        `INSERT INTO prescriptions (
          id, userId, patientName, patientAge, patientGender, doctorName, clinicOrHospital,
          doctorRegNo, issueDate, imageUrl, fileName, uploadedAt, status,
          extractedMedicines, pharmacistNotes, verifiedByPharmacistId, verifiedAt,
          rejectionReason, potentialInteractions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          rx.id,
          rx.userId,
          rx.patientName,
          rx.patientAge,
          rx.patientGender,
          rx.doctorName,
          rx.clinicOrHospital,
          rx.doctorRegNo,
          rx.issueDate,
          rx.imageUrl,
          rx.fileName,
          rx.uploadedAt,
          rx.status,
          JSON.stringify(rx.extractedMedicines),
          rx.pharmacistNotes || null,
          rx.verifiedByPharmacistId || null,
          rx.verifiedAt || null,
          rx.rejectionReason || null,
          JSON.stringify(rx.potentialInteractions || []),
        ]
      );
    }
  }

  const [ordRows] = await pool.query('SELECT COUNT(*) as count FROM orders');
  if (ordRows[0].count === 0) {
    for (const ord of mockOrders) {
      await pool.query(
        `INSERT INTO orders (
          id, orderNumber, userId, customerName, customerEmail, customerPhone,
          items, attachedPrescriptionIds, subtotal, discount, discountCode,
          deliveryFee, tax, total, deliveryType, estimatedDelivery,
          deliveryAddress, paymentMethod, paymentStatus, orderStatus,
          statusHistory, trackingInfo, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ord.id,
          ord.orderNumber,
          ord.userId,
          ord.customerName,
          ord.customerEmail,
          ord.customerPhone,
          JSON.stringify(ord.items),
          JSON.stringify(ord.attachedPrescriptionIds),
          ord.subtotal,
          ord.discount,
          ord.discountCode || null,
          ord.deliveryFee,
          ord.tax,
          ord.total,
          ord.deliveryType,
          ord.estimatedDelivery,
          JSON.stringify(ord.deliveryAddress),
          ord.paymentMethod,
          ord.paymentStatus,
          ord.orderStatus,
          JSON.stringify(ord.statusHistory),
          JSON.stringify(ord.trackingInfo || null),
          ord.createdAt,
        ]
      );
    }
  }

  const [usrRows] = await pool.query('SELECT COUNT(*) as count FROM users');
  if (usrRows[0].count === 0) {
    for (const key of Object.keys(mockUsers)) {
      const u = mockUsers[key];
      await pool.query(
        `INSERT INTO users (
          id, name, email, phone, role, avatar, addresses, licenseNumber,
          pharmacyName, dateJoined, allergies, chronicConditions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          u.id,
          u.name,
          u.email,
          u.phone,
          u.role,
          u.avatar,
          JSON.stringify(u.addresses || []),
          u.licenseNumber || null,
          u.pharmacyName || null,
          u.dateJoined,
          JSON.stringify(u.allergies || []),
          JSON.stringify(u.chronicConditions || []),
        ]
      );
    }
  }

  const [logRows] = await pool.query('SELECT COUNT(*) as count FROM audit_logs');
  if (logRows[0].count === 0) {
    for (const log of mockAuditLogs) {
      await pool.query(
        `INSERT INTO audit_logs (id, timestamp, userId, userName, userRole, action, details, severity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          log.id,
          log.timestamp,
          log.userId,
          log.userName,
          log.userRole,
          log.action,
          log.details,
          log.severity,
        ]
      );
    }
  }
}
