import { memo, useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  GraduationCap,
  Users,
  LayoutDashboard,
  MessageSquare,
  Calendar,
} from 'lucide-react';

/**
 * AuthLayout - Standard layout for authentication pages
 * A clean, professional container for Login and Register forms.
 */
const AuthLayout = ({ children }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const features = [
    { icon: <Users className='h-5 w-5' />, text: 'Role-based Access Control' },
    {
      icon: <LayoutDashboard className='h-5 w-5' />,
      text: 'Project Tracking Dashboard',
    },
    {
      icon: <MessageSquare className='h-5 w-5' />,
      text: 'Faculty-Student Collaboration',
    },
    { icon: <Calendar className='h-5 w-5' />, text: 'Submission Management' },
  ];

  return (
    <div className='flex min-h-screen bg-slate-50 dark:bg-slate-900 lg:flex-row'>
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className='hidden w-1/2 flex-col justify-center bg-blue-600 p-12 text-white lg:flex xl:p-20'>
        <div className='max-w-lg'>
          <Link to='/' className='mb-12 flex items-center space-x-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md'>
              <GraduationCap className='h-8 w-8 text-white' />
            </div>
            <span className='text-2xl font-bold tracking-tight'>
              Student Project System
            </span>
          </Link>

          <h1 className='mb-6 text-4xl font-extrabold leading-tight xl:text-5xl'>
            Manage Academic Projects <br />
            <span className='text-blue-200'>With Ease.</span>
          </h1>

          <p className='mb-12 text-lg text-blue-100'>
            A comprehensive platform designed for students, faculty, and
            administrators to streamline the entire project lifecycle from
            proposal to final submission.
          </p>

          <div className='grid gap-6'>
            {features.map((feature, index) => (
              <div key={index} className='flex items-center space-x-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white/10'>
                  {feature.icon}
                </div>
                <span className='text-lg font-medium'>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className='flex flex-1 items-center justify-center p-6 sm:p-12'>
        <div
          className={`w-full max-w-md transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <div className='rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-800 sm:p-10'>
            <div className='mb-8 flex flex-col items-center lg:hidden'>
              <GraduationCap className='mb-2 h-12 w-12 text-blue-600' />
              <h1 className='text-xl font-bold text-slate-900 dark:text-white'>
                Student Project System
              </h1>
            </div>

            <Suspense
              fallback={
                <div className='flex h-64 items-center justify-center'>
                  <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
                </div>
              }
            >
              {children}
            </Suspense>
          </div>

          <p className='mt-8 text-center text-sm text-slate-500 dark:text-slate-400'>
            &copy; {new Date().getFullYear()} Student Project Management System.
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(AuthLayout);
