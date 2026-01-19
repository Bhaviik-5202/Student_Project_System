import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Auth Pages
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import ForgotPassword from "./components/pages/auth/ForgotPassword";

// Dashboard Pages
import Dashboard from "./components/pages/dashboard/Dashboard";
import AdminDashboard from "./components/pages/admin/AdminDashboard";

// Admin Pages
import StudentsList from "./components/pages/students/StudentsList";
import StaffManagement from "./components/pages/students/Staff";
import UserManagement from "./components/pages/admin/UserManagement";
import PermissionsManager from "./components/pages/admin/PermissionsManager";
import SystemSettings from "./components/pages/admin/SystemSettings";
import BackupRestore from "./components/pages/admin/BackupRestore";
import AuditLog from "./components/pages/admin/AuditLog";
import BatchOperations from "./components/pages/admin/BatchOperations";

// Student Pages
import StudentAttendance from "./components/pages/students/Attendance";
import StudentForm from "./components/pages/students/StudentForm";
import StudentFilters from "./components/pages/students/StudentFilters";

// Project Pages
import ProjectList from "./components/pages/projects/ProjectList";
import ProjectDetails from "./components/pages/projects/ProjectDetails";
import ProjectProposal from "./components/pages/projects/ProjectProposal";
import ProjectTypes from "./components/pages/projects/ProjectTypes";
import ProjectGroups from "./components/pages/projects/ProjectGroups";
import GuideAllocation from "./components/pages/projects/GuideAllocation";

// Meeting Pages
import MeetingCalendar from "./components/pages/meetings/MeetingCalendar";
import MeetingList from "./components/pages/meetings/MeetingList";
import MeetingForm from "./components/pages/meetings/MeetingForm";

// Settings Pages
import Profile from "./components/pages/settings/Profile";
import ProfileSettings from "./components/pages/settings/ProfileSettings";
import Settings from "./components/pages/settings/Settings";

// Reports Pages
import Reports from "./components/pages/reports/Reports";
import ExportOptions from "./components/pages/reports/ExportOptions";

// Resource Pages
import DocumentLibrary from "./components/pages/resources/DocumentLibrary";
import ResourceBrowser from "./components/pages/resources/ResourceBrowser";
import ResourceDetails from "./components/pages/resources/ResourceDetails";
import ResourceUpload from "./components/pages/resources/ResourceUpload";
import TemplateLibrary from "./components/pages/resources/TemplateLibrary";
import TutorialVideos from "./components/pages/resources/TutorialVideos";

// Portfolio Pages
import AchievementBadges from "./components/pages/portfolio/AchievementBadges";
import PortfolioBuilder from "./components/pages/portfolio/PortfolioBuilder";
import PortfolioView from "./components/pages/portfolio/PortfolioView";
import ProjectGallery from "./components/pages/portfolio/ProjectGallery";
import SkillMatrix from "./components/pages/portfolio/SkillMatrix";
import TranscriptViewer from "./components/pages/portfolio/TranscriptViewer";

// Course Pages
import CourseCatalog from "./components/pages/courses/CourseCatalog";
import CourseDetails from "./components/pages/courses/CourseDetails";
import CourseMaterials from "./components/pages/courses/CourseMaterials";
import CourseRegistration from "./components/pages/courses/CourseRegistration";
import CourseSchedule from "./components/pages/courses/CourseSchedule";
import MyCourses from "./components/pages/courses/MyCourses";
import SyllabusViewer from "./components/pages/courses/SyllabusViewer";

// Assignment Pages
import AssignmentList from "./components/pages/assignments/AssignmentList";
import AssignmentDetails from "./components/pages/assignments/AssignmentDetails";
import AssignmentSubmission from "./components/pages/assignments/AssignmentSubmission";
import AssignmentUpload from "./components/pages/assignments/AssignmentUpload";
import GradingRubric from "./components/pages/assignments/GradingRubric";
import PeerReview from "./components/pages/assignments/PeerReview";
import SubmissionHistory from "./components/pages/assignments/SubmissionHistory";

// Collaboration Pages
import ChatWindow from "./components/pages/collaboration/ChatWindow";
import DiscussionBoard from "./components/pages/collaboration/DiscussionBoard";
import DiscussionThread from "./components/pages/collaboration/DiscussionThread";
import FileSharing from "./components/pages/collaboration/FileSharing";
import TeamChat from "./components/pages/collaboration/TeamChat";
import TeamDirectory from "./components/pages/collaboration/TeamDirectory";
import Workspace from "./components/pages/collaboration/Workspace";

// Analytics Pages
import AnalyticsDashboard from "./components/pages/analytics/AnalyticsDashboard";
import GradeDistribution from "./components/pages/analytics/GradeDistribution";
import PerformanceMetrics from "./components/pages/analytics/PerformanceMetrics";
import ProgressAnalytics from "./components/pages/analytics/ProgressAnalytics";
import UsageStatistics from "./components/pages/analytics/UsageStatistics";
import Visualizations from "./components/pages/analytics/Visualizations";

// Evaluation Pages
import EvaluationCriteria from "./components/pages/evaluation/EvaluationCriteria";
import EvaluationForm from "./components/pages/evaluation/EvaluationForm";
import FeedbackDashboard from "./components/pages/evaluation/FeedbackDashboard";
import PeerEvaluation from "./components/pages/evaluation/PeerEvaluation";
import RubricBuilder from "./components/pages/evaluation/RubricBuilder";
import SelfEvaluation from "./components/pages/evaluation/SelfEvaluation";

// Timeline Pages
import GanttChart from "./components/pages/timeline/GanttChart";
import MilestoneTracker from "./components/pages/timeline/MilestoneTracker";
import ProjectTimeline from "./components/pages/timeline/ProjectTimeline";
import RoadmapViewer from "./components/pages/timeline/RoadmapViewer";
import SprintPlanner from "./components/pages/timeline/SprintPlanner";
import TimelineEditor from "./components/pages/timeline/TimelineEditor";

// Help Pages
import FAQ from "./components/pages/help/FAQ";
import HelpCenter from "./components/pages/help/HelpCenter";
import KnowledgeBase from "./components/pages/help/KnowledgeBase";
import SupportTicket from "./components/pages/help/SupportTicket";
import Tutorials from "./components/pages/help/Tutorials";
import UserGuide from "./components/pages/help/UserGuide";

// Common Components
import LoadingSpinner from "./components/common/LoadingSpinner";

//  Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

//  App Component
function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  /* Startup Animation */
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-full border-4 border-primary-300 animate-ping opacity-75"></div>
            {/* Shrinking ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary-200 animate-pulse"></div>

            <i className="fas fa-graduation-cap text-white text-4xl relative z-10"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
            Project Management System
          </h2>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <span className="inline-block">Loading Workspace</span>
            <span className="flex gap-1">
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            }
          />

          {/* Protected Routes with MainLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Routes */}
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Management Routes */}
            <Route
              path="students"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <StudentsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="students/new"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <StudentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="students/filters"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <StudentFilters />
                </ProtectedRoute>
              }
            />
            <Route
              path="staff"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <StaffManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="user-management"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="permissions"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <PermissionsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="system-settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SystemSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="backup"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <BackupRestore />
                </ProtectedRoute>
              }
            />
            <Route
              path="audit-log"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AuditLog />
                </ProtectedRoute>
              }
            />
            <Route
              path="batch-operations"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <BatchOperations />
                </ProtectedRoute>
              }
            />

            {/* Project Routes */}
            <Route
              path="projects"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <ProjectList />
                </ProtectedRoute>
              }
            />
            <Route
              path="projects/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="project-proposal"
              element={
                <ProtectedRoute allowedRoles={["student", "faculty"]}>
                  <ProjectProposal />
                </ProtectedRoute>
              }
            />
            <Route
              path="project-types"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <ProjectTypes />
                </ProtectedRoute>
              }
            />
            <Route
              path="project-groups"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <ProjectGroups />
                </ProtectedRoute>
              }
            />
            <Route
              path="guide-allocation"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <GuideAllocation />
                </ProtectedRoute>
              }
            />

            {/* Meeting Routes */}
            <Route
              path="meetings"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <MeetingCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="meetings/list"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <MeetingList />
                </ProtectedRoute>
              }
            />
            <Route
              path="meetings/new"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <MeetingForm />
                </ProtectedRoute>
              }
            />

            {/* Course Routes */}
            <Route
              path="courses"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="course-catalog"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <CourseCatalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="course-materials"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <CourseMaterials />
                </ProtectedRoute>
              }
            />
            <Route
              path="course-registration"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <CourseRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="course-schedule"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <CourseSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="syllabus/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <SyllabusViewer />
                </ProtectedRoute>
              }
            />

            {/* Assignment Routes */}
            <Route
              path="assignments"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <AssignmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="assignments/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <AssignmentDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="assignments/submit/:id"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <AssignmentSubmission />
                </ProtectedRoute>
              }
            />
            <Route
              path="assignments/upload"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <AssignmentUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="assignments/rubric/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <GradingRubric />
                </ProtectedRoute>
              }
            />
            <Route
              path="assignments/peer-review"
              element={
                <ProtectedRoute allowedRoles={["student", "faculty"]}>
                  <PeerReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="submission-history"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <SubmissionHistory />
                </ProtectedRoute>
              }
            />

            {/* Resource Routes */}
            <Route
              path="resources"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <ResourceBrowser />
                </ProtectedRoute>
              }
            />
            <Route
              path="documents"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <DocumentLibrary />
                </ProtectedRoute>
              }
            />
            <Route
              path="resources/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <ResourceDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="resource-upload"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <ResourceUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="templates"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <TemplateLibrary />
                </ProtectedRoute>
              }
            />
            <Route
              path="tutorials"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <TutorialVideos />
                </ProtectedRoute>
              }
            />

            {/* Portfolio Routes */}
            <Route
              path="portfolio"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <PortfolioView />
                </ProtectedRoute>
              }
            />
            <Route
              path="portfolio-builder"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <PortfolioBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="achievements"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <AchievementBadges />
                </ProtectedRoute>
              }
            />
            <Route
              path="project-gallery"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <ProjectGallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="skills"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <SkillMatrix />
                </ProtectedRoute>
              }
            />
            <Route
              path="transcript"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <TranscriptViewer />
                </ProtectedRoute>
              }
            />

            {/* Collaboration Routes */}
            <Route
              path="chat"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <TeamChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="chat/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <ChatWindow />
                </ProtectedRoute>
              }
            />
            <Route
              path="discussions"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <DiscussionBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="discussions/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <DiscussionThread />
                </ProtectedRoute>
              }
            />
            <Route
              path="file-sharing"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <FileSharing />
                </ProtectedRoute>
              }
            />
            <Route
              path="team-directory"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <TeamDirectory />
                </ProtectedRoute>
              }
            />
            <Route
              path="workspace"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <Workspace />
                </ProtectedRoute>
              }
            />

            {/* Analytics Routes */}
            <Route
              path="analytics"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics/grades"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <GradeDistribution />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics/performance"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <PerformanceMetrics />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics/progress"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <ProgressAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics/usage"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <UsageStatistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="analytics/visualizations"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <Visualizations />
                </ProtectedRoute>
              }
            />

            {/* Evaluation Routes */}
            <Route
              path="evaluation"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <EvaluationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="evaluation-criteria"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <EvaluationCriteria />
                </ProtectedRoute>
              }
            />
            <Route
              path="feedback"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <FeedbackDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="peer-evaluation"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <PeerEvaluation />
                </ProtectedRoute>
              }
            />
            <Route
              path="rubric-builder"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <RubricBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="self-evaluation"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <SelfEvaluation />
                </ProtectedRoute>
              }
            />

            {/* Timeline Routes */}
            <Route
              path="timeline"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <ProjectTimeline />
                </ProtectedRoute>
              }
            />
            <Route
              path="gantt"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <GanttChart />
                </ProtectedRoute>
              }
            />
            <Route
              path="milestones"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <MilestoneTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="roadmap"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <RoadmapViewer />
                </ProtectedRoute>
              }
            />
            <Route
              path="sprint-planner"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <SprintPlanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="timeline-editor"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <TimelineEditor />
                </ProtectedRoute>
              }
            />

            {/* Attendance Route */}
            <Route
              path="attendance"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <StudentAttendance />
                </ProtectedRoute>
              }
            />

            {/* Reports Routes */}
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="export"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <ExportOptions />
                </ProtectedRoute>
              }
            />

            {/* Settings Routes */}
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile-settings"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Help Routes */}
            <Route
              path="help"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <HelpCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="faq"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <FAQ />
                </ProtectedRoute>
              }
            />
            <Route
              path="knowledge-base"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <KnowledgeBase />
                </ProtectedRoute>
              }
            />
            <Route
              path="support"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <SupportTicket />
                </ProtectedRoute>
              }
            />
            <Route
              path="tutorials"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <Tutorials />
                </ProtectedRoute>
              }
            />
            <Route
              path="user-guide"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <UserGuide />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
