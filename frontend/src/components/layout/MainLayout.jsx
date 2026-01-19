import { useState, useEffect, useCallback, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import Footer from "../common/Footer";
import Breadcrumb from "../common/Breadcrumb";
import LoadingSpinner from "../common/LoadingSpinner";
import useScreenSize from "../../hooks/useScreenSize";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Start with 3 notifications
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

  // Handle click outside sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar-container");
      const toggleBtn = document.querySelector(".sidebar-toggle");

      if (
        sidebarOpen &&
        isMobile &&
        sidebar &&
        !sidebar.contains(event.target) &&
        !toggleBtn?.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans flex flex-col">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
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
        }}
      />

      {/* Header */}
      <Header
        toggleSidebar={toggleSidebar}
        isScrolled={isScrolled}
        notificationCount={notificationCount}
        clearNotifications={() => setNotificationCount(0)}
        sidebarOpen={sidebarOpen}
      />

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (isMobile || isTablet) && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div
          className={`sidebar-container fixed md:relative z-40 h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobile={isMobile}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Breadcrumb Navigation - Only show on desktop */}
          {!isMobile && (
            <div className="px-4 md:px-6 pt-4">
              <Breadcrumb />
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
            {/* Page content with loading state */}
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              {/* Content animation based on route change */}
              <div key={location.pathname} className="animate-fade-in">
                <Outlet />
              </div>
            </Suspense>

            {/* Back to Top Button */}
            {isScrolled && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 group"
                aria-label="Back to top"
              >
                <svg
                  className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform"
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

      {/* Mobile Floating Action Button for sidebar */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 bottom-6 z-40 w-12 h-12 bg-primary-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-primary-700 hover:shadow-xl transition-all duration-300 animate-bounce-slow"
          aria-label="Open menu"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>
      )}

      {/* Quick Actions Panel */}
      {isDesktop && (
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-30">
          <div className="flex flex-col items-end space-y-2 pr-2">
            <button
              onClick={() => window.print()}
              className="w-10 h-10 bg-white rounded-l-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200 group"
              aria-label="Print page"
              title="Print"
            >
              <i className="fas fa-print"></i>
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-10 h-10 bg-white rounded-l-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200 group"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
            <button
              onClick={() => {
                const html = document.documentElement;
                html.classList.toggle("dark");
                localStorage.setItem(
                  "theme",
                  html.classList.contains("dark") ? "dark" : "light",
                );
              }}
              className="w-10 h-10 bg-white rounded-l-lg shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-200 group"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              <i className="fas fa-moon"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
