import { useState, useEffect, Suspense, useCallback, memo } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import Footer from "../common/Footer";
import Breadcrumb from "../common/Breadcrumb";
import LoadingSpinner from "../common/LoadingSpinner";
import BackToTop from "../common/BackToTop.jsx";
import useScreenSize from "../../hooks/useScreenSize";

// Memoized components for better performance
const MemoizedSidebar = memo(Sidebar);
const MemoizedHeader = memo(Header);
const MemoizedBreadcrumb = memo(Breadcrumb);
const MemoizedFooter = memo(Footer);

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount] = useState(3);
  const location = useLocation();
  const { isMobile } = useScreenSize();

  // Optimized scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clear notifications callback
  const handleClearNotifications = useCallback(() => {
    console.log("Notifications cleared");
  }, []);

  // Toast configuration
  const toastOptions = {
    duration: 4000,
    style: {
      background: "#ffffff",
      color: "#374151",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    },
    success: {
      iconTheme: {
        primary: "#10B981",
        secondary: "#ffffff",
      },
    },
    error: {
      iconTheme: {
        primary: "#EF4444",
        secondary: "#ffffff",
      },
    },
  };

  // Skip animation for certain routes
  const shouldAnimate = !location.pathname.includes("/chat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans flex flex-col">
      {/* Toast Notifications */}
      <Toaster
        position={isMobile ? "top-center" : "top-right"}
        toastOptions={toastOptions}
      />

      {/* Header */}
      <MemoizedHeader
        isScrolled={isScrolled}
        notificationCount={notificationCount}
        clearNotifications={handleClearNotifications}
      />

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        {!isMobile && (
          <aside
            className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-30 overflow-y-auto"
            aria-label="Main navigation"
          >
            <MemoizedSidebar />
          </aside>
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
          <main className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
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
                role="main"
              >
                <Outlet />
              </div>
            </Suspense>

            {/* Back to Top Button */}
            {isScrolled && <BackToTop />}
          </main>

          {/* Footer */}
          <MemoizedFooter />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 z-40 shadow-lg">
          <MobileNav currentPath={location.pathname} />
        </div>
      )}
    </div>
  );
};

// Mobile Navigation Component with simple colored blocks as icons
const MobileNav = ({ currentPath }) => {
  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Courses",
      path: "/courses",
      color: "from-green-500 to-green-600",
    },
    {
      label: "Chat",
      path: "/chat",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Settings",
      path: "/settings",
      color: "from-gray-500 to-gray-600",
    },
  ];

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
                ? "text-primary-600 bg-primary-50"
                : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
            }`}
            aria-label={item.label}
          >
            <div
              className={`w-6 h-6 rounded-md bg-gradient-to-br ${item.color} ${
                isActive ? "ring-2 ring-primary-400 ring-offset-1" : ""
              }`}
            />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default memo(MainLayout);
