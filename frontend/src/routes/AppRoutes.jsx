import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PublicRoute from '../components/common/PublicRoute';
import { ROLE_COMBINATIONS } from '../config/roles';

// Auth Pages
const Login = lazy(() => import('../components/pages/auth/Login'));
const Register = lazy(() => import('../components/pages/auth/Register'));
const ForgotPassword = lazy(
  () => import('../components/pages/auth/ForgotPassword')
);
const ResetPassword = lazy(
  () => import('../components/pages/auth/ResetPassword')
);
const Landing = lazy(() => import('../components/pages/public/Landing'));
const VerifyOTP = lazy(() => import('../components/pages/auth/VerifyOTP'));

// Dashboard Pages
const Dashboard = lazy(() => import('../components/pages/dashboard/Dashboard'));
const AdminDashboard = lazy(
  () => import('../components/pages/admin/AdminDashboard')
);

// Admin Pages
const StudentsList = lazy(
  () => import('../components/pages/students/StudentsList')
);
const StaffManagement = lazy(
  () => import('../components/pages/students/Staff')
);
const StaffForm = lazy(() => import('../components/pages/students/StaffForm'));
const UserManagement = lazy(
  () => import('../components/pages/admin/UserManagement')
);
const UserForm = lazy(() => import('../components/pages/admin/UserForm'));
const PermissionsManager = lazy(
  () => import('../components/pages/admin/PermissionsManager')
);
const SystemSettings = lazy(
  () => import('../components/pages/admin/SystemSettings')
);
const BackupRestore = lazy(
  () => import('../components/pages/admin/BackupRestore')
);
const AuditLog = lazy(() => import('../components/pages/admin/AuditLog'));
const BatchOperations = lazy(
  () => import('../components/pages/admin/BatchOperations')
);

// Student Pages
const StudentForm = lazy(
  () => import('../components/pages/students/StudentForm')
);

// Project Pages
const ProjectDashboard = lazy(
  () => import('../components/pages/projects/ProjectDashboard')
);
const ProjectList = lazy(
  () => import('../components/pages/projects/ProjectList')
);
const ProjectDetails = lazy(
  () => import('../components/pages/projects/ProjectDetails')
);
const ProjectProposal = lazy(
  () => import('../components/pages/projects/ProjectProposal')
);
const ProjectTypes = lazy(
  () => import('../components/pages/projects/ProjectTypes')
);
const ProjectArchitectureForm = lazy(
  () => import('../components/pages/projects/ProjectArchitectureForm')
);
const ProjectGroups = lazy(
  () => import('../components/pages/projects/ProjectGroups')
);
const GuideAllocation = lazy(
  () => import('../components/pages/projects/GuideAllocation')
);

// Meeting Pages
const MeetingCalendar = lazy(
  () => import('../components/pages/meetings/MeetingCalendar')
);
const MeetingList = lazy(
  () => import('../components/pages/meetings/MeetingList')
);
const MeetingForm = lazy(
  () => import('../components/pages/meetings/MeetingForm')
);
const MeetingDetails = lazy(
  () => import('../components/pages/meetings/MeetingDetails')
);

// Settings Pages
const Profile = lazy(() => import('../components/pages/settings/Profile'));
const ProfileSettings = lazy(
  () => import('../components/pages/settings/ProfileSettings')
);
const Settings = lazy(() => import('../components/pages/settings/Settings'));

// Reports Pages
const Reports = lazy(() => import('../components/pages/reports/Reports'));
const ExportOptions = lazy(
  () => import('../components/pages/reports/ExportOptions')
);

// Resource Pages
const DocumentLibrary = lazy(
  () => import('../components/pages/resources/DocumentLibrary')
);
const ResourceBrowser = lazy(
  () => import('../components/pages/resources/ResourceBrowser')
);
const ResourceDetails = lazy(
  () => import('../components/pages/resources/ResourceDetails')
);
const ResourceUpload = lazy(
  () => import('../components/pages/resources/ResourceUpload')
);
const TemplateLibrary = lazy(
  () => import('../components/pages/resources/TemplateLibrary')
);
const TutorialVideos = lazy(
  () => import('../components/pages/resources/TutorialVideos')
);

// Analytics Pages
const AnalyticsDashboard = lazy(
  () => import('../components/pages/analytics/AnalyticsDashboard')
);
const GradeDistribution = lazy(
  () => import('../components/pages/analytics/GradeDistribution')
);
const PerformanceMetrics = lazy(
  () => import('../components/pages/analytics/PerformanceMetrics')
);
const ProgressAnalytics = lazy(
  () => import('../components/pages/analytics/ProgressAnalytics')
);
const UsageStatistics = lazy(
  () => import('../components/pages/analytics/UsageStatistics')
);
const Visualizations = lazy(
  () => import('../components/pages/analytics/Visualizations')
);

// Timeline Pages
const GanttChart = lazy(
  () => import('../components/pages/timeline/GanttChart')
);
const MilestoneTracker = lazy(
  () => import('../components/pages/timeline/MilestoneTracker')
);
const ProjectTimeline = lazy(
  () => import('../components/pages/timeline/ProjectTimeline')
);
const RoadmapViewer = lazy(
  () => import('../components/pages/timeline/RoadmapViewer')
);
const SprintPlanner = lazy(
  () => import('../components/pages/timeline/SprintPlanner')
);
const TimelineEditor = lazy(
  () => import('../components/pages/timeline/TimelineEditor')
);

const FAQ = lazy(() => import('../components/pages/help/FAQ'));
const HelpCenter = lazy(() => import('../components/pages/help/HelpCenter'));
const KnowledgeBase = lazy(
  () => import('../components/pages/help/KnowledgeBase')
);
const UserGuide = lazy(() => import('../components/pages/help/UserGuide'));
const NotificationsPage = lazy(
  () => import('../components/pages/notifications/NotificationsPage')
);

// Public & Support Pages
const AboutUs = lazy(() => import('../components/pages/public/AboutUs'));
const ContactUs = lazy(() => import('../components/pages/public/ContactUs'));
const Documentation = lazy(
  () => import('../components/pages/public/Documentation')
);
const SystemStatus = lazy(
  () => import('../components/pages/public/SystemStatus')
);
const PrivacyPolicy = lazy(
  () => import('../components/pages/public/PrivacyPolicy')
);
const TermsAndConditions = lazy(
  () => import('../components/pages/public/TermsAndConditions')
);

const Feedback = lazy(() => import('../components/pages/public/Feedback'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route
        path='/login'
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path='/super-admin/login'
        element={
          <PublicRoute>
            <AuthLayout>
              <Login forceAdminMode={true} />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path='/admin/login'
        element={
          <PublicRoute>
            <AuthLayout>
              <Login forceAdminMode={true} />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path='/register'
        element={
          <PublicRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path='/verify-otp'
        element={
          <PublicRoute>
            <AuthLayout>
              <VerifyOTP />
            </AuthLayout>
          </PublicRoute>
        }
      />

      <Route
        path='/forgot-password'
        element={
          <PublicRoute>
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path='/reset-password/:token'
        element={
          <PublicRoute>
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Public Pages accessible without login requirement */}
      <Route path='/privacy' element={<PrivacyPolicy />} />
      <Route path='/terms' element={<TermsAndConditions />} />
      <Route path='/privacy-policy' element={<Navigate to='/privacy' replace />} />
      <Route path='/terms-and-conditions' element={<Navigate to='/terms' replace />} />
      <Route path='/about' element={<AboutUs />} />
      <Route path='/contact' element={<ContactUs />} />
      <Route path='/docs' element={<Documentation />} />
      <Route path='/status' element={<SystemStatus />} />
      <Route path='/feedback' element={<Feedback />} />

      {/* Protected Routes with MainLayout */}
      <Route
        element={
          <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path='dashboard' element={<Dashboard />} />
        <Route
          path='admin-dashboard'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin & Student Management Routes */}
        <Route
          path='students'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
              <StudentsList />
            </ProtectedRoute>
          }
        />
        <Route
          path='students/:id/edit'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <StudentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='staff'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <StaffManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path='staff/new'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <StaffForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='staff/:id/edit'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <StaffForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='user-management'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path='user-management/new'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='user-management/:id/edit'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='permissions'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <PermissionsManager />
            </ProtectedRoute>
          }
        />
        <Route
          path='system-settings'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <SystemSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path='backup'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <BackupRestore />
            </ProtectedRoute>
          }
        />
        <Route
          path='audit-log'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <AuditLog />
            </ProtectedRoute>
          }
        />
        <Route
          path='batch-operations'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <BatchOperations />
            </ProtectedRoute>
          }
        />

        {/* Project Routes */}
        <Route
          path='projects/dashboard'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <ProjectDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='projects'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <ProjectList />
            </ProtectedRoute>
          }
        />
        <Route
          path='projects/new'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <ProjectProposal />
            </ProtectedRoute>
          }
        />
        <Route
          path='project-proposal'
          element={<Navigate to='/projects/new' replace />}
        />
        <Route
          path='projects/:id'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path='projects/:id/edit'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <ProjectProposal />
            </ProtectedRoute>
          }
        />
        <Route
          path='project-types'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <ProjectTypes />
            </ProtectedRoute>
          }
        />
        <Route
          path='project-types/new'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <ProjectArchitectureForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='project-types/:id/edit'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <ProjectArchitectureForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='project-groups'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <ProjectGroups />
            </ProtectedRoute>
          }
        />
        <Route
          path='guide-allocation'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <GuideAllocation />
            </ProtectedRoute>
          }
        />

        {/* Meeting Routes */}
        <Route
          path='meetings'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <MeetingList />
            </ProtectedRoute>
          }
        />
        <Route
          path='meetings/list'
          element={<Navigate to='/meetings' replace />}
        />
        <Route
          path='meetings/calendar'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <MeetingCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path='meetings/new'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <MeetingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='meetings/:id/edit'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <MeetingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path='meetings/:id'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <MeetingDetails />
            </ProtectedRoute>
          }
        />

        {/* Resource Routes */}
        <Route
          path='resources'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <ResourceBrowser />
            </ProtectedRoute>
          }
        />
        <Route
          path='documents'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <DocumentLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path='resources/:id'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <ResourceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path='resource-upload'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <ResourceUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path='templates'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <TemplateLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path='resources/tutorials'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <TutorialVideos />
            </ProtectedRoute>
          }
        />

        {/* Analytics Routes */}
        <Route
          path='analytics'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='analytics/performance'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <PerformanceMetrics />
            </ProtectedRoute>
          }
        />
        <Route
          path='analytics/progress'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <ProgressAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path='analytics/usage'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <UsageStatistics />
            </ProtectedRoute>
          }
        />
        <Route
          path='analytics/visualizations'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <Visualizations />
            </ProtectedRoute>
          }
        />
        <Route
          path='grade'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <GradeDistribution />
            </ProtectedRoute>
          }
        />
        <Route
          path='analytics/grades'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <GradeDistribution />
            </ProtectedRoute>
          }
        />

        {/* Timeline Routes */}
        <Route
          path='timeline'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <ProjectTimeline />
            </ProtectedRoute>
          }
        />
        <Route
          path='project-timeline'
          element={<Navigate to='/timeline' replace />}
        />
        <Route
          path='project-timelines'
          element={<Navigate to='/timeline' replace />}
        />

        {/* Notifications Route */}
        <Route
          path='notifications'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='gantt'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <GanttChart />
            </ProtectedRoute>
          }
        />
        <Route
          path='milestones/:id?'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <MilestoneTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path='roadmap'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <RoadmapViewer />
            </ProtectedRoute>
          }
        />
        <Route
          path='sprint-planner'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <SprintPlanner />
            </ProtectedRoute>
          }
        />
        <Route
          path='timeline-editor/:id?'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <TimelineEditor />
            </ProtectedRoute>
          }
        />

        {/* Reports Routes */}
        <Route
          path='reports'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path='reports/new'
          element={<Navigate to='/reports' replace />}
        />
        <Route
          path='export'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}>
              <ExportOptions />
            </ProtectedRoute>
          }
        />

        {/* Settings Routes */}
        <Route
          path='profile'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='profile-settings'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path='settings'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Teams & Support Routes */}
        <Route
          path='teams'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <ProjectGroups />
            </ProtectedRoute>
          }
        />

        {/* Help & Support Routes */}
        <Route
          path='help'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <HelpCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path='faq'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <FAQ />
            </ProtectedRoute>
          }
        />
        <Route
          path='knowledge-base'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <KnowledgeBase />
            </ProtectedRoute>
          }
        />
        <Route
          path='user-guide'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <UserGuide />
            </ProtectedRoute>
          }
        />

        {/* Public & Footer Pages */}
        <Route
          path='about'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <AboutUs />
            </ProtectedRoute>
          }
        />
        <Route
          path='contact'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <ContactUs />
            </ProtectedRoute>
          }
        />
        <Route
          path='docs'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <Documentation />
            </ProtectedRoute>
          }
        />
        <Route
          path='status'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <SystemStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path='privacy'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <PrivacyPolicy />
            </ProtectedRoute>
          }
        />
        <Route
          path='terms'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <TermsAndConditions />
            </ProtectedRoute>
          }
        />
        <Route
          path='terms-and-conditions'
          element={<Navigate to='/terms' replace />}
        />

        <Route
          path='feedback'
          element={
            <ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}>
              <Feedback />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all route - 404 */}
      <Route path='*' element={<Navigate to='/dashboard' replace />} />
    </Routes>
  );
};

export default AppRoutes;
