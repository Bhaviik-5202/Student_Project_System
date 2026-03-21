import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
// import LoadingSpinner from "../components/common/LoadingSpinner";
import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";
import { ROLE_COMBINATIONS } from "../config/roles";

// Auth Pages
const Login = lazy(() => import("../components/pages/auth/Login"));
const Register = lazy(() => import("../components/pages/auth/Register"));
const ForgotPassword = lazy(() => import("../components/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/pages/auth/ResetPassword"));

// Dashboard Pages
const Dashboard = lazy(() => import("../components/pages/dashboard/Dashboard"));
const AdminDashboard = lazy(() => import("../components/pages/admin/AdminDashboard"));

// Admin Pages
const StudentsList = lazy(() => import("../components/pages/students/StudentsList"));
const StaffManagement = lazy(() => import("../components/pages/students/Staff"));
const UserManagement = lazy(() => import("../components/pages/admin/UserManagement"));
const PermissionsManager = lazy(() => import("../components/pages/admin/PermissionsManager"));
const SystemSettings = lazy(() => import("../components/pages/admin/SystemSettings"));
const BackupRestore = lazy(() => import("../components/pages/admin/BackupRestore"));
const AuditLog = lazy(() => import("../components/pages/admin/AuditLog"));
const BatchOperations = lazy(() => import("../components/pages/admin/BatchOperations"));

// Student Pages
const StudentAttendance = lazy(() => import("../components/pages/students/Attendance"));
const StudentForm = lazy(() => import("../components/pages/students/StudentForm"));
const StudentFilters = lazy(() => import("../components/pages/students/StudentFilters"));

// Project Pages
const ProjectList = lazy(() => import("../components/pages/projects/ProjectList"));
const ProjectDetails = lazy(() => import("../components/pages/projects/ProjectDetails"));
const ProjectProposal = lazy(() => import("../components/pages/projects/ProjectProposal"));
const ProjectTypes = lazy(() => import("../components/pages/projects/ProjectTypes"));
const ProjectGroups = lazy(() => import("../components/pages/projects/ProjectGroups"));
const GuideAllocation = lazy(() => import("../components/pages/projects/GuideAllocation"));

// Meeting Pages
const MeetingCalendar = lazy(() => import("../components/pages/meetings/MeetingCalendar"));
const MeetingList = lazy(() => import("../components/pages/meetings/MeetingList"));
const MeetingForm = lazy(() => import("../components/pages/meetings/MeetingForm"));

// Settings Pages
const Profile = lazy(() => import("../components/pages/settings/Profile"));
const ProfileSettings = lazy(() => import("../components/pages/settings/ProfileSettings"));
const Settings = lazy(() => import("../components/pages/settings/Settings"));

// Reports Pages
const Reports = lazy(() => import("../components/pages/reports/Reports"));
const ExportOptions = lazy(() => import("../components/pages/reports/ExportOptions"));

// Resource Pages
const DocumentLibrary = lazy(() => import("../components/pages/resources/DocumentLibrary"));
const ResourceBrowser = lazy(() => import("../components/pages/resources/ResourceBrowser"));
const ResourceDetails = lazy(() => import("../components/pages/resources/ResourceDetails"));
const ResourceUpload = lazy(() => import("../components/pages/resources/ResourceUpload"));
const TemplateLibrary = lazy(() => import("../components/pages/resources/TemplateLibrary"));
const TutorialVideos = lazy(() => import("../components/pages/resources/TutorialVideos"));

// Portfolio Pages
const AchievementBadges = lazy(() => import("../components/pages/portfolio/AchievementBadges"));
const PortfolioBuilder = lazy(() => import("../components/pages/portfolio/PortfolioBuilder"));
const PortfolioView = lazy(() => import("../components/pages/portfolio/PortfolioView"));
const ProjectGallery = lazy(() => import("../components/pages/portfolio/ProjectGallery"));
const SkillMatrix = lazy(() => import("../components/pages/portfolio/SkillMatrix"));
const TranscriptViewer = lazy(() => import("../components/pages/portfolio/TranscriptViewer"));

// Course Pages
const CourseCatalog = lazy(() => import("../components/pages/courses/CourseCatalog"));
const CourseDetails = lazy(() => import("../components/pages/courses/CourseDetails"));
const CourseMaterials = lazy(() => import("../components/pages/courses/CourseMaterials"));
const CourseRegistration = lazy(() => import("../components/pages/courses/CourseRegistration"));
const CourseSchedule = lazy(() => import("../components/pages/courses/CourseSchedule"));
const MyCourses = lazy(() => import("../components/pages/courses/MyCourses"));
const SyllabusViewer = lazy(() => import("../components/pages/courses/SyllabusViewer"));

// Assignment Pages
const AssignmentList = lazy(() => import("../components/pages/assignments/AssignmentList"));
const AssignmentDetails = lazy(() => import("../components/pages/assignments/AssignmentDetails"));
const AssignmentSubmission = lazy(() => import("../components/pages/assignments/AssignmentSubmission"));
const AssignmentUpload = lazy(() => import("../components/pages/assignments/AssignmentUpload"));
const GradingRubric = lazy(() => import("../components/pages/assignments/GradingRubric"));
const PeerReview = lazy(() => import("../components/pages/assignments/PeerReview"));
const SubmissionHistory = lazy(() => import("../components/pages/assignments/SubmissionHistory"));

// Collaboration Pages
const ChatWindow = lazy(() => import("../components/pages/collaboration/ChatWindow"));
const DiscussionBoard = lazy(() => import("../components/pages/collaboration/DiscussionBoard"));
const DiscussionThread = lazy(() => import("../components/pages/collaboration/DiscussionThread"));
const FileSharing = lazy(() => import("../components/pages/collaboration/FileSharing"));
const TeamChat = lazy(() => import("../components/pages/collaboration/TeamChat"));
const TeamDirectory = lazy(() => import("../components/pages/collaboration/TeamDirectory"));
const Workspace = lazy(() => import("../components/pages/collaboration/Workspace"));

// Analytics Pages
const AnalyticsDashboard = lazy(() => import("../components/pages/analytics/AnalyticsDashboard"));
const GradeDistribution = lazy(() => import("../components/pages/analytics/GradeDistribution"));
const PerformanceMetrics = lazy(() => import("../components/pages/analytics/PerformanceMetrics"));
const ProgressAnalytics = lazy(() => import("../components/pages/analytics/ProgressAnalytics"));
const UsageStatistics = lazy(() => import("../components/pages/analytics/UsageStatistics"));
const Visualizations = lazy(() => import("../components/pages/analytics/Visualizations"));

// Evaluation Pages
const EvaluationCriteria = lazy(() => import("../components/pages/evaluation/EvaluationCriteria"));
const EvaluationForm = lazy(() => import("../components/pages/evaluation/EvaluationForm"));
const FeedbackDashboard = lazy(() => import("../components/pages/evaluation/FeedbackDashboard"));
const PeerEvaluation = lazy(() => import("../components/pages/evaluation/PeerEvaluation"));
const RubricBuilder = lazy(() => import("../components/pages/evaluation/RubricBuilder"));
const SelfEvaluation = lazy(() => import("../components/pages/evaluation/SelfEvaluation"));

// Timeline Pages
const GanttChart = lazy(() => import("../components/pages/timeline/GanttChart"));
const MilestoneTracker = lazy(() => import("../components/pages/timeline/MilestoneTracker"));
const ProjectTimeline = lazy(() => import("../components/pages/timeline/ProjectTimeline"));
const RoadmapViewer = lazy(() => import("../components/pages/timeline/RoadmapViewer"));
const SprintPlanner = lazy(() => import("../components/pages/timeline/SprintPlanner"));
const TimelineEditor = lazy(() => import("../components/pages/timeline/TimelineEditor"));

// Help Pages
const FAQ = lazy(() => import("../components/pages/help/FAQ"));
const HelpCenter = lazy(() => import("../components/pages/help/HelpCenter"));
const KnowledgeBase = lazy(() => import("../components/pages/help/KnowledgeBase"));
const SupportTicket = lazy(() => import("../components/pages/help/SupportTicket"));
const Tutorials = lazy(() => import("../components/pages/help/Tutorials"));
const UserGuide = lazy(() => import("../components/pages/help/UserGuide"));

const AddCourse = lazy(() => import("../components/pages/courses/AddCourse"));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public/Auth Routes */}
      <Route path="/login" element={<PublicRoute><AuthLayout><Login /></AuthLayout></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><AuthLayout><Register /></AuthLayout></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><AuthLayout><ForgotPassword /></AuthLayout></PublicRoute>} />
      <Route path="/reset-password/:token" element={<PublicRoute><AuthLayout><ResetPassword /></AuthLayout></PublicRoute>} />

      {/* Protected Routes with MainLayout */}
      <Route path="/" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="admin-dashboard" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}><AdminDashboard /></ProtectedRoute>} />

        {/* Admin Management Routes */}
        <Route path="students" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><StudentsList /></ProtectedRoute>} />
        <Route path="students/new" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><StudentForm /></ProtectedRoute>} />
        <Route path="students/:id/edit" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><StudentForm /></ProtectedRoute>} />
        <Route path="students/filters" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><StudentFilters /></ProtectedRoute>} />
        <Route path="staff" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}><StaffManagement /></ProtectedRoute>} />
        <Route path="user-management" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}><UserManagement /></ProtectedRoute>} />
        <Route path="permissions" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}><PermissionsManager /></ProtectedRoute>} />
        <Route path="system-settings" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}><SystemSettings /></ProtectedRoute>} />
        <Route path="backup" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}><BackupRestore /></ProtectedRoute>} />
        <Route path="audit-log" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}><AuditLog /></ProtectedRoute>} />
        <Route path="batch-operations" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_ONLY}><BatchOperations /></ProtectedRoute>} />

        {/* Project Routes */}
        <Route path="projects" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ProjectList /></ProtectedRoute>} />
        <Route path="projects/new" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ProjectProposal /></ProtectedRoute>} />
        <Route path="project-proposal" element={<Navigate to="/projects/new" replace />} />
        <Route path="projects/:id" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ProjectDetails /></ProtectedRoute>} />
        <Route path="projects/:id/edit" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ProjectProposal /></ProtectedRoute>} />
        <Route path="project-types" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><ProjectTypes /></ProtectedRoute>} />
        <Route path="project-groups" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><ProjectGroups /></ProtectedRoute>} />
        <Route path="guide-allocation" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><GuideAllocation /></ProtectedRoute>} />

        {/* Meeting Routes */}
        <Route path="meetings" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><MeetingCalendar /></ProtectedRoute>} />
        <Route path="meetings/list" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><MeetingList /></ProtectedRoute>} />
        <Route path="meetings/new" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><MeetingForm /></ProtectedRoute>} />

        {/* Course Routes */}
        <Route path="courses" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><MyCourses /></ProtectedRoute>} />
        <Route path="courses/new" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><AddCourse /></ProtectedRoute>} />
        <Route path="courses/catalog" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><CourseCatalog /></ProtectedRoute>} />
        <Route path="courses/register" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><CourseRegistration /></ProtectedRoute>} />
        <Route path="courses/schedule" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><CourseSchedule /></ProtectedRoute>} />
        <Route path="courses/:id" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><CourseDetails /></ProtectedRoute>} />
        <Route path="courses/:id/materials" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><CourseMaterials /></ProtectedRoute>} />
        <Route path="courses/:id/syllabus" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><SyllabusViewer /></ProtectedRoute>} />

        {/* Assignment Routes */}
        <Route path="assignments" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><AssignmentList /></ProtectedRoute>} />
        <Route path="assignments/:id" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><AssignmentDetails /></ProtectedRoute>} />
        <Route path="assignments/submit/:id" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.STUDENT_ONLY}><AssignmentSubmission /></ProtectedRoute>} />
        <Route path="assignments/upload" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><AssignmentUpload /></ProtectedRoute>} />
        <Route path="assignments/rubric/:id" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><GradingRubric /></ProtectedRoute>} />
        <Route path="assignments/peer-review" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.FACULTY_STUDENT}><PeerReview /></ProtectedRoute>} />
        <Route path="submission-history" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><SubmissionHistory /></ProtectedRoute>} />

        {/* Resource Routes */}
        <Route path="resources" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ResourceBrowser /></ProtectedRoute>} />
        <Route path="documents" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><DocumentLibrary /></ProtectedRoute>} />
        <Route path="resources/:id" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ResourceDetails /></ProtectedRoute>} />
        <Route path="resource-upload" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><ResourceUpload /></ProtectedRoute>} />
        <Route path="templates" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><TemplateLibrary /></ProtectedRoute>} />
        <Route path="resources/tutorials" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><TutorialVideos /></ProtectedRoute>} />

        {/* Portfolio Routes */}
        <Route path="portfolio" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><PortfolioView /></ProtectedRoute>} />
        <Route path="portfolio-builder" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.STUDENT_ONLY}><PortfolioBuilder /></ProtectedRoute>} />
        <Route path="achievements" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><AchievementBadges /></ProtectedRoute>} />
        <Route path="project-gallery" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ProjectGallery /></ProtectedRoute>} />
        <Route path="skills" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><SkillMatrix /></ProtectedRoute>} />
        <Route path="transcript" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><TranscriptViewer /></ProtectedRoute>} />

        {/* Collaboration Routes */}
        <Route path="chat" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><TeamChat /></ProtectedRoute>} />
        <Route path="chat/:id" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ChatWindow /></ProtectedRoute>} />
        <Route path="discussions" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><DiscussionBoard /></ProtectedRoute>} />
        <Route path="discussions/:id" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><DiscussionThread /></ProtectedRoute>} />
        <Route path="file-sharing" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><FileSharing /></ProtectedRoute>} />
        <Route path="team-directory" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><TeamDirectory /></ProtectedRoute>} />
        <Route path="workspace" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><Workspace /></ProtectedRoute>} />

        {/* Analytics Routes */}
        <Route path="analytics" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><AnalyticsDashboard /></ProtectedRoute>} />
        <Route path="analytics/grades" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><GradeDistribution /></ProtectedRoute>} />
        <Route path="analytics/performance" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><PerformanceMetrics /></ProtectedRoute>} />
        <Route path="analytics/progress" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ProgressAnalytics /></ProtectedRoute>} />
        <Route path="analytics/usage" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><UsageStatistics /></ProtectedRoute>} />
        <Route path="analytics/visualizations" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><Visualizations /></ProtectedRoute>} />

        {/* Evaluation Routes */}
        <Route path="evaluation" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><EvaluationForm /></ProtectedRoute>} />
        <Route path="evaluation-criteria" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><EvaluationCriteria /></ProtectedRoute>} />
        <Route path="feedback" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><FeedbackDashboard /></ProtectedRoute>} />
        <Route path="peer-evaluation" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><PeerEvaluation /></ProtectedRoute>} />
        <Route path="rubric-builder" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><RubricBuilder /></ProtectedRoute>} />
        <Route path="self-evaluation" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.STUDENT_ONLY}><SelfEvaluation /></ProtectedRoute>} />

        {/* Timeline Routes */}
        <Route path="timeline" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ProjectTimeline /></ProtectedRoute>} />
        <Route path="gantt" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><GanttChart /></ProtectedRoute>} />
        <Route path="milestones" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><MilestoneTracker /></ProtectedRoute>} />
        <Route path="roadmap" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><RoadmapViewer /></ProtectedRoute>} />
        <Route path="sprint-planner" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><SprintPlanner /></ProtectedRoute>} />
        <Route path="timeline-editor" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><TimelineEditor /></ProtectedRoute>} />

        {/* Attendance Route */}
        <Route path="attendance" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><StudentAttendance /></ProtectedRoute>} />

        {/* Reports Routes */}
        <Route path="reports" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><Reports /></ProtectedRoute>} />
        <Route path="reports/new" element={<Navigate to="/reports" replace />} />
        <Route path="export" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ADMIN_FACULTY}><ExportOptions /></ProtectedRoute>} />

        {/* Settings Routes */}
        <Route path="profile" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><Profile /></ProtectedRoute>} />
        <Route path="profile-settings" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><ProfileSettings /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><Settings /></ProtectedRoute>} />

        {/* Help Routes */}
        <Route path="help" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><HelpCenter /></ProtectedRoute>} />
        <Route path="faq" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><FAQ /></ProtectedRoute>} />
        <Route path="knowledge-base" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><KnowledgeBase /></ProtectedRoute>} />
        <Route path="support" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><SupportTicket /></ProtectedRoute>} />
        <Route path="help/tutorials" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><Tutorials /></ProtectedRoute>} />
        <Route path="user-guide" element={<ProtectedRoute allowedRoles={ROLE_COMBINATIONS.ALL}><UserGuide /></ProtectedRoute>} />
      </Route>

      {/* Catch-all route - 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
