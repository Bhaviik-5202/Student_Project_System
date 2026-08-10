# 📜 Changelog

All notable changes to the **Student Project Management System** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-08-10

### 🎓 Student Academic Profile Flow
- **Student Signup Integration**: Added required **Department**, **Semester** (`Semester 1` .. `Semester 8`), and **Academic Year** (`2024-25` .. `2027-28`) fields to Student registration.
- **Dynamic Academic Options Endpoint**: Added public REST endpoint `GET /api/v1/auth/academic-options` to serve dynamic database departments and academic terms.
- **OTP Academic Persistence**: Updated OTP verification model and services to preserve student academic details through verification and user creation.
- **Admin Student Management**: Integrated Department, Semester, and Academic Year fields in `UserForm.jsx` for student account creation/editing.
- **Academic Badges & Profile**: Rendered Academic Year and Semester badges across Student Directory (`StudentsList.jsx`) and Student Profile Settings (`Profile.jsx`).

### ⚡ System Performance & Sub-200ms API Optimization
- **Nodemailer Singleton Transporter Pool**: Refactored email utility to cache and reuse a single pooled SMTP transporter (`pool: true`, `maxConnections: 5`, `maxMessages: 100`), eliminating per-request TLS handshakes.
- **Asynchronous OTP Email Dispatch**: Safely persists 6-digit OTP in MongoDB before returning sub-200ms API response to frontend, dispatching email concurrently in background.
- **Fast Admin Dashboard (<400ms)**: Added query parameter support (`limit: 5`, `select`) in `adminService.getUsers` and `user.service.js` to avoid fetching full user collections.
- **Compound MongoDB Indexing**: Added compound indexes on `User ({ role: 1, status: 1 })`, `User ({ createdAt: -1 })`, and `Project ({ status: 1, updatedAt: -1 })`.
- **In-Memory Domain MX Cache**: Added `domainMxCache` map to eliminate redundant 3-second DNS timeouts during deliverability checks.

### 📖 Documentation Overhaul
- **Comprehensive Documentation Refresh**: Thoroughly updated all project Markdown files (`README.md`, `frontend/README.md`, `backend/README.md`, `backend/ARCHITECTURE.md`, `backend/STRUCTURE.md`, `INSTALL.md`, `CHANGELOG.md`).

---

## [1.1.0] - 2026-08-08

### ✨ UI/UX & Responsive Enhancements
- **Mobile-First Layout Redesign**: Introduced a tailored native-app feel for mobile devices, moving away from desktop-scaled interfaces.
- **Premium PageHeader**: Redesigned mobile PageHeaders with custom glassmorphic top-accent borders, dynamic padding, and optimized spacing.
- **Settings Navigation**: Replaced horizontally scrolling tabs with a clean, space-efficient dropdown menu for mobile users on the Application Settings page.
- **Robust Layout Calculations**: Refactored the `BackToTop` button logic to dynamically calculate visible footers via DOM intersections, completely eliminating footer overlaps and broken positioning on mobile and desktop.
- **Enhanced Mobile Footers**: Added a dedicated, glassmorphic `MobileFooter` optimized for small viewports.

---

## [1.0.0] - 2026-07-30

### 🎉 Added
- **Authentication & Security**: JWT Bearer auth, OTP validation, bcrypt password hashing, and role middleware.
- **Admin Module**: Dashboard analytics, User Management, System Settings, Audit Logs, and Data Backup/Restore.
- **Faculty Module**: Mentorship overview, Guide allocation, Review submissions, Meeting scheduler, and Group analytics.
- **Student Module**: Project proposals, Milestone tracker, Resource library, and Meeting attendance.
- **Project Management**: Lifecycle state transitions (`draft`, `assigned`, `in_progress`, `under_review`, `completed`, `archived`).
- **Resource Management**: Document, tutorial, and template libraries.
- **Interactive UI**: Dark/Light mode theme system, responsive CSS layout, and loading/empty state handling.

### 🧹 Cleaned & Optimized
- Removed misplaced dependencies and dead backend modules.
- Enforced 0 ESLint warnings and errors across the frontend codebase.
- Added Mongoose `.lean()` optimizations and indexing across model collections.
