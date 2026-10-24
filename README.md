# 🏥 SmartPharma - Modern Medical Store & Pharmacy Showcase

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Visuals-black.svg)](https://threejs.org/)
[![Express.js](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0_Compatible-orange.svg)](https://www.mysql.com/)

A modern, full-stack pharmacy and digital medical store application crafted with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **Three.js (3D graphics)**, backed by an **Express REST API** with dual-mode storage (**MySQL 8.0** & **Embedded SmartPharma Local Persistence Engine**).

---

## 🌟 Key Features

### 🛍️ 1. Modern E-Commerce Pharmacy
- **Interactive Medicine Catalog**: Filter by category, prescription requirement, dosage form, price range, and stock availability.
- **Detailed Medicine Views**: Composition, indications, dosage instructions, side effects, precautions, contraindications, and active ingredients.
- **Smart Cart & Checkout**: Slide-out drawer cart with live quantity management, tax calculations, free delivery thresholds, and multi-step checkout.
- **Real-Time Order Tracking**: Visual step-by-step timeline of orders from placement to fulfillment and delivery.

### 📋 2. Digital Prescription & OCR Pipeline
- **Drag-and-Drop Prescription Upload**: Upload prescription documents and images.
- **Simulated OCR Scanner**: Automatic extraction of doctor details, prescribed medicines, dosages, and confidence scores.
- **Live Status Tracker**: Real-time progress updates from verification to pharmacist approval and packing.

### 🩺 3. Pharmacist Management Portal
- **Prescription Verification**: Inspect uploaded prescriptions, verify extracted medicines, and approve or request doctor clarification.
- **Drug-Drug Interaction Checker**: Built-in safety tool to check adverse interactions between multiple prescribed medications before dispensing.
- **Dispense Simulator**: Step-by-step verification and batch validation for pharmacy workflow simulations.

### 👤 4. Customer Portal
- **User Dashboard**: Track active prescriptions, upcoming refills, and order history.
- **Smart Refill Schedules**: Refill reminders with adherence tracking.

### 📊 5. Administrator Dashboard & Analytics
- **Inventory Management**: Track stock levels, batch numbers, expiration dates, and reorder alerts.
- **Analytics Charts**: Interactive sales, revenue, order trends, and top category visualizations powered by **Recharts**.
- **Audit Logs**: Transparent history of administrative and dispensing events.

### 🎨 6. 3D Visuals & Fluid UI/UX
- **Interactive 3D Medicine Scene**: Rendered using `@react-three/fiber` and `@react-three/drei`.
- **Micro-Animations & Glassmorphism**: Polished transitions with `framer-motion` and custom Tailwind tokens.
- **Responsive & Dark-Friendly**: Optimized for desktop, tablet, and mobile displays.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 5
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Motion & UI**: Framer Motion, Lucide Icons, Canvas Confetti
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Charts**: Recharts

### Backend
- **Server**: Express.js 5 (Node.js ES Modules)
- **Database Engine**: Dual Mode
  - **Live MySQL 8.0**: Connection pooling via `mysql2/promise`
  - **Local Persistence Engine**: Automatic JSON-based fallback (`smartpharma_data.json`) when MySQL is offline
- **Environment**: Dotenv
- **Security & Networking**: CORS enabled

---

## 📂 Project Structure

```text
medical-store--showcase/
├── .gitignore
├── README.md
└── Medical Shop/
    ├── .env                     # Server & database environment variables
    ├── .gitignore
    ├── index.html               # Main HTML entry point
    ├── package.json             # Dependencies and scripts
    ├── postcss.config.js
    ├── tailwind.config.js       # Custom design tokens & theme
    ├── tsconfig.json
    ├── vite.config.ts
    ├── server/                  # Express REST API
    │   ├── db.js                # Database initialization & local fallback
    │   ├── index.js             # API routes & middleware
    │   ├── mockData.js          # Seed dataset
    │   └── smartpharma_data.json# Persistent local storage
    └── src/                     # React Frontend
        ├── App.tsx              # Main application router
        ├── main.tsx             # React entry point
        ├── index.css            # Global Tailwind styles
        ├── components/
        │   ├── 3d/              # 3D canvas and animated motifs
        │   ├── admin/           # Admin dashboard, charts, inventory
        │   ├── common/          # Navbar, footer, toast, modals
        │   ├── customer/        # Customer dashboard & refill cards
        │   ├── ecommerce/       # Cart, checkout, medicine grid & filters
        │   ├── home/            # Hero, categories, testimonials
        │   ├── pharmacist/      # Dispenser, drug interaction checker
        │   └── prescription/    # Upload, OCR viewer, status tracker
        ├── context/             # Global React Context providers
        ├── data/                # Mock data & initial states
        ├── services/            # API client (Axios/Fetch)
        ├── types/               # TypeScript interfaces & types
        └── utils/               # Formatters & OCR simulator
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **MySQL 8.0**: If you wish to connect directly to a live MySQL instance.

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Naveenkumar291205/medical-store--showcase.git
   cd medical-store--showcase/"Medical Shop"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   A default `.env` is included in `Medical Shop/.env`:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=Medical
   DB_NAME=smartpharma_db
   SERVER_PORT=5000
   ```
   > 💡 **Note**: If MySQL is not running or credentials differ, the server **automatically falls back** to the embedded persistence engine without errors!

---

### Running the Application

You can run both the backend server and frontend development server simultaneously:

#### 1. Start the Backend API Server
In one terminal:
```bash
npm run server
```
*API runs at*: `http://localhost:5000`  
*Health Check*: `http://localhost:5000/api/health`

#### 2. Start the Frontend Development Server
In another terminal:
```bash
npm run dev
```
*Frontend runs at*: `http://localhost:3000` (or `http://localhost:5173`)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health, database status & record counts |
| `GET` | `/api/medicines` | Retrieve list of all medicines |
| `POST` | `/api/medicines` | Add a new medicine (Admin) |
| `PUT` | `/api/medicines/:id` | Update medicine stock or details |
| `DELETE` | `/api/medicines/:id` | Remove a medicine |
| `GET` | `/api/orders` | Retrieve order list |
| `POST` | `/api/orders` | Create a new order |
| `PATCH` | `/api/orders/:id/status`| Update order fulfillment status |
| `GET` | `/api/prescriptions` | Retrieve submitted prescriptions |
| `POST` | `/api/prescriptions` | Submit new prescription & OCR data |
| `PATCH` | `/api/prescriptions/:id/status` | Update prescription verification status |

---

## 🧪 Production Build

To build the client bundle for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📄 License

This project is licensed under the MIT License.