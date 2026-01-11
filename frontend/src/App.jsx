import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
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

/* ================================
   Protected Route Component
================================ */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/* ================================
   App Component
================================ */
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
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <i className="fas fa-graduation-cap text-white text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Project Management System
          </h2>
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />

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
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

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
            <Route
              path="project-groups"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <ProjectGroupsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="guide-allocation"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <GuideAllocationList />
                </ProtectedRoute>
              }
            />

            {/* Student */}
            <Route
              path="my-projects"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="proposal"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ProjectProposal />
                </ProtectedRoute>
              }
            />
            <Route
              path="attendance"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentAttendance />
                </ProtectedRoute>
              }
            />

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
