# Architecture & Module Organization Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser / User                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                   ┌─────────▼─────────┐
                   │   React App       │
                   │   (Vite Build)    │
                   └────────┬──────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼──────┐    ┌──────▼────────┐  ┌──────▼──────┐
    │ Routes   │    │  Components   │  │  Context   │
    │ (Pages)  │    │  (UI Logic)   │  │  (State)   │
    └────┬─────┘    └───┬──────┬───┘   └─────┬──────┘
         │              │      │              │
    ┌────▼──────────────▼──────▼──────────────▼─────┐
    │         Services & Utilities Layer           │
    │  (API calls, helpers, validators, hooks)    │
    └──────────────────────────────────────────────┘
         │
    ┌────▼──────────────────────────┐
    │  Backend API                  │
    │  (Authentication, Data CRUD)  │
    └───────────────────────────────┘
```

## Directory Structure in Detail

### Root Level
```
frontend/
├── public/                 # Static assets served as-is
├── src/                   # Source code
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── eslint.config.js       # ESLint rules
└── .env.example           # Environment variables template
```

### src/ Directory Structure

#### Components Organization

```
components/
│
├── layout/               # Page layout wrappers
│   ├── MainLayout.jsx    # Main app layout with sidebar/header
│   └── AuthLayout.jsx    # Authentication pages layout
│
├── common/              # Shared components across app
│   ├── Header.jsx       # Top navigation
│   ├── Sidebar.jsx      # Side navigation
│   ├── Footer.jsx       # Footer component
│   ├── Breadcrumb.jsx   # Navigation breadcrumbs
│   ├── Card.jsx         # Reusable card wrapper
│   ├── Modal.jsx        # Dialog/modal component
│   ├── LoadingSpinner.jsx # Loading indicator
│   ├── Notification.jsx  # Toast notifications
│   └── BackToTop.jsx    # Scroll to top button
│
├── ui/                  # Low-level UI components
│   ├── Button.jsx       # Button component
│   ├── Input.jsx        # Text input component
│   ├── Select.jsx       # Dropdown component
│   ├── Table.jsx        # Data table component
│   ├── Calendar.jsx     # Calendar component
│   ├── FileUpload.jsx   # File upload component
│   └── StatCard.jsx     # Statistics card
│
└── pages/              # Feature-based page components
    │
    ├── auth/           # Authentication pages
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   └── ForgotPassword.jsx
    │
    ├── admin/          # Admin-only pages
    │   ├── AdminDashboard.jsx
    │   ├── UserManagement.jsx
    │   ├── SystemSettings.jsx
    │   ├── PermissionsManager.jsx
    │   ├── BackupRestore.jsx
    │   ├── AuditLog.jsx
    │   └── BatchOperations.jsx
    │
    ├── dashboard/      # User dashboards
    │   └── Dashboard.jsx
    │
    ├── students/       # Student management
    │   ├── StudentsList.jsx
    │   ├── StudentForm.jsx
    │   ├── StudentFilters.jsx
    │   ├── Staff.jsx
    │   └── Attendance.jsx
    │
    ├── projects/       # Project management
    │   ├── ProjectList.jsx
    │   ├── ProjectDetails.jsx
    │   ├── ProjectProposal.jsx
    │   ├── ProjectTypes.jsx
    │   ├── ProjectGroups.jsx
    │   └── GuideAllocation.jsx
    │
    ├── courses/        # Course management
    │   ├── CourseCatalog.jsx
    │   ├── CourseDetails.jsx
    │   ├── CourseMaterials.jsx
    │   ├── CourseRegistration.jsx
    │   ├── CourseSchedule.jsx
    │   ├── MyCourses.jsx
    │   └── SyllabusViewer.jsx
    │
    ├── assignments/    # Assignment management
    │   ├── AssignmentList.jsx
    │   ├── AssignmentDetails.jsx
    │   ├── AssignmentSubmission.jsx
    │   ├── AssignmentUpload.jsx
    │   ├── GradingRubric.jsx
    │   ├── PeerReview.jsx
    │   └── SubmissionHistory.jsx
    │
    ├── meetings/       # Meeting management
    │   ├── MeetingCalendar.jsx
    │   ├── MeetingList.jsx
    │   └── MeetingForm.jsx
    │
    ├── portfolio/      # Student portfolio
    │   ├── PortfolioView.jsx
    │   ├── PortfolioBuilder.jsx
    │   ├── ProjectGallery.jsx
    │   ├── SkillMatrix.jsx
    │   ├── TranscriptViewer.jsx
    │   └── AchievementBadges.jsx
    │
    ├── resources/      # Learning resources
    │   ├── DocumentLibrary.jsx
    │   ├── ResourceBrowser.jsx
    │   ├── ResourceDetails.jsx
    │   ├── ResourceUpload.jsx
    │   ├── TemplateLibrary.jsx
    │   └── TutorialVideos.jsx
    │
    ├── collaboration/  # Team collaboration
    │   ├── ChatWindow.jsx
    │   ├── DiscussionBoard.jsx
    │   ├── DiscussionThread.jsx
    │   ├── FileSharing.jsx
    │   ├── TeamChat.jsx
    │   ├── TeamDirectory.jsx
    │   └── Workspace.jsx
    │
    ├── analytics/      # Analytics & reporting
    │   ├── AnalyticsDashboard.jsx
    │   ├── GradeDistribution.jsx
    │   ├── PerformanceMetrics.jsx
    │   ├── ProgressAnalytics.jsx
    │   ├── UsageStatistics.jsx
    │   └── Visualizations.jsx
    │
    ├── evaluation/     # Evaluation & feedback
    │   ├── EvaluationCriteria.jsx
    │   ├── EvaluationForm.jsx
    │   ├── FeedbackDashboard.jsx
    │   ├── PeerEvaluation.jsx
    │   ├── RubricBuilder.jsx
    │   └── SelfEvaluation.jsx
    │
    ├── timeline/       # Project timeline
    │   ├── GanttChart.jsx
    │   ├── MilestoneTracker.jsx
    │   ├── ProjectTimeline.jsx
    │   ├── RoadmapViewer.jsx
    │   ├── SprintPlanner.jsx
    │   └── TimelineEditor.jsx
    │
    ├── help/          # Help & support
    │   ├── FAQ.jsx
    │   ├── HelpCenter.jsx
    │   ├── KnowledgeBase.jsx
    │   ├── SupportTicket.jsx
    │   ├── Tutorials.jsx
    │   └── UserGuide.jsx
    │
    ├── reports/       # Report generation
    │   ├── Reports.jsx
    │   └── ExportOptions.jsx
    │
    └── settings/      # User settings
        ├── Settings.jsx
        ├── ProfileSettings.jsx
        └── Profile.jsx
```

#### Other Key Directories

```
context/                # React Context for global state
├── AuthContext.jsx     # Authentication state & methods
├── NotificationContext.jsx # Notification system
└── ThemeContext.jsx    # Theme management (light/dark)

hooks/                  # Custom React hooks
├── useAuth.js         # Authentication hook
├── useLocalStorage.js # Local storage persistence
├── useNotification.js # Notification system hook
└── useScreenSize.js   # Responsive design hook

services/               # API & data services
├── authService.js     # Authentication API calls
├── studentService.js  # Student data API calls
├── projectService.js  # Project API calls
└── meetingService.js  # Meeting API calls

utils/                  # Utility functions
├── api.js             # Axios API instance
├── constants.js       # Application constants
├── helpers.js         # Helper functions
└── validation.js      # Form validation rules

assets/                 # Static assets
├── images/           # Image files
└── styles/           # Global styles
    ├── global.css
    └── tailwind.css

```

### App Entry Points

```
App.jsx                 # Main app component with routing
main.jsx                # React DOM render & providers
index.html              # HTML template
index.css               # Global styles
```

## Component Hierarchy

### Route Structure in App.jsx

```
<Router>
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<AuthLayout><Login/></AuthLayout>} />
    <Route path="/register" element={<AuthLayout><Register/></AuthLayout>} />
    
    {/* Protected Routes */}
    <Route element={<ProtectedRoute><MainLayout/></ProtectedRoute>}>
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/projects" element={<ProjectList/>} />
      
      {/* Admin-only routes */}
      <Route path="/admin" element={<AdminDashboard/>} />
      <Route path="/admin/users" element={<UserManagement/>} />
      
      {/* Student routes */}
      <Route path="/portfolio" element={<PortfolioView/>} />
      <Route path="/assignments" element={<AssignmentList/>} />
    </Route>
  </Routes>
</Router>
```

## Data Flow

### Authentication Flow
```
1. User enters credentials on Login page
2. Login component calls authService.login()
3. Service sends request to backend
4. Backend validates and returns JWT token
5. Token stored in localStorage
6. AuthContext updates global auth state
7. User redirected to dashboard
8. All subsequent requests include token
```

### Data Fetching Flow
```
1. Component mounts or dependency changes
2. useEffect triggers data fetching
3. Service layer calls API endpoint
4. Response data processed and validated
5. Component state updated with data
6. UI re-renders with new data
7. Loading/error states managed
```

### Theme Management Flow
```
1. User toggles dark mode
2. ThemeContext updates theme state
3. Theme stored in localStorage
4. document class updated
5. Tailwind dark: styles applied
6. Components re-render with new styles
```

## Module Dependencies

### External Dependencies
- **react**: UI framework
- **react-dom**: DOM rendering
- **react-router-dom**: Client-side routing
- **tailwindcss**: Utility-first CSS
- **react-hot-toast**: Toast notifications
- **@headlessui/react**: Unstyled accessible components
- **@heroicons/react**: Icon library
- **lucide-react**: Additional icons
- **@fortawesome/fontawesome-free**: Font awesome icons

### No External Backend
- **Mock data**: All data is mocked in services
- **localStorage**: Browser storage for persistence
- **Ready for API integration**: Replace mock calls with real API

## Communication Patterns

### Component to Component
```jsx
// Via props
<ChildComponent data={data} onAction={handleAction} />

// Via Context
const { data, methods } = useContext(MyContext);

// Via Custom Hooks
const { state, dispatch } = useCustomHook();
```

### Component to Service
```jsx
// Service layer handles all API communication
const response = await authService.login(email, password);
const data = await projectService.getProjects();
```

### Service to Storage
```jsx
// Services can persist data to localStorage
localStorage.setItem(key, JSON.stringify(data));
const savedData = JSON.parse(localStorage.getItem(key));
```

## State Management Strategy

### Local Component State (Most Common)
```jsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({});
```
Use for: UI toggles, form inputs, component-specific state

### Context API (Global State)
```jsx
const { user, isAuthenticated } = useAuth();
const { theme, toggleTheme } = useTheme();
const { notifications, addNotification } = useNotification();
```
Use for: Authentication, theme, notifications

### Custom Hooks (Logic Reuse)
```jsx
const { value, setValue } = useLocalStorage(key, defaultValue);
const { width, isMobile } = useScreenSize();
```
Use for: Common logic patterns, computed state

## Error Handling Strategy

### Component Level
```jsx
try {
  const data = await fetchData();
} catch (error) {
  showNotification({ type: 'error', message: 'Failed to load' });
}
```

### Application Level
```jsx
// ErrorBoundary in main.jsx catches React errors
// Error fallback UI displayed to user
```

### Service Level
```jsx
// Services validate responses and handle errors
// Throw descriptive errors for components to catch
```

## Performance Optimization Points

1. **Code Splitting**: Lazy-loaded routes reduce initial bundle
2. **Component Memoization**: memo() prevents unnecessary renders
3. **Data Memoization**: useMemo() prevents recalculations
4. **Callback Memoization**: useCallback() prevents child re-renders
5. **Lazy Loading**: Images and components loaded on demand
6. **CSS Purging**: Unused styles removed in production
7. **Bundle Chunking**: Vendor code split from app code

## Security Considerations

1. **Authentication**: JWT token-based with localStorage
2. **Authorization**: Role-based access control on routes
3. **Input Validation**: Client-side validation + server validation needed
4. **API Security**: All requests should use HTTPS in production
5. **Data Protection**: No sensitive data in localStorage
6. **XSS Prevention**: React automatically escapes JSX
7. **CSRF Protection**: Implement on backend

## Testing Strategy

### Unit Testing
- Test utility functions
- Test hooks logic
- Test component props validation

### Component Testing
- Test component rendering
- Test user interactions
- Test state changes

### Integration Testing
- Test component communication
- Test context provider integration
- Test route navigation

### E2E Testing
- Test complete user flows
- Test authentication
- Test data persistence

## Deployment Considerations

### Build Process
```bash
npm run build  # Produces optimized dist/ folder
```

### Environment Variables
- Create .env file from .env.example
- Set API_URL for backend
- Configure for development/production

### Performance Optimization
- Enable gzip compression on server
- Set cache headers for static assets
- Use CDN for asset delivery
- Monitor Core Web Vitals

### Monitoring
- Track error rates
- Monitor performance metrics
- Collect user analytics
- Alert on critical failures

## Future Architecture Improvements

1. **Backend Integration**: Replace mock services with real API
2. **TypeScript**: Add type safety across codebase
3. **State Management**: Consider Redux if app complexity grows
4. **Testing**: Add unit, integration, and E2E tests
5. **PWA**: Add service workers for offline support
6. **GraphQL**: Consider GraphQL for complex data requirements
7. **Micro-frontends**: Split into independent deployable units
