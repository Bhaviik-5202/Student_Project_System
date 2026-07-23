# 🎓 Student Project Management System

A full-stack enterprise-grade application for managing academic student projects, guide allocations, project lifecycles, progress tracking, and administrative controls. Built with **React 18**, **Node.js/Express**, and **MongoDB**.

---

## 🌟 Key Objectives & Architectural Highlights

- **Reusable Component System**: Modular design system primitives built in `frontend/src/components/ui/` (`Button`, `Input`, `Card`, `Modal`, `Table`, `Badge`, `FormComponents`, `LoadingSpinner`, `EmptyState`, `ErrorState`).
- **Role-Based Access Control (RBAC)**: Secure access rules for three primary user roles:
  - **Admin**: Full system management, user management, audit logs, system settings, staff management, backup & restore.
  - **Faculty (Supervisor/Guide)**: Project proposals review, guide allocations, milestone reviews, meeting schedules, progress analytics, student rosters.
  - **Student**: Project proposals submission, team group management, meeting participation, resource library access, milestone progress updates.
- **Robust JWT Authentication**: Token expiration handling, OTP registration verification, password reset flows, secure profile updates.
- **RESTful Backend Architecture**: Layered architecture using Routes -> Controllers -> Services -> Repositories -> Models.
- **Input Validation & Security**: Request validation using `express-validator`, helmet headers, rate limiting, and sanitized query params.

---

## 🚀 Repository Structure

```
Student Project System/
├── backend/                  # Node.js & Express REST API Server
│   ├── config/               # DB and Swagger configurations
│   ├── controllers/          # Request handlers & logic orchestration
│   ├── middleware/           # Auth JWT, Role RBAC, Error Handler, Validator
│   ├── models/               # Mongoose database schemas
│   ├── repositories/         # Database access layer
│   ├── routes/               # Express routes (/api/v1/...)
│   ├── services/             # Core business logic layer
│   ├── tests/                # Automated Mocha & Chai integration tests
│   └── utils/                # Loggers, helpers, response formatters
├── frontend/                 # React 18 Single Page Application (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Header, Footer, ProtectedRoute, Breadcrumbs
│   │   │   ├── layout/       # MainLayout and AuthLayout
│   │   │   ├── pages/        # Domain pages (admin, auth, dashboard, projects, etc.)
│   │   │   └── ui/           # Reusable UI component library (Button, Input, Card, etc.)
│   │   ├── context/          # AuthContext and App state management
│   │   ├── hooks/            # Custom hooks (useAuth, useNotification)
│   │   ├── routes/           # AppRoutes and route protections
│   │   ├── services/         # Axios API service integrations
│   │   └── utils/            # Axios instance, constants, helpers
```

---

## 🛠️ Environment Variables Configuration

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/student_project_system
JWT_SECRET=your_super_secret_jwt_key_32_chars_minimum
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX=100
BCRYPT_SALT_ROUNDS=12

# Optional SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@studentprojectsystem.com
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## ⚡ Quick Start Guide

### 1. Backend Setup

```bash
cd backend
npm install
npm test          # Run 35 automated integration tests
npm run dev       # Start backend server on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev       # Start frontend dev server on http://localhost:3000
```

---

## 📊 Database Models & Indexes

- **User**: Email (unique index), Role (`admin`, `faculty`, `student`), Status (`active`, `inactive`, `pending`).
- **Student**: Roll Number (unique index), Department, Academic Year.
- **Staff**: Employee ID (unique index), Designation, Department.
- **Project**: Title, Slug (unique index), Status, Members, Guide, CreatedBy.
- **Meeting**: Project reference, Scheduled Date, Attendees, Status.
- **Resource**: Title, Category, File URL, Access Level.

---

## 🧪 Verification & Testing

- **Backend Integration Tests**: Run `npm test` inside `backend/` to execute Mocha/Chai test suite validating Auth, Projects, Students, Users, and Resources endpoints.
- **Frontend Production Build**: Run `npm run build` inside `frontend/` to verify Vite bundle compilation without warnings or errors.

---

## 📄 License

This Student Project Management System is licensed under the [MIT License](LICENSE).
