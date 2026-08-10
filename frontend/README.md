# Student Project System – Frontend Application

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.x-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.x-22B5BF?style=for-the-badge&logo=react&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-0.x-F56565?style=for-the-badge&logo=feather&logoColor=white)

The **Student Project System** frontend is an enterprise-grade, responsive React 18 web application designed for academic institutions to manage student project lifecycles, team allocations, faculty guidance, proposal evaluations, and administrative oversight.

---

## ✨ Core Highlights & Architectural Features

### 🎓 Complete Student Academic Profile Flow
- **Registration Integration**: Captures required **Department**, **Semester** (`Semester 1` .. `Semester 8`), and **Academic Year** (`2024-25`, `2025-26`, `2026-27`, `2027-28`) during Student onboarding.
- **Dynamic Options API**: Fetches active database departments dynamically from the backend endpoint (`GET /api/v1/auth/academic-options`).
- **OTP Verification Flow**: Seamlessly preserves academic profile details across email verification and account creation.
- **Unified Academic Visibility**: Displays Academic Year and Semester badges across the Student Directory, Admin User Management (`UserForm.jsx`), and Student Profile Settings (`Profile.jsx`).

### ⚡ Sub-Second Performance & Optimized UI
- **Instant Signup Navigation (<200ms)**: Async OTP email dispatch allows immediate transition to the OTP verification screen.
- **Fast Admin Dashboard (<400ms)**: Query pagination (`limit: 5`) and payload projection prevent fetching unnecessary full-collection datasets on initial load.
- **Memoized Component Renderers**: Utilizes `React.memo`, `useCallback`, and `useMemo` across heavy list components (`StudentsList.jsx`, `ProjectList.jsx`) to avoid re-render lag.

### 🎨 Premium Design System & UI/UX
- **Modern Glassmorphism & Dark Mode**: Tailored dark/light theme switching with smooth background blur effects and refined color palettes.
- **Responsive Layout Engine**: Seamless adaptive layout for Desktop, Tablet, and Mobile devices (including Mobile Bottom Navigation).
- **Smart Floating Controls**: Adaptive `BackToTop` button with intelligent viewport intersection and footer/bottom-nav clearance logic.
- **Interactive Feedback**: Rich toast notifications via `react-hot-toast` and accessible modal confirmation dialogs.

---

## 🛠️ Technology Stack

| Category | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | **React 18.2** | UI component architecture and state hooks |
| **Build System** | **Vite 5.x** | Ultra-fast HMR and optimized production bundling |
| **Styling & Design** | **TailwindCSS 3.x** | Utility-first CSS engine with dark mode support |
| **Animations** | **Framer Motion 10.x** | Micro-interactions, page transitions, and gestures |
| **Data Visualization** | **Recharts 2.x** | Analytics charts (Line, Pie, Bar) on Admin Dashboard |
| **Icons & Media** | **Lucide React** | Clean, accessible vector icon library |
| **HTTP Client** | **Axios** | API request instance with JWT token interceptors |
| **Notifications** | **React Hot Toast** | Lightweight floating toast notifications |
| **Routing** | **React Router DOM 6.x** | Declarative client-side routing & route guards |

---

## 📁 Directory & Component Architecture

```text
frontend/
├── public/                  # Public static assets & favicon icons
├── src/
│   ├── assets/              # Graphics, illustrations, and logos
│   ├── components/
│   │   ├── common/          # Layout wrappers & floating controls
│   │   │   ├── Header.jsx           # Global Header banner with theme toggle & user profile badge
│   │   │   ├── Footer.jsx           # Main Footer & Minimal Footer components
│   │   │   ├── BackToTop.jsx        # Smart Back-to-Top button with footer clearance logic
│   │   │   ├── Navbar.jsx           # Desktop navigation bar
│   │   │   ├── BottomNav.jsx        # Mobile navigation bar
│   │   │   └── Sidebar.jsx          # Collapsible sidebar navigation
│   │   ├── pages/
│   │   │   ├── admin/               # Admin Management Suite
│   │   │   │   ├── AdminDashboard.jsx   # System metrics, user preview, audit feed, charts
│   │   │   │   ├── UserManagement.jsx   # User list table with role & status filters
│   │   │   │   ├── UserForm.jsx         # Create/Edit User modal with Student Academic fields
│   │   │   │   ├── AuditLogs.jsx        # System audit trail logging table
│   │   │   │   ├── SystemSettings.jsx   # Platform & security config
│   │   │   │   └── BackupManagement.jsx # Database backup & restore controls
│   │   │   ├── auth/                # Authentication Pages
│   │   │   │   ├── Login.jsx            # Account login form
│   │   │   │   ├── Register.jsx         # Role-based Signup (Student with Academic fields / Faculty)
│   │   │   │   ├── OtpVerification.jsx  # 6-digit OTP verification UI
│   │   │   │   └── ForgotPassword.jsx   # Password reset request form
│   │   │   ├── dashboard/           # Unified Dashboard Router
│   │   │   │   ├── Dashboard.jsx        # Role-based dashboard resolver
│   │   │   │   ├── StudentDashboard.jsx # Student-specific metrics & team overview
│   │   │   │   └── FacultyDashboard.jsx # Guide allocation & review overview
│   │   │   ├── projects/            # Project Management Suite
│   │   │   │   ├── ProjectList.jsx      # Catalog with Grid & Table views and filters
│   │   │   │   ├── ProjectDetails.jsx   # In-depth project view & team member list
│   │   │   │   ├── ProjectProposal.jsx  # New project proposal submission form
│   │   │   │   ├── GuideAllocation.jsx  # Faculty guide assignment module
│   │   │   │   └── ProjectTypes.jsx     # UDP vs IDP project categorization
│   │   │   ├── settings/            # User Settings
│   │   │   │   ├── Profile.jsx          # Profile details & Student Academic Info form
│   │   │   │   └── Security.jsx         # Password update & security preferences
│   │   │   └── students/            # Student Directory Suite
│   │   │       ├── StudentsList.jsx     # Student list with Semester & Academic Year badges
│   │   │       └── StudentDetails.jsx  # Student academic summary modal
│   │   └── ui/                  # UI Primitive Components
│   │       ├── Button.jsx           # Styled button variants
│   │       ├── Card.jsx             # Card container primitive
│   │       ├── Modal.jsx            # Accessible modal overlay dialog
│   │       ├── StatusBadge.jsx      # Status pill renderer
│   │       └── Table.jsx            # Standardized responsive table primitive
│   ├── context/             # React Context Providers
│   │   ├── AuthContext.jsx      # Auth state, login/logout, user session
│   │   └── ThemeContext.jsx     # Dark / Light theme provider
│   ├── hooks/               # Custom React Hooks
│   │   ├── useAuth.js           # Auth Context accessor
│   │   ├── useProjects.js       # Project catalog fetcher & filter state
│   │   └── useNotification.js   # Toast notification helper
│   ├── services/            # Axios API Modules
│   │   ├── api.js               # Central Axios instance with request/response interceptors
│   │   ├── authService.js       # Auth, registration, OTP APIs
│   │   ├── adminService.js      # Admin users & backup APIs
│   │   ├── projectService.js    # Project CRUD & stats APIs
│   │   ├── studentService.js    # Student directory APIs
│   │   └── auditlogService.js   # Audit logs APIs
│   ├── utils/               # Utility functions & event bus
│   ├── App.jsx              # Client-side routes & Role Guards
│   └── main.jsx             # Entry point
├── index.html               # Vite HTML template
├── vite.config.js           # Vite build config
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # App dependencies & npm scripts
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### Setup Instructions

1. **Clone the repository & enter the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend` root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The optimized production bundle will be generated in the `dist/` directory.

6. **Preview Production Build**:
   ```bash
   npm run preview
   ```

7. **Execute Code Linting**:
   ```bash
   npm run lint
   ```

---

## 🔒 Authentication & Role-Based Access Control (RBAC)

The frontend enforces strict client-side role guards:

- **Token Management**: JWT tokens are automatically stored upon login/verification and included in all API requests via the Axios authorization header (`Bearer <token>`).
- **Role Routing**:
  - `admin`: Access to Admin Dashboard, User Management, Audit Logs, Backup Operations, System Settings.
  - `faculty`: Access to Faculty Dashboard, Guide Allocation, Proposal Reviews, Project Catalog.
  - `student`: Access to Student Dashboard, Project Submissions, My Projects, Profile Settings.
- **Unauthenticated Redirects**: Protected routes automatically redirect unauthenticated users to `/login`.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for details.
