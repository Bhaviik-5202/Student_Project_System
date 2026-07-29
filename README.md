# 🎓 Student Project Management System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)

A full-stack, enterprise-grade application designed for universities and colleges to seamlessly manage academic student projects, guide allocations, project lifecycles, progress tracking, and administrative controls. Built with modern web technologies: **React 18**, **Node.js/Express**, and **MongoDB**.

---

## 🌟 Overview & Key Modules

The Student Project Management System facilitates collaboration between Students, Faculty Supervisors (Guides), and System Administrators:

### 🛡️ Admin Module
- **Dashboard & Analytics**: Comprehensive system-wide metrics, department distributions, and status summaries.
- **User & Staff Management**: Complete CRUD controls for Student, Faculty, and Admin accounts.
- **System Settings & Audit Logs**: System configuration parameters and security audit logging.
- **Batch Operations & Backups**: Administrative batch actions and database snapshot backups.

### 👨‍🏫 Faculty (Guide) Module
- **Mentorship Management**: Project proposal evaluation, guide allocation, and student assignment.
- **Sprint & Milestone Tracking**: Progress monitoring, submission reviews, and feedback grading.
- **Meeting Scheduler**: Meeting planning and calendar integration.

### 🎓 Student Module
- **Project Proposals**: Proposal submission, group formation, and architecture specification.
- **Collaboration**: Milestone updates, document uploads, and meeting tracking.
- **Resource Center**: Document libraries, project templates, and tutorial guides.

---

## 👥 Default User Roles

1. **Admin (`admin`)**: Complete system access, user management, system configuration, audit logs, and reports.
2. **Faculty (`faculty`)**: Mentorship tools, project reviews, student guide allocations, and meeting management.
3. **Student (`student`)**: Project creation, proposal tracking, milestone submissions, and resource access.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS Design System, React Router DOM v7, Axios, Lucide React, Recharts
- **Backend**: Node.js, Express.js (v5), Mongoose ODM, JWT, bcrypt, helmet, express-validator, Winston
- **Database**: MongoDB with Mongoose Schema validation & Indexing

---

## 📁 Repository Folder Structure

```text
Student Project System/
├── backend/                  # Node.js & Express REST API Server
│   ├── config/               # Database and Swagger configuration
│   ├── controllers/          # HTTP Request Controllers
│   ├── middleware/           # Auth JWT, Role RBAC, Validator, Error Handler
│   ├── models/               # Mongoose DB Schemas
│   ├── repositories/         # Data Access Layer
│   ├── routes/               # Express Route Definitions (/api/v1/...)
│   ├── services/             # Business Logic Layer
│   ├── tests/                # Mocha & Chai Integration Tests
│   └── utils/                # Logger, Response Formatters, Email Helpers
├── frontend/                 # React 18 Single Page Application (Vite)
│   ├── src/
│   │   ├── assets/           # Global styles and static media
│   │   ├── components/       # Common, Layout, Pages, and UI Components
│   │   ├── context/          # AuthContext, ThemeContext, NotificationContext
│   │   ├── hooks/            # Custom Hooks (useProjects, useAuth, etc.)
│   │   ├── routes/           # Protected and Public Router Configuration
│   │   ├── services/         # Axios API Services
│   │   └── utils/            # Toast and Helper utilities
├── .gitignore                # Global Git Ignore Specification
├── README.md                 # Project Overview & Quick Start
├── INSTALL.md                # Local Development Installation Guide
├── DEPLOYMENT.md             # Production Deployment Guide
├── CHANGELOG.md              # Version History
├── CONTRIBUTING.md           # Contribution Guidelines
└── LICENSE                   # MIT License
```

---

## 🌐 API Endpoint Overview

| Base Endpoint | Method | Role Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | POST | Public | User Registration |
| `/api/v1/auth/login` | POST | Public | User Authentication & JWT Issuance |
| `/api/v1/projects` | GET / POST | Authenticated | List / Create Academic Projects |
| `/api/v1/projects/:id` | GET / PUT / DELETE | Authenticated | Retrieve / Modify / Delete Project |
| `/api/v1/students` | GET | Admin, Faculty | List Student Academic Profiles |
| `/api/v1/staff` | GET / POST | Admin | Manage Faculty & Staff Profiles |
| `/api/v1/meetings` | GET / POST | Authenticated | Schedule & View Meetings |
| `/api/v1/resources` | GET / POST | Authenticated | Access Document Library & Templates |
| `/api/v1/analytics` | GET | Admin | System Analytics & Metrics |
| `/api/v1/auditlogs` | GET | Admin | System Security Audit Trail |

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

## 🧪 Verification & Build

To run the frontend production build validation:

```bash
cd frontend
npm run lint
npm run build
```

To run backend integration tests:

```bash
cd backend
npm test
```

---

## 📄 License & Documentation

- [Installation Guide](INSTALL.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Changelog](CHANGELOG.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [MIT License](LICENSE)
