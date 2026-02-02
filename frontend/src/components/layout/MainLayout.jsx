import React, { useState, useEffect, Suspense, useCallback, memo, Component } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import Footer from "../common/Footer";
import Breadcrumb from "../common/Breadcrumb";
import LoadingSpinner from "../common/LoadingSpinner";
import BackToTop from "../common/BackToTop.jsx";
import useScreenSize from "../../hooks/useScreenSize";
import { useAuth } from "../../context/AuthContext";

// Memoized components for better performance
const MemoizedSidebar = memo(Sidebar);
const MemoizedHeader = memo(Header);
const MemoizedBreadcrumb = memo(Breadcrumb);
const MemoizedFooter = memo(Footer);

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Clear notifications callback
  const handleClearNotifications = useCallback(() => {
    setNotificationCount(0);
  }, []);

  // Toggle mobile sidebar
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
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
        onMenuClick={isMobile ? toggleMobileSidebar : undefined}
      />

      <div className="flex flex-1 pt-16">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside
            className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-30 overflow-y-auto"
            aria-label="Main navigation"
          >
            <MemoizedSidebar />
          </aside>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
              onClick={toggleMobileSidebar}
              aria-hidden="true"
            />

            {/* Drawer */}
            <aside
              className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 z-50 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto"
              aria-label="Mobile navigation"
            >
              <MemoizedSidebar onNavigate={toggleMobileSidebar} />
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-64 lg:ml-72">
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
                    className="flex items-center justify-center min-h-[50vh]"
                    role="status"
                    aria-label="Loading content"
                  >
                    <LoadingSpinner size="lg" />
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

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 z-40 shadow-lg">
          <MobileNav currentPath={location.pathname} userRole={user?.role} />
        </div>
      )}
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
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
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

// Mobile Navigation Component with role-based items
const MobileNav = memo(({ currentPath, userRole }) => {
  const getNavItems = () => {
    const baseItems = [
      {
        label: "Dashboard",
        path: "/dashboard",
        color: "from-blue-500 to-blue-600",
        roles: ["admin", "faculty", "student"],
      },
      {
        label: "Projects",
        path: "/projects",
        color: "from-green-500 to-green-600",
        roles: ["admin", "faculty", "student"],
      },
      {
        label: "Chat",
        path: "/chat",
        color: "from-purple-500 to-purple-600",
        roles: ["admin", "faculty", "student"],
      },
      {
        label: "Profile",
        path: "/profile",
        color: "from-gray-500 to-gray-600",
        roles: ["admin", "faculty", "student"],
      },
    ];

    return baseItems.filter((item) => item.roles.includes(userRole));
  };

  const navItems = getNavItems();

  return (
    <nav
      className="flex justify-between items-center"
      aria-label="Mobile navigation"
    >
      {navItems.map((item) => {
        const isActive =
          currentPath === item.path || currentPath.startsWith(item.path + "/");

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
              isActive
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <div
              className={`w-6 h-6 rounded-md bg-gradient-to-br ${item.color} ${
                isActive ? "ring-2 ring-blue-400 ring-offset-1" : ""
              }`}
            />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
});

MobileNav.displayName = "MobileNav";

MainLayout.displayName = "MainLayout";

export default memo(MainLayout);
