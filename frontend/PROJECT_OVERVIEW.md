# Student Project Management System - Frontend

A modern React + Vite web application for managing student projects in an educational institution. This system enables students to submit projects, guides to manage and review projects, and administrators to oversee the entire system.

## 🎯 Project Features

### For Students
- **Dashboard**: View project status, deadlines, and recent activities
- **Project Submission**: Submit new project proposals with detailed information
- **Attendance Tracking**: Track attendance for project meetings
- **Profile Management**: Update personal information and credentials
- **Meeting Scheduling**: View and schedule meetings with guides

### For Faculty/Guides
- **Project Management**: Review and manage student projects
- **Group Allocation**: Allocate students to project groups
- **Guide Assignment**: Manage guide assignments for projects
- **Reporting**: Generate detailed reports on project progress
- **Meeting Management**: Schedule and track project review meetings

### For Administrators
- **System Management**: Manage users (students, faculty, admin)
- **Project Types**: Define and manage different project types
- **Project Groups**: Create and manage project groups
- **Reports**: Generate comprehensive system reports
- **Settings**: Configure system-wide settings

## 📋 Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.4.5
- **Routing**: React Router DOM 6.30.3
- **Styling**: Tailwind CSS 3.4.19
- **Icons**: Font Awesome 6.4.0 + Lucide React 0.562.0
- **Notifications**: React Hot Toast 2.6.0
- **Development**: ESLint, PostCSS, Autoprefixer

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
│   └── manifest.json
├── src/
│   ├── assets/               # Images, styles, and static resources
│   │   ├── images/
│   │   └── styles/
│   ├── components/           # React components
│   │   ├── common/          # Shared components (Header, Sidebar, etc.)
│   │   ├── layout/          # Layout components (MainLayout, AuthLayout)
│   │   ├── pages/           # Page components organized by feature
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── dashboard/   # Dashboard-related components
│   │   │   ├── meetings/    # Meeting management
│   │   │   ├── projects/    # Project management
│   │   │   ├── reports/     # Reporting and analytics
│   │   │   ├── students/    # Student management
│   │   │   └── settings/    # Settings pages
│   │   └── ui/              # Reusable UI components
│   ├── context/             # React Context for state management
│   │   ├── AuthContext.jsx  # Authentication state
│   │   ├── ThemeContext.jsx # Theme management
│   │   └── NotificationContext.jsx # Notifications
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useLocalStorage.js
│   │   ├── useNotification.js
│   │   └── useScreenSize.js
│   ├── services/            # API service calls
│   │   ├── authService.js
│   │   ├── meetingService.js
│   │   ├── projectService.js
│   │   └── studentService.js
│   ├── utils/               # Utility functions and constants
│   │   ├── api.js
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validation.js
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   ├── index.css           # Global styles
│   └── App.css             # App-specific styles
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.js        # ESLint configuration
└── package.json            # Project dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🔐 Authentication

The application uses JWT-based authentication with three user roles:

1. **Admin**: Full system access
2. **Faculty**: Project review and student management
3. **Student**: Project submission and tracking

### Mock Users for Testing

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | admin123 |
| Faculty | faculty@university.edu | faculty123 |
| Student | student@university.edu | student123 |

**Note**: These are mock credentials for development. Update `authService.js` to connect to a real backend.

## 🎨 UI Components

### Common Components
- **Header**: Top navigation bar with user menu
- **Sidebar**: Navigation menu with role-based links
- **Footer**: Footer information
- **Breadcrumb**: Navigation breadcrumbs
- **Card**: Reusable card component
- **Modal**: Modal dialog component
- **LoadingSpinner**: Loading indicator
- **Notification**: Toast notifications

### UI Components
- **Button**: Customizable button component
- **Input**: Text input field
- **Select**: Select dropdown
- **Table**: Data table with sorting and filtering
- **Calendar**: Calendar component for date selection
- **FileUpload**: File upload component
- **StatCard**: Statistics display card

## 🔄 State Management

The application uses React Context API for state management:

- **AuthContext**: Manages authentication state, user information, and auth methods
- **ThemeContext**: Handles application theme (light/dark mode)
- **NotificationContext**: Manages toast notifications

## 🎯 Key Features

### Role-Based Access Control
Routes are protected based on user roles. Unauthorized access attempts redirect to dashboard.

### Responsive Design
The application is fully responsive and works on desktop, tablet, and mobile devices using Tailwind CSS.

### Toast Notifications
React Hot Toast provides user feedback through toast notifications for actions and errors.

### Keyboard Shortcuts
- **Ctrl/Cmd + B**: Toggle sidebar
- **Escape**: Close sidebar on mobile

## 📝 Available Routes

### Public Routes
- `/login` - Login page

### Protected Routes (All authenticated users)
- `/dashboard` - Dashboard
- `/profile` - User profile
- `/settings` - Settings
- `/meetings` - Meeting calendar
- `/reports` - Reports and analytics

### Admin Routes
- `/students` - Student management
- `/staff` - Staff management
- `/project-types` - Project type management

### Faculty + Admin Routes
- `/project-groups` - Project group management
- `/guide-allocation` - Guide allocation management

### Student Routes
- `/my-projects` - Student projects
- `/proposal` - Project proposal submission
- `/attendance` - Attendance tracking

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## ✨ Code Quality

The project uses ESLint for code quality. Run the linter:

```bash
npm run lint
```

## 🐛 Known Issues & Future Improvements

1. **Backend Integration**: Currently uses mock data. Integrate with actual backend API
2. **Chart Library**: Remove dependency on chart.js if not needed, or install it if implementing analytics
3. **Form Validation**: Implement comprehensive form validation across all forms
4. **Error Handling**: Enhance error handling with specific error messages
5. **Performance**: Implement code splitting and lazy loading for larger bundles
6. **Accessibility**: Improve accessibility features (ARIA labels, keyboard navigation)
7. **Testing**: Add unit and integration tests using Jest and React Testing Library
8. **TypeScript**: Consider migrating to TypeScript for better type safety

## 📚 Component Documentation

### AuthContext
Provides authentication functionality including login, logout, registration, and user state management.

### MainLayout
Main application layout with header, sidebar, breadcrumb, and content area.

### Dashboard
Role-specific dashboard showing relevant information for admin, faculty, or students.

### Navigation
The Sidebar component provides role-based navigation with dynamic menu items.

## 🤝 Contributing

When contributing to this project:
1. Follow the existing code structure and naming conventions
2. Remove unused imports and code
3. Use meaningful component and variable names
4. Add comments for complex logic
5. Test thoroughly before submitting

## 📝 License

This project is part of the CSE Sem-4 Student Project at the university.

## 📞 Support

For issues and questions, please contact the development team.

---

**Last Updated**: January 2026
**Project Status**: Active Development
