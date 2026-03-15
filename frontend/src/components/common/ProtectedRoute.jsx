import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * ProtectedRoute Component
 * 
 * A route guard wrapper that enforces authentication and role-based 
 * access control (RBAC). Redirects unauthenticated users to login 
 * and unauthorized users to their respective dashboards.
 * 
 * @param {React.ReactNode} children - Route content to render
 * @param {Array<string>} allowedRoles - User roles permitted to access this route
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

export default ProtectedRoute;
