import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
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

// Profile and Settings Pages (ADD THESE IMPORTS)
import Profile from "./components/pages/settings/Profile";
import Settings from "./components/pages/settings/Settings";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />

        <Routes>
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />

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

            {/* Admin Routes */}
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

            {/* Faculty & Admin Routes */}
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

            {/* Student Routes */}
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

            {/* Profile & Settings Routes for ALL roles (ADD THESE) */}
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <Profile />
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

            {/* Common Routes */}
            <Route
              path="meetings"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <MeetingCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
