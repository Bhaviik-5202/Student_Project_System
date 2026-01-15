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

// Pages
import Login from "./components/pages/auth/Login";
import Dashboard from "./components/pages/dashboard/Dashboard";
import StudentsList from "./components/pages/students/StudentsList";
import ProjectProposal from "./components/pages/projects/ProjectProposal";
import MeetingCalendar from "./components/pages/meetings/MeetingCalendar";
import Reports from "./components/pages/reports/Reports";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Additional Pages
import StudentProjects from "./components/pages/projects/ProjectList";
import StaffManagement from "./components/pages/students/Staff";
import ProjectTypesList from "./components/pages/projects/ProjectTypes";
import ProjectGroupsList from "./components/pages/projects/ProjectGroups";
import GuideAllocationList from "./components/pages/projects/GuideAllocation";
import StudentAttendance from "./components/pages/students/Attendance";

// Settings
import Profile from "./components/pages/settings/Profile";
import Settings from "./components/pages/settings/Settings";

//  Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
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
          {/* Login */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />

          {/* Protected App */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Admin */}
            <Route
              path="students"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <StudentsList />
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
              path="project-types"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ProjectTypesList />
                </ProtectedRoute>
              }
            />

            {/* Faculty + Admin */}
            <Route path="project-groups" element={<ProjectGroupsList />} />
            <Route path="guide-allocation" element={<GuideAllocationList />} />

            {/* Student */}
            <Route path="my-projects" element={<StudentProjects />} />
            <Route path="proposal" element={<ProjectProposal />} />
            <Route path="attendance" element={<StudentAttendance />} />

            {/* Common */}
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="meetings" element={<MeetingCalendar />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
