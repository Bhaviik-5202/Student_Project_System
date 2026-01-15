import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ROUTES } from "./constants";
import authService from "./services/authService";

// Layout Components
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Auth Pages
import Login from "../pages/auth/Login";

// Main Pages
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import ProjectDetails from "../pages/ProjectDetails";
import Students from "../pages/Students";
import StudentProfile from "../pages/StudentProfile";
import Meetings from "../pages/Meetings";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

// Error Pages
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = localStorage.getItem("role");
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
        </Route>

        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.PROJECTS}
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${ROUTES.PROJECTS}/:id`}
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.STUDENTS}
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                <Students />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${ROUTES.STUDENTS}/:id`}
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.MEETINGS}
            element={
              <ProtectedRoute>
                <Meetings />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Error routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
