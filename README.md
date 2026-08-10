# 🎓 Student Project Management System

![React](https://img.shields.io/badge/react-18.x-20232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-5.x-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.x-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-18.x-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-4.x-404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-4ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)

An enterprise-grade, full-stack web application designed for academic institutions to manage student project lifecycles, team allocations, faculty guide assignments, proposal evaluations, and administrative oversight. Built with **React 18**, **Node.js/Express**, and **MongoDB**.

---

## 🌟 Key Features & Architectural Innovations

### 🎓 End-to-End Student Academic Profile Flow
- **Registration Integration**: Captures required **Department**, **Semester** (`Semester 1` .. `Semester 8`), and **Academic Year** (`2024-25`, `2025-26`, `2026-27`, `2027-28`) during Student signup.
- **Dynamic Academic Options**: Serves active database department options via a public REST endpoint (`GET /api/v1/auth/academic-options`).
- **OTP Verification Flow**: Preserves student academic details through email OTP verification.
- **Academic Profile Visibility**: Renders Academic Year and Semester badges across the Student Directory, Admin User Management (`UserForm.jsx`), and Student Profile Settings (`Profile.jsx`).

### ⚡ High-Performance Architecture
- **Instant Signup Navigation (<200ms)**: Asynchronous background email dispatch enables instant UI navigation to the OTP verification screen.
- **Singleton SMTP Transporter Pool**: Reuses Nodemailer transporter connections (`pool: true`) to eliminate TLS/SMTP handshake latency.
- **Fast Admin Dashboard (<400ms)**: Query pagination (`limit: 5`) and projections prevent loading un-needed datasets on initial render.
- **Compound MongoDB Indexing**: Optimized compound indexes on `User ({ role: 1, status: 1 })`, `User ({ createdAt: -1 })`, and `Project ({ status: 1, updatedAt: -1 })`.
- **In-Memory Domain MX Cache**: Eliminates redundant 3-second DNS lookups during deliverability checks.

### 🎨 Responsive & Accessible UI System
- **Dark & Light Mode Support**: Glassmorphic styling with smooth theme transitions.
- **Smart Floating Controls**: Adaptive `BackToTop` button with intelligent viewport intersection and footer/bottom-nav clearance logic.
- **Mobile Bottom Navigation**: Native app experience on smaller devices.

---

## 👥 User Roles & Access Control (RBAC)

1. **Admin (`admin`)**: Complete system administration, user management, audit logs, system configuration, backup/restore operations, and high-level analytics.
2. **Faculty (`faculty`)**: Proposal reviews, guide & co-guide allocations, sprint evaluations, student project tracking, and meeting scheduling.
3. **Student (`student`)**: Account registration with academic details, project proposal submissions, group allocation, milestone tracking, and document resources.

---

## 🛠️ Technology Stack

- **Frontend**: React 18.2, Vite 5, TailwindCSS 3, Framer Motion 10, Recharts 2, Lucide Icons, Axios, React Hot Toast
- **Backend**: Node.js 18, Express 4, Mongoose ODM 8, JWT, Bcrypt, Helmet, Express Rate Limit, Nodemailer, Winston
- **Database**: MongoDB (Local or Atlas) with Schema Validation & Compound Indexes
- **Testing**: Mocha, Chai, Supertest (40/40 Passing Integration Tests), ESLint (0 errors)

---

## 📁 Repository Structure

```text
Student Project System/
├── backend/                  # Node.js & Express REST API Server
│   ├── config/               # Database and Swagger configuration
│   ├── controllers/          # Request handlers & validation
│   ├── middleware/           # Auth JWT, Role RBAC, Validator, Error Handler
│   ├── models/               # Mongoose DB Schemas & Indexes
│   ├── repositories/         # Data Access Layer Abstractions
│   ├── routes/               # Express Route Definitions (/api/v1/...)
│   ├── services/             # Core Business Logic Layer
│   ├── tests/                # Automated Integration Tests (Mocha/Chai)
│   ├── utils/                # Singleton Email Pool, Logger, Response Formatters
│   ├── ARCHITECTURE.md       # High-level architecture documentation
│   ├── STRUCTURE.md          # Detailed folder breakdown
│   └── README.md             # Backend API Service documentation
├── frontend/                 # React 18 Single Page Application (Vite)
│   ├── src/
│   │   ├── assets/           # Media assets and logos
│   │   ├── components/       # Common, Layout, Pages, and UI Components
│   │   ├── context/          # AuthContext and ThemeContext
│   │   ├── hooks/            # Custom React hooks (useProjects, useAuth)
│   │   ├── services/         # Axios API Service Modules
│   │   └── utils/            # Toast and API instance helpers
│   └── README.md             # Frontend Single Page App documentation
├── README.md                 # Project Overview & High-Level Guide
├── INSTALL.md                # Local Development Installation Guide
├── DEPLOYMENT.md             # Production Deployment Guide
├── CHANGELOG.md              # Version & Release History
├── CONTRIBUTING.md           # Contribution Guidelines
└── LICENSE                   # MIT License
```

---

## 🌐 Key API Endpoints

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | POST | Public | Register Student (requires Department, Semester, Academic Year) |
| `/api/v1/auth/verify-otp` | POST | Public | Verify 6-digit OTP code & activate account |
| `/api/v1/auth/login` | POST | Public | Authenticate user & return JWT token |
| `/api/v1/auth/academic-options` | POST/GET | Public | Fetch dynamic departments, semesters, and academic years |
| `/api/v1/users?limit=5` | GET | Admin | Paginated list of user accounts |
| `/api/v1/projects` | GET / POST | Authenticated | List / Create Academic Projects |
| `/api/v1/analytics/dashboard` | GET | Admin | Aggregate dashboard metrics (<400ms load time) |
| `/api/v1/admin/backups` | GET / POST | Admin | List & trigger manual database backups |

---

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🧪 Automated Testing & QA

Run frontend linting:
```bash
cd frontend
npm run lint
```

Run backend integration tests:
```bash
cd backend
npm test
```

---

## 📄 Documentation Links

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [Backend Architecture](backend/ARCHITECTURE.md)
- [Backend Folder Structure](backend/STRUCTURE.md)
- [Installation Guide](INSTALL.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Changelog](CHANGELOG.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [MIT License](LICENSE)
