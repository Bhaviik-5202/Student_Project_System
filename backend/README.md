# Student Project System – Backend API Service

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.x-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Mocha/Chai](https://img.shields.io/badge/Testing-Mocha_%26_Chai-8D6748?style=for-the-badge&logo=mocha&logoColor=white)

An enterprise-grade, high-performance RESTful API service for the **Student Project System**. Developed with Node.js, Express, MongoDB, Mongoose, and Nodemailer to power user authentication, student academic profiles, project lifecycles, faculty guide allocations, system notifications, and administrative analytics.

---

## ⚡ Architecture & Performance Innovations

### 🏗 Layered Enterprise Architecture
Follows a strict **Controller → Service → Repository → Model** architectural design pattern:
- **Controllers**: Handle HTTP request lifecycle, input validation, and standardized API JSON formatting.
- **Services**: Enforce business rules, transaction safety, entity cross-synchronization, and analytics logic.
- **Repositories**: Encapsulate Mongoose database queries, pagination parameters, projections, and data access.
- **Models**: Define Mongo schemas, field validations, pre-save hooks, and compound database indexes.

### 🚀 Sub-200ms Signup & Instant Email Architecture
- **Singleton SMTP Connection Pool**: Reuses a single Nodemailer transport instance (`pool: true`, `maxConnections: 5`, `maxMessages: 100`) to eliminate per-request TLS handshakes and SMTP reconnect delays.
- **Asynchronous Background Email Dispatch**: Generates and persists the 6-digit OTP in MongoDB (`OTP.findOneAndUpdate`) *before* returning the HTTP response in **<200ms**, allowing the frontend to navigate immediately while email delivery completes concurrently in the background.
- **In-Memory Domain MX Cache**: Caches domain MX lookup results in `domainMxCache` to prevent repetitive 3-second DNS timeouts during deliverability checks.

### 📊 Database Query Optimization & Compound Indexing
- **Compound MongoDB Indexes**:
  - `User ({ role: 1, status: 1 })` and `User ({ createdAt: -1 })` for instant role filtering.
  - `Project ({ status: 1, updatedAt: -1 })` and `Project ({ members: 1 })` for indexed status scans.
  - `Notification ({ user: 1, read: 1, createdAt: -1 })` for fast unread notifications fetch.
- **Query Projections & Pagination**: `getAll` endpoints support `limit` and `select` to return light payloads (<400ms Admin Dashboard initial load).

---

## 📁 Directory Structure

```text
backend/
├── controllers/            # HTTP Request Handlers
│   ├── admin.controller.js     # Admin backups, batch operations, system rules
│   ├── analytics.controller.js # Dashboard metrics, project/user analytics
│   ├── auth.controller.js      # Register, Login, Verify OTP, Password Reset, Academic Options
│   ├── meeting.controller.js   # Meeting scheduling & calendar APIs
│   ├── notification.controller.js # Notification feed & read-all handlers
│   ├── project.controller.js   # Project CRUD, guide assignment, status updates
│   ├── resource.controller.js  # File/document resource upload & retrieval
│   ├── student.controller.js   # Student profile directory & academic records
│   └── user.controller.js      # User management CRUD & role authorization
├── services/               # Core Business Logic Layer
│   ├── admin.service.js        # System roles, backups, batch processor logic
│   ├── analytics.service.js    # Metric aggregation, dashboard stats calculation
│   ├── auditlog.service.js     # Audit trail logging service
│   ├── notification.service.js # Notification creation & broadcast service
│   ├── project.service.js      # Project lifecycle & team assignment business rules
│   ├── student.service.js      # Student record sync & academic profiles
│   └── user.service.js         # Authentication, password hashing, user registration
├── repositories/           # Database Access Abstraction Layer
│   ├── meeting.repository.js   # Meeting database operations
│   ├── otp.repository.js       # OTP collection operations
│   ├── project.repository.js   # Project database operations
│   ├── staff.repository.js     # Staff/Faculty database operations
│   ├── student.repository.js   # Student database operations
│   └── user.repository.js      # User database operations
├── models/                 # Mongoose Schema Definitions
│   ├── activity.model.js       # Activity log schema
│   ├── auditlog.model.js       # Audit log schema
│   ├── meeting.model.js        # Meeting & schedule schema
│   ├── notification.model.js   # Notification feed schema
│   ├── otp.model.js            # Verification OTP schema (with TTL auto-expiration)
│   ├── project.model.js        # Project catalog schema & compound indexes
│   ├── resource.model.js       # Resource sharing schema
│   ├── staff.model.js          # Faculty schema
│   ├── student.model.js        # Student profile schema (with Department, Semester, Academic Year)
│   └── user.model.js           # User account schema & password hash hooks
├── routes/                 # API Endpoint Definitions
│   ├── admin.route.js          # /api/v1/admin endpoints
│   ├── analytics.route.js      # /api/v1/analytics endpoints
│   ├── auth.route.js           # /api/v1/auth endpoints
│   ├── meeting.route.js        # /api/v1/meetings endpoints
│   ├── notification.route.js   # /api/v1/notifications endpoints
│   ├── project.route.js        # /api/v1/projects endpoints
│   ├── resource.route.js       # /api/v1/resources endpoints
│   ├── student.route.js        # /api/v1/students endpoints
│   ├── user.route.js           # /api/v1/users endpoints
│   └── index.js                # Central API router aggregator
├── middleware/             # Express Middleware
│   ├── auth.js                 # JWT verification middleware
│   ├── roleMiddleware.js       # Role-Based Access Control (RBAC) guard
│   ├── errorHandler.js         # Centralized error handler
│   ├── validate.js             # Input validation middleware
│   └── logger.js               # Winston/Morgan logger instance
├── utils/                  # Utility Modules
│   ├── email.js                # Singleton Nodemailer pool & Brevo/Resend fallback
│   ├── response.js             # Standardized API response builder `{ success, data, message, error }`
│   └── encryption.js           # Crypto password encryption utilities
├── tests/                  # Automated Integration Tests
│   ├── setup.js                # Test suite database initialization & teardown
│   ├── auth.test.js            # Registration, OTP, Login integration tests
│   ├── project.test.js         # Project CRUD & access control tests
│   ├── student.test.js         # Student profile integration tests
│   ├── user.test.js            # User management & role protection tests
│   ├── activity.test.js       # Activity tracking tests
│   └── notification.test.js   # Notification tests
├── docs/                   # OpenAPI / Swagger Specification
├── server.js               # Express application entry & server listener
└── package.json            # Node.js manifest & dependencies
```

---

## 🛠️ API Reference Summary

All API routes are prefixed with `/api/v1`:

### 🔐 Auth & Student Academic Options
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register Student (requires `department`, `semester`, `academicYear`) |
| `POST` | `/api/v1/auth/verify-otp` | Public | Verify 6-digit OTP code & activate account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/v1/auth/academic-options` | Public | Fetch dynamic departments, semesters, and academic years |
| `POST` | `/api/v1/auth/forgot-password` | Public | Trigger password reset email OTP |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset account password using verified token |

### 👥 User & Student Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users` | Admin | Fetch paginated users (`?page=1&limit=10&role=student`) |
| `POST` | `/api/v1/users` | Admin | Onboard new user (validates Student Academic fields) |
| `GET` | `/api/v1/users/:id` | Admin | Fetch single user details |
| `PUT` | `/api/v1/users/:id` | Admin | Update user details & status |
| `DELETE`| `/api/v1/users/:id` | Admin | Delete user account (Super Admin protected) |
| `GET` | `/api/v1/students` | Authenticated | List students with Department, Semester, Academic Year badges |

### 📁 Projects & Guide Allocation
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/projects` | Authenticated | List projects with role-based Scoping |
| `POST` | `/api/v1/projects` | Admin / Faculty | Create new project proposal |
| `GET` | `/api/v1/projects/:id` | Authenticated | Get project details & team roster |
| `PUT` | `/api/v1/projects/:id` | Admin / Guide | Update project details, status, or milestones |
| `POST` | `/api/v1/projects/:id/assign-guide` | Admin | Allocate Faculty guide / co-guide |

### 📊 Analytics & Admin Operations
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/dashboard` | Admin | Aggregate system-wide metrics (<400ms load time) |
| `GET` | `/api/v1/admin/users` | Admin | Preview recent users list for dashboard (`?limit=5`) |
| `GET` | `/api/v1/admin/backups` | Admin | List database backup history |
| `POST` | `/api/v1/admin/backups` | Admin | Trigger manual database backup |

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (v6.0+ local server or MongoDB Atlas URI)

### Setup Instructions

1. **Clone repository & enter backend directory**:
   ```bash
   cd backend
   ```

2. **Install node packages**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/student_project_db
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=1d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FROM_EMAIL=no-reply@studentproject.edu
   FROM_NAME=Student Project System
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The backend server runs on `http://localhost:5000`.

5. **Explore Swagger API Docs**:
   Navigate to `http://localhost:5000/api-docs` in your browser.

6. **Run Integration Test Suite**:
   ```bash
   npm test
   ```
   *Executes all 40 Mocha/Chai integration test cases.*

---

## 🛡️ Security Features

- **RBAC Guard**: Role-based access control prevents students from accessing faculty or administrative routes.
- **Super Admin Protection**: The primary Super Admin account is hard-coded with immutability protections against deletion or demotion.
- **Password Security**: Passwords are hashed using bcrypt with salt rounds. Raw passwords are never exposed in JSON responses (`select: '-password'`).
- **HTTP Security**: Integrated with `helmet` for HTTP header security and `cors` for origin controls.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for details.
