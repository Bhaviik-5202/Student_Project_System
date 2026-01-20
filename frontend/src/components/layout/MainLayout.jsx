import { useState, useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import Footer from "../common/Footer";
import Breadcrumb from "../common/Breadcrumb";
import LoadingSpinner from "../common/LoadingSpinner";
import useScreenSize from "../../hooks/useScreenSize";

const MainLayout = () => {
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
        isScrolled={isScrolled}
        notificationCount={notificationCount}
        clearNotifications={() => setNotificationCount(0)}
      />

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className="sidebar-container fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 hidden md:block overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-64 lg:ml-72">
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
    </div>
  );
};

export default MainLayout;
