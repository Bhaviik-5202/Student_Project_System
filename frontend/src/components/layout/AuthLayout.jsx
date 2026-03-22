import { memo, useMemo, useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * AuthLayout - Main layout for authentication pages (Login, Register, Forgot Password)
 * Features premium branding, animations, and feature highlights.
 */
const AuthLayout = ({ children }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = useMemo(
    () => [
      { icon: 'users', text: 'Role-based access control' },
      { icon: 'chart-line', text: 'Real-time progress tracking' },
      { icon: 'comments', text: 'Integrated collaboration tools' },
      { icon: 'calendar-check', text: 'Deadline management' },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { label: 'Active Projects', value: '500+' },
      { label: 'Users', value: '2.5K+' },
      { label: 'Satisfaction', value: '98%' },
    ],
    []
  );

  return (
    <div className='flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 lg:flex-row'>
      {/* Left Side - Branding (Hidden on mobile) */}
      <div
        className={`relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 transition-all duration-700 lg:flex xl:p-16 ${showContent ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
      >
        {/* Background Decorative Elements */}
        <div className='absolute left-10 top-20 h-64 w-64 -translate-x-32 -translate-y-32 animate-pulse rounded-full bg-blue-200 opacity-20 blur-3xl dark:bg-blue-900/30' />
        <div
          className='absolute bottom-10 right-0 h-72 w-72 translate-x-32 translate-y-32 animate-pulse rounded-full bg-indigo-200 opacity-20 blur-3xl dark:bg-indigo-900/30'
          style={{ animationDelay: '1s' }}
        />

        <div className='relative z-10'>
          <Link to='/' className='group mb-8 flex items-center space-x-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg transition-transform group-hover:scale-110'>
              <i className='fas fa-graduation-cap text-xl text-white'></i>
            </div>
            <span className='text-2xl font-bold text-slate-800 dark:text-white'>
              UniProject
            </span>
          </Link>

          <h1 className='mb-6 text-4xl font-bold leading-tight text-slate-900 dark:text-white xl:text-5xl'>
            Academic Project
            <br />
            <span className='text-blue-600 dark:text-blue-400'>
              Management System
            </span>
          </h1>

          <p className='mb-10 max-w-md text-lg text-slate-600 dark:text-slate-400'>
            Streamline your academic journey with our comprehensive project
            management platform. Collaborate, track, and achieve excellence.
          </p>

          <div className='space-y-4'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='flex animate-fade-in items-center space-x-4'
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                  <i className={`fas fa-${feature.icon}`}></i>
                </div>
                <span className='font-medium text-slate-700 dark:text-slate-300'>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='relative z-10 mt-auto grid grid-cols-3 gap-8 border-t border-slate-200 pt-10 dark:border-slate-800'>
          {stats.map((stat, idx) => (
            <div key={idx} className='text-center'>
              <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                {stat.value}
              </div>
              <div className='text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Content Container */}
      <div className='relative flex flex-1 items-center justify-center p-4 sm:p-8'>
        <div className='pointer-events-none absolute inset-0 overflow-hidden lg:hidden'>
          <div className='absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-200 opacity-30 blur-3xl dark:bg-indigo-900/20' />
          <div className='absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-200 opacity-30 blur-3xl dark:bg-blue-900/20' />
        </div>

        <div
          className={`relative z-10 w-full max-w-md rounded-3xl border border-white/40 bg-white/95 p-8 shadow-2xl backdrop-blur-xl transition-all duration-700 dark:border-slate-700/40 dark:bg-slate-800/95 sm:p-10 ${showContent ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        >
          <Suspense
            fallback={
              <div className='flex h-64 flex-col items-center justify-center gap-4'>
                <div className='border-3 h-10 w-10 animate-spin rounded-full border-blue-600 border-t-transparent'></div>
                <p className='animate-pulse text-sm text-slate-400'>
                  Initializing security module...
                </p>
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(AuthLayout);
