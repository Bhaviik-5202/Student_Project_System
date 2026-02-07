import React, { useState, useEffect, Suspense, useCallback, memo, Component } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../common/Header";
import TopNav from "../common/TopNav";
import Footer from "../common/Footer";
import Breadcrumb from "../common/Breadcrumb";
import LoadingSpinner from "../common/LoadingSpinner";
import BackToTop from "../common/BackToTop.jsx";
import useScreenSize from "../../hooks/useScreenSize";
import { useAuth } from "../../context/AuthContext";  

// Memoized components for better performance
const MemoizedTopNav = memo(TopNav);
const MemoizedHeader = memo(Header);
const MemoizedBreadcrumb = memo(Breadcrumb);
const MemoizedFooter = memo(Footer);

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const location = useLocation();
  const { isMobile } = useScreenSize();
  const { user } = useAuth();

  // Throttled scroll handler for better performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clear notifications callback
  const handleClearNotifications = useCallback(() => {
    setNotificationCount(0);
  }, []);

  // Skip animation for certain routes
  const shouldAnimate = !location.pathname.includes("/chat");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans flex flex-col transition-colors duration-200">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Header */}
      <MemoizedHeader
        isScrolled={isScrolled}
        notificationCount={notificationCount}
        clearNotifications={handleClearNotifications}
      />

      {/* Top Navigation Bar */}
      <MemoizedTopNav isScrolled={isScrolled} />

      {/* Main Content Area - adjusted for header (64px) + top nav (56px) = 120px */}
      <div className="flex flex-1 pt-[120px]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Breadcrumb Navigation */}
          {!isMobile && (
            <nav className="px-4 md:px-6 pt-4" aria-label="Breadcrumb">
              <MemoizedBreadcrumb />
            </nav>
          )}

          {/* Main Content */}
          <main
            id="main-content"
            className="flex-1 overflow-y-auto px-4 md:px-6 pb-6"
            tabIndex={-1}
          >
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div
                    className="flex items-center justify-center min-h-[50vh] bg-gray-50 dark:bg-gray-900/50 rounded-2xl m-4 transition-colors duration-300"
                    role="status"
                    aria-label="Loading content"
                  >
                    <LoadingSpinner size="lg" message="Loading content..." />
                  </div>
                }
              >
                {/* Content with conditional animation */}
                <div
                  key={location.pathname}
                  className={shouldAnimate ? "animate-fade-in" : ""}
                >
                  <Outlet />
                </div>
              </Suspense>
            </ErrorBoundary>

            {/* Back to Top Button */}
            {isScrolled && <BackToTop />}
          </main>

          {/* Footer */}
          <MemoizedFooter />
        </div>
      </div>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Layout Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl m-4 transition-colors duration-300">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

MainLayout.displayName = "MainLayout";

export default memo(MainLayout);
