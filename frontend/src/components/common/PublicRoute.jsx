import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

/**
 * PublicRoute Component
 *
 * A complementary route wrapper for authentication pages (Login, Recovery).
 * Automatically redirects authenticated users to the dashboard to
 * ensure a seamless post-login experience.
 *
 * @param {React.ReactNode} children - Route content to render
 */
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return <Navigate to='/dashboard' replace />;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

export default PublicRoute;
