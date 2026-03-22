import { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ChevronRight,
  CheckCircle,
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

const Landing = memo(() => {
  const features = [
    {
      icon: <BookOpen className='h-6 w-6' />,
      title: 'Project Repository',
      description:
        'A centralized space to store, manage, and version all your academic project files and documentation.',
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Faculty Mentorship',
      description:
        'Direct communication channels for constant feedback from internal and external supervisors.',
    },
    {
      icon: <LayoutDashboard className='h-6 w-6' />,
      title: 'Milestone Tracking',
      description:
        'Clear timelines and automated reminders for submission deadlines and project phases.',
    },
    {
      icon: <MessageSquare className='h-6 w-6' />,
      title: 'Collaboration Hub',
      description:
        'Integrated tools for team meetings, task assignments, and real-time resource sharing.',
    },
    {
      icon: <BarChart3 className='h-6 w-6' />,
      title: 'Performance Analytics',
      description:
        'Comprehensive dashboards to track grades, evaluation feedback, and overall progress.',
    },
    {
      icon: <ShieldCheck className='h-6 w-6' />,
      title: 'Role-Based Access',
      description:
        'Secure, dedicated portals for Students, Faculty Members, and Department Heads.',
    },
  ];

  return (
    <div className='min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 dark:bg-slate-950'>
      {/* Navigation */}
      <nav className='fixed top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-md dark:bg-slate-900/70'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
          <div className='flex items-center space-x-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30'>
              <Rocket className='h-6 w-6 text-white' />
            </div>
            <span className='text-xl font-bold tracking-tight text-slate-900 dark:text-white'>
              UniProject
            </span>
          </div>
          <div className='flex items-center space-x-4'>
            <Link
              to='/login'
              className='text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400'
            >
              Sign In
            </Link>
            <Link
              to='/register'
              className='group flex items-center space-x-1 rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/25 active:scale-95'
            >
              <span>Join Now</span>
              <ChevronRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='border-b border-slate-200 bg-white pb-20 pt-32 dark:bg-slate-900 lg:pb-32 lg:pt-40'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='flex flex-col items-center space-y-8 text-center'>
            <div className='inline-flex items-center space-x-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 dark:border-blue-900/50 dark:bg-blue-900/20'>
              <span className='text-sm font-bold tracking-tight text-blue-700 dark:text-blue-400'>
                Official Student Project Management Portal
              </span>
            </div>

            <h1 className='mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl'>
              Streamline Your{' '}
              <span className='text-blue-600'>Academic Projects</span> From
              Concept to Completion.
            </h1>

            <p className='mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-400 sm:text-xl'>
              A comprehensive hub for students to collaborate, faculty to
              mentor, and administrators to oversee project excellence in one
              centralized system.
            </p>

            <div className='flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0'>
              <Link
                to='/register'
                className='w-full rounded-xl bg-blue-600 px-10 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-blue-700 sm:w-auto'
              >
                Get Started
              </Link>
              <Link
                to='/login'
                className='w-full rounded-xl border border-slate-300 bg-white px-10 py-4 text-lg font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:w-auto'
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-white py-24 dark:bg-slate-900/50'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-16 text-center'>
            <h2 className='text-base font-bold uppercase tracking-widest text-blue-600'>
              Features
            </h2>
            <p className='mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl'>
              Everything you need to succeed
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature, idx) => (
              <div
                key={idx}
                className='rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900'
              >
                <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                  {feature.icon}
                </div>
                <h3 className='mb-3 text-xl font-bold text-slate-900 dark:text-white'>
                  {feature.title}
                </h3>
                <p className='leading-relaxed text-slate-600 dark:text-slate-400'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction Details */}
      <section className='overflow-hidden py-24'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl'>
                Bridge the Gap Between <br />
                <span className='text-blue-600'>Students and Faculty</span>
              </h2>
              <p className='mt-6 text-lg text-slate-600 dark:text-slate-400'>
                Our platform provides a structured environment for academic
                projects. Whether you are a student submitting your first
                proposal or a faculty member overseeing multiple batches, our
                tools ensure clarity, accountability, and efficiency.
              </p>

              <ul className='mt-10 space-y-4'>
                {[
                  'Centralized repository for all project documentation',
                  'Automated milestone notifications and reminders',
                  'Integrated chat and feedback loops',
                  'Secure role-based file sharing and grading',
                ].map((item, i) => (
                  <li
                    key={i}
                    className='flex items-center space-x-3 text-slate-700 dark:text-slate-300'
                  >
                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
                      <CheckCircle className='h-4 w-4' />
                    </div>
                    <span className='font-medium'>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='relative'>
              <div className='relative z-10 rounded-3xl border border-white/20 bg-slate-200/50 p-4 shadow-2xl backdrop-blur-md dark:bg-slate-800/50'>
                <div className='overflow-hidden rounded-2xl bg-white dark:bg-slate-900'>
                  {/* Mock UI for Dashboard preview */}
                  <div className='flex h-4 items-center justify-between border-b border-slate-100 px-4 py-8 dark:border-slate-800'>
                    <div className='flex space-x-2'>
                      <div className='h-3 w-3 rounded-full bg-red-400' />
                      <div className='h-3 w-3 rounded-full bg-yellow-400' />
                      <div className='h-3 w-3 rounded-full bg-green-400' />
                    </div>
                    <div className='h-4 w-32 rounded-full bg-slate-100 dark:bg-slate-800' />
                  </div>
                  <div className='space-y-6 p-8'>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='flex h-20 flex-col items-center justify-center rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20'>
                        <div className='mb-2 h-2 w-12 rounded-full bg-blue-200 dark:bg-blue-800' />
                        <div className='h-4 w-8 rounded-full bg-blue-600' />
                      </div>
                      <div className='flex h-20 flex-col items-center justify-center rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-900/20'>
                        <div className='mb-2 h-2 w-12 rounded-full bg-indigo-200 dark:bg-indigo-800' />
                        <div className='h-4 w-8 rounded-full bg-indigo-600' />
                      </div>
                      <div className='flex h-20 flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50'>
                        <div className='mb-2 h-2 w-12 rounded-full bg-slate-200 dark:bg-slate-700' />
                        <div className='h-4 w-8 rounded-full bg-slate-400' />
                      </div>
                    </div>
                    <div className='space-y-4'>
                      <div className='h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800' />
                      <div className='h-4 w-5/6 rounded-full bg-slate-50 dark:bg-slate-800/50' />
                      <div className='h-24 w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='absolute -bottom-8 -right-8 -z-10 h-64 w-64 animate-pulse rounded-full bg-blue-600/20 blur-3xl' />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950/50'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='flex flex-col items-center justify-between space-y-4 text-slate-600 dark:text-slate-400 md:flex-row md:space-y-0'>
            <div className='flex items-center space-x-2'>
              <GraduationCap className='h-6 w-6 text-blue-600' />
              <span className='text-lg font-bold text-slate-900 dark:text-white'>
                UniProject
              </span>
            </div>
            <p className='text-sm'>
              © {new Date().getFullYear()} Student Project Management System.
              All rights reserved.
            </p>
            <div className='flex space-x-6 text-sm font-medium'>
              <a href='#' className='transition-colors hover:text-blue-600'>
                Support
              </a>
              <a href='#' className='transition-colors hover:text-blue-600'>
                Privacy
              </a>
              <a href='#' className='transition-colors hover:text-blue-600'>
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});

Landing.displayName = 'Landing';

export default Landing;
