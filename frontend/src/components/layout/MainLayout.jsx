import { useState, useEffect, Suspense, useCallback, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import TopNav from '../common/TopNav';
import Footer from '../common/Footer';
import LoadingSpinner from '../common/LoadingSpinner';
import BackToTop from '../common/BackToTop.jsx';
import PageTransition from '../common/PageTransition';
import ErrorBoundary from '../common/ErrorBoundary';
import Skeleton, { DashboardSkeleton, TableSkeleton } from '../common/Skeleton';
import useScreenSize from '../../hooks/useScreenSize';
import AnimatedBackground from './AnimatedBackground';

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isMobile } = useScreenSize();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    []
  );
  const handleCloseMobileMenu = useCallback(
    () => setIsMobileMenuOpen(false),
    []
  );

  return (
    <div className='flex min-h-screen flex-col bg-gray-50 dark:bg-gray-800 font-sans transition-colors duration-200 dark:bg-slate-900'>
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

      <div className='mt-18 flex flex-1'>
        <div className='relative flex w-full min-w-0 flex-1 flex-col'>
          <AnimatedBackground />
          <main
            id='main-content'
            className='relative z-10 flex-1 px-4 pb-6 md:px-6'
          >
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className='animate-fade-in p-4 md:p-6'>
                    {location.pathname.includes('dashboard') ? (
                      <DashboardSkeleton />
                    ) : location.pathname.includes('list') ||
                      location.pathname.includes('audit') ||
                      location.pathname.includes('projects') ? (
                      <TableSkeleton />
                    ) : (
                      <div className='space-y-6'>
                        <Skeleton
                          height='40px'
                          width='300px'
                          className='mb-8'
                        />
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                          <Skeleton height='200px' />
                          <Skeleton height='200px' />
                          <Skeleton height='200px' />
                        </div>
                        <Skeleton height='400px' />
                      </div>
                    )}
                  </div>
                }
              >
                <PageTransition pathname={location.pathname}>
                  <Outlet />
                </PageTransition>
              </Suspense>
            </ErrorBoundary>
            {isScrolled && <BackToTop />}
          </main>

          <Footer
            variant={location.pathname === '/dashboard' ? 'full' : 'minimal'}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(MainLayout);
