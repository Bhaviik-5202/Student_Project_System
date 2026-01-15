import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import Footer from "../common/Footer";
import Breadcrumb from "../common/Breadcrumb.jsx";
import LoadingSpinner from "../common/LoadingSpinner";
import useScreenSize from "../../hooks/useScreenSize";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  // Handle scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile, sidebarOpen]);

  // Responsive sidebar behavior
  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(true);
    } else if (isTablet || isMobile) {
      setSidebarOpen(false);
    }
  }, [isDesktop, isTablet, isMobile]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
      // Escape to close sidebar
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [sidebarOpen, toggleSidebar]);

  // Simulate notification updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In real app, this would be an API call
      setNotificationCount((prev) =>
        Math.min(prev + Math.floor(Math.random() * 2), 99)
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotificationCount(0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans flex flex-col transition-colors duration-200">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
          },
        }}
      />

      {/* Header */}
      <Header
        toggleSidebar={toggleSidebar}
        isScrolled={isScrolled}
        notificationCount={notificationCount}
        clearNotifications={clearNotifications}
      />

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (isMobile || isTablet) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 pt-16 relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-300">
          {/* Breadcrumb Navigation */}
          <div
            className={`px-4 md:px-6 pt-4 transition-all duration-300 ${
              isScrolled ? "pb-2" : "pb-4"
            }`}
          >
            <Breadcrumb />
          </div>

          <main className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
            {/* Main Content - Page components handle their own headers */}
            <Suspense fallback={<LoadingSpinner fullPage={false} />}>
              <Outlet />
            </Suspense>

            {/* Back to Top Button */}
            {isScrolled && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-6 right-6 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 hover:scale-110 z-40"
                aria-label="Back to top"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            )}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Mobile Navigation Bar (for bottom nav on mobile) */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center z-50 lg:hidden">
          {/* Add mobile navigation items here */}
        </div>
      )}

      {/* Theme Toggle (optional) */}
      <div className="fixed bottom-20 right-6 z-40">
        <button className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Theme toggle icon */}
        </button>
      </div>
    </div>
  );
};

export default MainLayout;
