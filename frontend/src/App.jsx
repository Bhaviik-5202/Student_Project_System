// src/App.jsx
import { lazy, Suspense, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Eager-loaded components (critical path)
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy-loaded components (code splitting for better performance)
// Auth Pages
const Login = lazy(() => import("./components/pages/auth/Login"));
const Register = lazy(() => import("./components/pages/auth/Register"));
const ForgotPassword = lazy(
  () => import("./components/pages/auth/ForgotPassword"),
);

// Dashboard Pages
const Dashboard = lazy(() => import("./components/pages/dashboard/Dashboard"));
const AdminDashboard = lazy(
  () => import("./components/pages/admin/AdminDashboard"),
);

// Admin Pages
const StudentsList = lazy(
  () => import("./components/pages/students/StudentsList"),
);
const StaffManagement = lazy(() => import("./components/pages/students/Staff"));
const UserManagement = lazy(
  () => import("./components/pages/admin/UserManagement"),
);
const PermissionsManager = lazy(
  () => import("./components/pages/admin/PermissionsManager"),
);
const SystemSettings = lazy(
  () => import("./components/pages/admin/SystemSettings"),
);
const BackupRestore = lazy(
  () => import("./components/pages/admin/BackupRestore"),
);
const AuditLog = lazy(() => import("./components/pages/admin/AuditLog"));
const BatchOperations = lazy(
  () => import("./components/pages/admin/BatchOperations"),
);

// Student Pages
const StudentAttendance = lazy(
  () => import("./components/pages/students/Attendance"),
);
const StudentForm = lazy(
  () => import("./components/pages/students/StudentForm"),
);
const StudentFilters = lazy(
  () => import("./components/pages/students/StudentFilters"),
);

// Project Pages
const ProjectList = lazy(
  () => import("./components/pages/projects/ProjectList"),
);
const ProjectDetails = lazy(
  () => import("./components/pages/projects/ProjectDetails"),
);
const ProjectProposal = lazy(
  () => import("./components/pages/projects/ProjectProposal"),
);
const ProjectTypes = lazy(
  () => import("./components/pages/projects/ProjectTypes"),
);
const ProjectGroups = lazy(
  () => import("./components/pages/projects/ProjectGroups"),
);
const GuideAllocation = lazy(
  () => import("./components/pages/projects/GuideAllocation"),
);

// Meeting Pages
const MeetingCalendar = lazy(
  () => import("./components/pages/meetings/MeetingCalendar"),
);
const MeetingList = lazy(
  () => import("./components/pages/meetings/MeetingList"),
);
const MeetingForm = lazy(
  () => import("./components/pages/meetings/MeetingForm"),
);

// Settings Pages
const Profile = lazy(() => import("./components/pages/settings/Profile"));
const ProfileSettings = lazy(
  () => import("./components/pages/settings/ProfileSettings"),
);
const Settings = lazy(() => import("./components/pages/settings/Settings"));

// Reports Pages
const Reports = lazy(() => import("./components/pages/reports/Reports"));
const ExportOptions = lazy(
  () => import("./components/pages/reports/ExportOptions"),
);

// Resource Pages
const DocumentLibrary = lazy(
  () => import("./components/pages/resources/DocumentLibrary"),
);
const ResourceBrowser = lazy(
  () => import("./components/pages/resources/ResourceBrowser"),
);
const ResourceDetails = lazy(
  () => import("./components/pages/resources/ResourceDetails"),
);
const ResourceUpload = lazy(
  () => import("./components/pages/resources/ResourceUpload"),
);
const TemplateLibrary = lazy(
  () => import("./components/pages/resources/TemplateLibrary"),
);
const TutorialVideos = lazy(
  () => import("./components/pages/resources/TutorialVideos"),
);

// Portfolio Pages
const AchievementBadges = lazy(
  () => import("./components/pages/portfolio/AchievementBadges"),
);
const PortfolioBuilder = lazy(
  () => import("./components/pages/portfolio/PortfolioBuilder"),
);
const PortfolioView = lazy(
  () => import("./components/pages/portfolio/PortfolioView"),
);
const ProjectGallery = lazy(
  () => import("./components/pages/portfolio/ProjectGallery"),
);
const SkillMatrix = lazy(
  () => import("./components/pages/portfolio/SkillMatrix"),
);
const TranscriptViewer = lazy(
  () => import("./components/pages/portfolio/TranscriptViewer"),
);

// Course Pages
const CourseCatalog = lazy(
  () => import("./components/pages/courses/CourseCatalog"),
);
const CourseDetails = lazy(
  () => import("./components/pages/courses/CourseDetails"),
);
const CourseMaterials = lazy(
  () => import("./components/pages/courses/CourseMaterials"),
);
const CourseRegistration = lazy(
  () => import("./components/pages/courses/CourseRegistration"),
);
const CourseSchedule = lazy(
  () => import("./components/pages/courses/CourseSchedule"),
);
const MyCourses = lazy(() => import("./components/pages/courses/MyCourses"));
const SyllabusViewer = lazy(
  () => import("./components/pages/courses/SyllabusViewer"),
);

// Assignment Pages
const AssignmentList = lazy(
  () => import("./components/pages/assignments/AssignmentList"),
);
const AssignmentDetails = lazy(
  () => import("./components/pages/assignments/AssignmentDetails"),
);
const AssignmentSubmission = lazy(
  () => import("./components/pages/assignments/AssignmentSubmission"),
);
const AssignmentUpload = lazy(
  () => import("./components/pages/assignments/AssignmentUpload"),
);
const GradingRubric = lazy(
  () => import("./components/pages/assignments/GradingRubric"),
);
const PeerReview = lazy(
  () => import("./components/pages/assignments/PeerReview"),
);
const SubmissionHistory = lazy(
  () => import("./components/pages/assignments/SubmissionHistory"),
);

// Collaboration Pages
const ChatWindow = lazy(
  () => import("./components/pages/collaboration/ChatWindow"),
);
const DiscussionBoard = lazy(
  () => import("./components/pages/collaboration/DiscussionBoard"),
);
const DiscussionThread = lazy(
  () => import("./components/pages/collaboration/DiscussionThread"),
);
const FileSharing = lazy(
  () => import("./components/pages/collaboration/FileSharing"),
);
const TeamChat = lazy(
  () => import("./components/pages/collaboration/TeamChat"),
);
const TeamDirectory = lazy(
  () => import("./components/pages/collaboration/TeamDirectory"),
);
const Workspace = lazy(
  () => import("./components/pages/collaboration/Workspace"),
);

// Analytics Pages
const AnalyticsDashboard = lazy(
  () => import("./components/pages/analytics/AnalyticsDashboard"),
);
const GradeDistribution = lazy(
  () => import("./components/pages/analytics/GradeDistribution"),
);
const PerformanceMetrics = lazy(
  () => import("./components/pages/analytics/PerformanceMetrics"),
);
const ProgressAnalytics = lazy(
  () => import("./components/pages/analytics/ProgressAnalytics"),
);
const UsageStatistics = lazy(
  () => import("./components/pages/analytics/UsageStatistics"),
);
const Visualizations = lazy(
  () => import("./components/pages/analytics/Visualizations"),
);

// Evaluation Pages
const EvaluationCriteria = lazy(
  () => import("./components/pages/evaluation/EvaluationCriteria"),
);
const EvaluationForm = lazy(
  () => import("./components/pages/evaluation/EvaluationForm"),
);
const FeedbackDashboard = lazy(
  () => import("./components/pages/evaluation/FeedbackDashboard"),
);
const PeerEvaluation = lazy(
  () => import("./components/pages/evaluation/PeerEvaluation"),
);
const RubricBuilder = lazy(
  () => import("./components/pages/evaluation/RubricBuilder"),
);
const SelfEvaluation = lazy(
  () => import("./components/pages/evaluation/SelfEvaluation"),
);

// Timeline Pages
const GanttChart = lazy(() => import("./components/pages/timeline/GanttChart"));
const MilestoneTracker = lazy(
  () => import("./components/pages/timeline/MilestoneTracker"),
);
const ProjectTimeline = lazy(
  () => import("./components/pages/timeline/ProjectTimeline"),
);
const RoadmapViewer = lazy(
  () => import("./components/pages/timeline/RoadmapViewer"),
);
const SprintPlanner = lazy(
  () => import("./components/pages/timeline/SprintPlanner"),
);
const TimelineEditor = lazy(
  () => import("./components/pages/timeline/TimelineEditor"),
);

// Help Pages
const FAQ = lazy(() => import("./components/pages/help/FAQ"));
const HelpCenter = lazy(() => import("./components/pages/help/HelpCenter"));
const KnowledgeBase = lazy(
  () => import("./components/pages/help/KnowledgeBase"),
);
const SupportTicket = lazy(
  () => import("./components/pages/help/SupportTicket"),
);
const Tutorials = lazy(() => import("./components/pages/help/Tutorials"));
const UserGuide = lazy(() => import("./components/pages/help/UserGuide"));

// Role-Based Access Control Constants
const ROLE_COMBINATIONS = Object.freeze({
  ALL: ["admin", "faculty", "student"],
  ADMIN_ONLY: ["admin"],
  FACULTY_ONLY: ["faculty"],
  STUDENT_ONLY: ["student"],
  ADMIN_FACULTY: ["admin", "faculty"],
  FACULTY_STUDENT: ["faculty", "student"],
});

const SPLASH_SCREEN_DELAY = 1200; // ms

/**
 * ProtectedRoute - Route wrapper requiring authentication & role-based access
 * @param {React.ReactNode} children - Route content to render
 * @param {Array<string>} allowedRoles - User roles permitted to access this route
 * @returns {React.ReactNode} Protected route or redirect
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

/**
 * PublicRoute - Blocks auth pages when already authenticated
 * @param {React.ReactNode} children - Route content to render
 * @returns {React.ReactNode} Public route or redirect
 */
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

/**
 * SplashScreen - Animated loading screen shown during app initialization
 * Features smooth animations, glassmorphism, and progress indicator
 * @returns {React.ReactNode} Splash screen UI
 */
const SplashScreen = () => (
  <div
    className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden relative"
    role="status"
    aria-label="Loading application"
  >
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />
    </div>

    {/* Main content */}
    <div className="text-center z-10 animate-[fadeIn_0.6s_ease-out]">
      {/* Logo container with glassmorphism */}
      <div className="relative mb-8">
        {/* Outer rotating ring */}
        <div
          className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-transparent border-t-blue-400 border-r-indigo-400 animate-spin"
          style={{ animationDuration: "3s" }}
        />

        {/* Inner rotating ring (opposite direction) */}
        <div
          className="absolute inset-2 w-28 h-28 mx-auto rounded-full border-2 border-transparent border-b-purple-400 border-l-pink-400 animate-spin"
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        />

        {/* Logo background with glass effect */}
        <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center relative">
          {/* Pulsing glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-50 animate-pulse blur-md" />

          {/* Icon container */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Title with gradient text */}
      <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
        Student Project System
      </h1>

      {/* Subtitle */}
      <p className="text-blue-200/80 text-sm md:text-base mb-8 font-medium tracking-wide">
        Empowering Academic Excellence
      </p>

      {/* Professional Loading Section */}
      <div className="w-80 mx-auto">
        {/* Loading spinner with orbiting dots */}
        <div className="flex justify-center mb-6">
          <div className="relative w-12 h-12">
            {/* Orbiting dots */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 60}deg) translateY(-20px)`,
                  animation: `orbitFade 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.3,
                }}
              />
            ))}
            {/* Center pulse */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white/80 animate-ping" />
              <div className="absolute w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Progress bar container */}
        <div className="relative mb-4">
          {/* Background track */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Animated progress fill */}
            <div
              className="h-full rounded-full animate-[loadingProgress_1.2s_ease-in-out_infinite]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #60a5fa, #818cf8, #a78bfa, transparent)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>

          {/* Glowing dot on progress */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-blue-500/50 animate-[progressDot_1.2s_ease-in-out_infinite]"
            style={{ left: "0%" }}
          />
        </div>

        {/* Loading status */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-[bounce_0.6s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-blue-200/70 text-sm font-medium animate-pulse">
            Loading Workspace
          </p>
        </div>

        {/* Loading steps indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {["Initialize", "Auth", "Data", "UI"].map((step, i) => (
            <div
              key={step}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium animate-[stepPulse_2s_ease-in-out_infinite]"
              style={{
                animationDelay: `${i * 0.5}s`,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-[dotGlow_2s_ease-in-out_infinite]"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  backgroundColor: "#60a5fa",
                }}
              />
              <span className="text-blue-200/60">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CSS for custom animations */}
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes orbitFade {
        0%, 100% { opacity: 0.3; transform: rotate(var(--rotation)) translateY(-20px) scale(0.8); }
        50% { opacity: 1; transform: rotate(var(--rotation)) translateY(-20px) scale(1.2); }
      }
      @keyframes loadingProgress {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @keyframes progressDot {
        0% { left: 0%; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { left: 100%; opacity: 0; }
      }
      @keyframes stepPulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        25% { opacity: 1; transform: scale(1.05); border-color: rgba(96, 165, 250, 0.5); }
        50% { opacity: 0.7; transform: scale(1); }
      }
      @keyframes dotGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0); }
        25% { box-shadow: 0 0 8px 2px rgba(96, 165, 250, 0.6); }
        50% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0); }
      }
    `}</style>
  </div>
);

/**
 * App - Main application router component
 * Initializes authentication provider and configures all app routes
 * @returns {React.ReactNode} Application component with routing
 */
function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, SPLASH_SCREEN_DELAY);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public/Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Protected Routes with MainLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Routes */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Management Routes */}
          <Route
            path="students"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <StudentsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="students/new"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <StudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="students/filters"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <StudentFilters />
              </ProtectedRoute>
            }
          />
          <Route
            path="staff"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
                <StaffManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="user-management"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="permissions"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
                <PermissionsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="system-settings"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
                <SystemSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="backup"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
                <BackupRestore />
              </ProtectedRoute>
            }
          />
          <Route
            path="audit-log"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
                <AuditLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="batch-operations"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
                <BatchOperations />
              </ProtectedRoute>
            }
          />

          {/* Project Routes */}
          <Route
            path="projects"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <ProjectList />
              </ProtectedRoute>
            }
          />
          {/* Route for "New Project" quick action - redirects to proposal */}
          <Route
            path="projects/new"
            element={<Navigate to="/project-proposal" replace />}
          />
          <Route
            path="projects/:id"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="project-proposal"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.FACULTY_STUDENT}>
                <ProjectProposal />
              </ProtectedRoute>
            }
          />
          <Route
            path="project-types"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <ProjectTypes />
              </ProtectedRoute>
            }
          />
          <Route
            path="project-groups"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <ProjectGroups />
              </ProtectedRoute>
            }
          />
          <Route
            path="guide-allocation"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <GuideAllocation />
              </ProtectedRoute>
            }
          />

          {/* Meeting Routes */}
          <Route
            path="meetings"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <MeetingCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="meetings/list"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <MeetingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="meetings/new"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <MeetingForm />
              </ProtectedRoute>
            }
          />

          {/* Course Routes */}
          <Route
            path="courses"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          {/* Route for "Create Course" quick action (admin) */}
          <Route
            path="courses/new"
            element={<Navigate to="/course-catalog" replace />}
          />
          <Route
            path="course-catalog"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <CourseCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="courses/:id"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="course-materials"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <CourseMaterials />
              </ProtectedRoute>
            }
          />
          <Route
            path="course-registration"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <CourseRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="course-schedule"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <CourseSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="syllabus/:id"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <SyllabusViewer />
              </ProtectedRoute>
            }
          />

          {/* Assignment Routes */}
          <Route
            path="assignments"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <AssignmentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="assignments/:id"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <AssignmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="assignments/submit/:id"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.STUDENT_ONLY}>
                <AssignmentSubmission />
              </ProtectedRoute>
            }
          />
          <Route
            path="assignments/upload"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <AssignmentUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="assignments/rubric/:id"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <GradingRubric />
              </ProtectedRoute>
            }
          />
          <Route
            path="assignments/peer-review"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.FACULTY_STUDENT}>
                <PeerReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="submission-history"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <SubmissionHistory />
              </ProtectedRoute>
            }
          />

          {/* Resource Routes */}
          <Route
            path="resources"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <ResourceBrowser />
              </ProtectedRoute>
            }
          />
          <Route
            path="documents"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <DocumentLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="resources/:id"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <ResourceDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="resource-upload"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <ResourceUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="templates"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <TemplateLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="resources/tutorials"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <TutorialVideos />
              </ProtectedRoute>
            }
          />

          {/* Portfolio Routes */}
          <Route
            path="portfolio"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <PortfolioView />
              </ProtectedRoute>
            }
          />
          <Route
            path="portfolio-builder"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.STUDENT_ONLY}>
                <PortfolioBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="achievements"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <AchievementBadges />
              </ProtectedRoute>
            }
          />
          <Route
            path="project-gallery"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <ProjectGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="skills"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <SkillMatrix />
              </ProtectedRoute>
            }
          />
          <Route
            path="transcript"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <TranscriptViewer />
              </ProtectedRoute>
            }
          />

          {/* Collaboration Routes */}
          <Route
            path="chat"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <TeamChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="chat/:id"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <ChatWindow />
              </ProtectedRoute>
            }
          />
          <Route
            path="discussions"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <DiscussionBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="discussions/:id"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <DiscussionThread />
              </ProtectedRoute>
            }
          />
          <Route
            path="file-sharing"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <FileSharing />
              </ProtectedRoute>
            }
          />
          <Route
            path="team-directory"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <TeamDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="workspace"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <Workspace />
              </ProtectedRoute>
            }
          />

          {/* Analytics Routes */}
          <Route
            path="analytics"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics/grades"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <GradeDistribution />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics/performance"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <PerformanceMetrics />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics/progress"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <ProgressAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics/usage"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <UsageStatistics />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics/visualizations"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <Visualizations />
              </ProtectedRoute>
            }
          />

          {/* Evaluation Routes */}
          <Route
            path="evaluation"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <EvaluationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="evaluation-criteria"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <EvaluationCriteria />
              </ProtectedRoute>
            }
          />
          <Route
            path="feedback"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <FeedbackDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="peer-evaluation"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <PeerEvaluation />
              </ProtectedRoute>
            }
          />
          <Route
            path="rubric-builder"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <RubricBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="self-evaluation"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.STUDENT_ONLY}>
                <SelfEvaluation />
              </ProtectedRoute>
            }
          />

          {/* Timeline Routes */}
          <Route
            path="timeline"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <ProjectTimeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="gantt"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <GanttChart />
              </ProtectedRoute>
            }
          />
          <Route
            path="milestones"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <MilestoneTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="roadmap"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <RoadmapViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="sprint-planner"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <SprintPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="timeline-editor"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <TimelineEditor />
              </ProtectedRoute>
            }
          />

          {/* Attendance Route */}
          <Route
            path="attendance"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <StudentAttendance />
              </ProtectedRoute>
            }
          />

          {/* Reports Routes */}
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <Reports />
              </ProtectedRoute>
            }
          />
          {/* Route for "Create Report" quick action */}
          <Route
            path="reports/new"
            element={<Navigate to="/reports" replace />}
          />
          <Route
            path="export"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
                <ExportOptions />
              </ProtectedRoute>
            }
          />

          {/* Settings Routes */}
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile-settings"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Help Routes */}
          <Route
            path="help"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <HelpCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="faq"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <FAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="knowledge-base"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <KnowledgeBase />
              </ProtectedRoute>
            }
          />
          <Route
            path="support"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <SupportTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="help/tutorials"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <Tutorials />
              </ProtectedRoute>
            }
          />
          <Route
            path="user-guide"
            element={
              <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
                <UserGuide />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all route - 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
