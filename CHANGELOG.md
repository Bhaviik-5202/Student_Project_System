# 📜 Changelog

All notable changes to the **Student Project Management System** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
