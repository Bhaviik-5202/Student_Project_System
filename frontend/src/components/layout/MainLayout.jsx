import { useState, useEffect, Suspense, useCallback, memo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../common/Header";
import TopNav from "../common/TopNav";
import Footer from "../common/Footer";
import Breadcrumb from "../common/Breadcrumb";
import LoadingSpinner from "../common/LoadingSpinner";
import BackToTop from "../common/BackToTop.jsx";
import PageTransition from "../common/PageTransition";
import ErrorBoundary from "../common/ErrorBoundary";
import useScreenSize from "../../hooks/useScreenSize";

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isMobile } = useScreenSize();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    [],
  );
  const handleCloseMobileMenu = useCallback(
    () => setIsMobileMenuOpen(false),
    [],
  );

  const shouldAnimate = !location.pathname.includes("/chat");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans flex flex-col transition-colors duration-200">
      <Header
        isScrolled={isScrolled}
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <TopNav
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
        onCloseMobileMenu={handleCloseMobileMenu}
      />

      <div className="flex flex-1 mt-30">
        <div className="flex-1 flex flex-col min-w-0 w-full relative">
          {!isMobile && (
            <nav className="px-4 md:px-6 pt-4" aria-label="Breadcrumb">
              <Breadcrumb />
            </nav>
          )}

          <main
            id="main-content"
            className="flex-1 px-4 md:px-6 py-4 pb-6 relative z-10"
          >
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[50vh]">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <PageTransition
                  pathname={location.pathname}
                  shouldAnimate={shouldAnimate}
                >
                  <Outlet />
                </PageTransition>
              </Suspense>
            </ErrorBoundary>
            {isScrolled && <BackToTop />}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default memo(MainLayout);
