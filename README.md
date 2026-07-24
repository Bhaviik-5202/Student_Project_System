# 🎓 Student Project Management System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)

A full-stack enterprise-grade application designed for universities and colleges to seamlessly manage academic student projects, guide allocations, project lifecycles, progress tracking, and administrative controls. Built with modern web technologies: **React 18**, **Node.js/Express**, and **MongoDB**.

---

## 🌟 Features by Module

### 🛡️ Admin Module
- **Dashboard & Analytics**: Comprehensive overview of system statistics, user growth, and project statuses.
- **User Management**: Add, edit, deactivate, and manage all users (Students, Faculties, Admins) in the system.
- **System Settings & Audit Logs**: Configure system-wide parameters and monitor sensitive actions via audit trails.
- **Data Operations**: Batch operations and data backup/restore capabilities.

### 👨‍🏫 Faculty (Supervisor/Guide) Module
- **Project Mentorship**: Review project proposals, accept/reject requests, and allocate guides.
- **Milestone Tracking**: Monitor student progress, review submissions, and provide grades/feedback.
- **Meeting Scheduler**: Plan, schedule, and track meetings with project groups.
- **Performance Analytics**: View progress analytics and reports of guided student groups.

### 🎓 Student Module
- **Project Proposals**: Form groups, draft proposals, and submit them for faculty approval.
- **Collaboration & Updates**: Submit milestone updates, upload project files, and communicate with guides.
- **Resource Library**: Access shared templates, reference documents, and tutorial videos.
- **Meeting Management**: View scheduled meetings and add discussion points.

### ⚙️ Core System Capabilities
- **Robust JWT Authentication**: Token expiration handling, OTP verification, and secure profile management.
- **Role-Based Access Control (RBAC)**: Deeply integrated access rules determining what each role can see and do.
- **Reusable Component System**: Modular UI built from scratch (`Button`, `Input`, `Card`, `Modal`, `Table`, `Badge`) without heavy third-party UI bloat.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 (Bootstrapped with Vite)
- **Styling**: Vanilla CSS (Custom Design System, CSS Variables, Responsive Layouts)
- **Routing**: React Router DOM
- **State Management**: React Context API & Custom Hooks
- **HTTP Client**: Axios (with centralized interceptors)

### **Backend**
- **Environment**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT for Auth, bcrypt for hashing, express-rate-limit, helmet, express-validator
- **Testing**: Mocha & Chai (35+ automated integration tests)

---

## 🚀 Repository Structure

```text
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
│   │   ├── components/       # Common, Layout, Pages, and UI Components
│   │   ├── context/          # AuthContext and Theme management
│   │   ├── hooks/            # Custom reusable hooks
│   │   ├── routes/           # Protected and Public routing logic
│   │   ├── services/         # Axios API service integrations
│   │   └── assets/           # Global styles and static assets
```

---

## ⚙️ Environment Variables Configuration

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

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (running locally on default port 27017 or a MongoDB Atlas URI)

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Run automated integration tests (Optional but recommended)
npm test

# Start the development server
npm run dev
# The server will run on http://localhost:5000
```

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
# The app will run on http://localhost:3000 (or the port Vite specifies)
```

---

## 📊 Database Models & Architecture

The system utilizes normalized and well-indexed collections to ensure scalability:

- **User**: Core authentication model. Email (unique index), Role (`admin`, `faculty`, `student`), Status.
- **Student / Staff**: Profile extensions linked to the User model. Contains specific fields like Roll Number, Designation, and Department.
- **Project**: Tracks project lifecycles. Fields include Title, Slug (unique index), Status, Members, Guide, CreatedBy.
- **Meeting**: Schedules and history. Links to Projects and Users.
- **Resource**: System-wide or project-specific files, links, and templates.

---

## 🧪 Verification & Testing

- **Backend Integration Tests**: Run `npm test` inside the `backend/` directory to execute the Mocha/Chai test suite validating Auth, Projects, Students, Users, and Resources endpoints.
- **Frontend Production Build**: Run `npm run build` inside the `frontend/` directory to verify Vite bundle compilation without warnings or errors.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the system, please fork the repository and create a pull request with your proposed changes.

---

## 📄 License

This Student Project Management System is open-sourced software licensed under the [MIT License](LICENSE).
