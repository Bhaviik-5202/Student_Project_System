import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ChevronRight,
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronDown,
  Target,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

const Landing = memo(() => {
  const [activeSection, setActiveSection] = useState('hero');

  // Track scroll position to update active dot indicator
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'features', 'benefits'];
      const scrollPos = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const el = document.getElementById(`section-${section}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <ShieldCheck className='h-5 w-5 text-blue-500' />,
      title: 'Secure Authentication',
      description: 'Industry-standard JWT tokens, password hashing, and verify-OTP signups protect user accounts.',
    },
    {
      icon: <LayoutDashboard className='h-5 w-5 text-indigo-500' />,
      title: 'Easy Project Management',
      description: 'Define timelines, update progress status, and track approvals from initial proposal to graduation.',
    },
    {
      icon: <Users className='h-5 w-5 text-violet-500' />,
      title: 'Team Collaboration',
      description: 'Create student project groups, schedule meetings, and share internal feedback logs.',
    },
    {
      icon: <BookOpen className='h-5 w-5 text-sky-500' />,
      title: 'File Sharing',
      description: 'Centralized deliverables portal to upload project documentation, reports, and source files.',
    },
    {
      icon: <BarChart3 className='h-5 w-5 text-emerald-500' />,
      title: 'Dashboard & Analytics',
      description: 'Graphical evaluation metrics, grade distributions, and timeline tracking charts.',
    },
    {
      icon: <Zap className='h-5 w-5 text-amber-500' />,
      title: 'Real-time Notifications',
      description: 'Stay updated instantly with email notices on meeting updates, approvals, and deadlines.',
    },
    {
      icon: <Sparkles className='h-5 w-5 text-purple-500' />,
      title: 'Responsive Design',
      description: 'Consistent, premium user experience fully optimized for mobile, tablet, and desktop viewports.',
    },
  ];

  return (
    <div className='h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-950 dark:selection:text-blue-200 transition-colors duration-300 relative'>
      
      {/* Background Decorative Ambient Orbs */}
      <div className='fixed left-1/4 top-12 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-600/5' />
      <div className='fixed right-1/4 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[160px] dark:bg-indigo-600/5' />

      {/* Floating Side Dot Navigation */}
      <div className='fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col space-y-4'>
        {['hero', 'about', 'features', 'benefits'].map((section) => (
          <a
            key={section}
            href={`#section-${section}`}
            className={`h-3.5 w-3.5 rounded-full transition-all duration-300 border-2 ${
              activeSection === section
                ? 'bg-blue-600 border-blue-600 scale-125 shadow-md shadow-blue-500/35 dark:bg-blue-400 dark:border-blue-400'
                : 'bg-transparent border-slate-400 hover:border-blue-500 hover:bg-blue-500/20'
            }`}
            title={`Scroll to ${section}`}
          />
        ))}
      </div>

      {/* Sticky Premium Navbar */}
      <nav className='fixed top-0 z-50 w-full border-b border-slate-100/80 bg-white/70 backdrop-blur-lg dark:border-slate-800/40 dark:bg-slate-900/70'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
          <Link to='/' className='flex items-center space-x-3 group'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200'>
              <GraduationCap className='h-5.5 w-5.5 text-white' />
            </div>
            <span className='text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
              UniProject
            </span>
          </Link>
          <div className='flex items-center space-x-5'>
            <Link
              to='/login'
              className='text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400'
            >
              Sign In
            </Link>
            <Link
              to='/register'
              className='group flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/15 hover:brightness-110 active:scale-95 transition-all'
            >
              <span>Sign Up</span>
              <ChevronRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </Link>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero Section */}
      <section
        id='section-hero'
        className='h-screen snap-start w-full flex flex-col justify-center items-center relative px-6 text-center'
      >
        <div className='max-w-4xl space-y-6 pt-16'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='inline-flex items-center space-x-2.5 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 dark:border-blue-900/30 dark:bg-blue-950/30'
          >
            <span className='h-2 w-2 rounded-full bg-blue-500 animate-pulse' />
            <span className='text-xs font-extrabold tracking-wider text-blue-700 dark:text-blue-400 uppercase'>
              Unified Academic Project Portal
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]'
          >
            Streamline Academic Projects <br />
            <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent'>
              From Idea to Evaluation
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium'
          >
            A premium digital environment designed for students to build and collaborate, faculty to review and grade, and departments to seamlessly coordinate milestones.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4'
          >
            <Link
              to='/register'
              className='w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-blue-500/15 hover:brightness-110 active:scale-95 transition-all'
            >
              <span>Sign Up</span>
              <ArrowRight className='h-5 w-5' />
            </Link>
            <Link
              to='/login'
              className='w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 active:scale-95 transition-all'
            >
              Sign In
            </Link>
          </motion.div>
        </div>

        {/* Bouncing Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className='absolute bottom-8 flex flex-col items-center cursor-pointer'
        >
          <a href='#section-about' className='flex flex-col items-center group'>
            <span className='text-xs font-semibold text-slate-400 group-hover:text-blue-500 transition-colors uppercase tracking-widest mb-1.5'>
              Scroll down
            </span>
            <ChevronDown className='h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors animate-bounce' />
          </a>
        </motion.div>
      </section>

      {/* Section 2: About the Platform */}
      <section
        id='section-about'
        className='h-screen snap-start w-full flex items-center justify-center relative px-6 py-20 border-t border-slate-100 dark:border-slate-900 bg-white/40 dark:bg-slate-900/10 backdrop-blur-3xl'
      >
        <div className='max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Visual Showcase Illustration */}
          <div className='relative hidden lg:block'>
            <div className='relative z-10 rounded-2xl border border-white/20 bg-slate-200/20 p-4 shadow-xl backdrop-blur-md dark:bg-slate-800/20'>
              <div className='overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 space-y-5'>
                <div className='flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800'>
                  <div className='h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400'>
                    <Target className='h-4 w-4' />
                  </div>
                  <div>
                    <h4 className='text-sm font-bold text-slate-800 dark:text-slate-200'>Project Proposal Phase</h4>
                    <p className='text-[10px] text-slate-400'>Updated 2 minutes ago</p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex justify-between items-center text-xs'>
                    <span className='font-semibold text-slate-600 dark:text-slate-400'>1. Synopsis Upload</span>
                    <span className='text-emerald-500 font-bold'>Completed</span>
                  </div>
                  <div className='flex justify-between items-center text-xs'>
                    <span className='font-semibold text-slate-600 dark:text-slate-400'>2. Guide Allocation</span>
                    <span className='text-emerald-500 font-bold'>Completed</span>
                  </div>
                  <div className='flex justify-between items-center text-xs'>
                    <span className='font-semibold text-slate-600 dark:text-slate-400'>3. Evaluation Review</span>
                    <span className='text-blue-500 font-bold'>In Progress</span>
                  </div>
                </div>

                <div className='pt-2'>
                  <div className='flex justify-between text-[11px] font-semibold text-slate-500 mb-1'>
                    <span>Milestone Progress</span>
                    <span>75%</span>
                  </div>
                  <div className='h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
                    <div className='h-full w-3/4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full' />
                  </div>
                </div>
              </div>
            </div>
            <div className='absolute -bottom-6 -left-6 -z-10 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl' />
            <div className='absolute -top-6 -right-6 -z-10 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl' />
          </div>

          {/* About Content */}
          <div className='space-y-6'>
            <h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
              About the Platform
            </h2>
            <p className='text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed'>
              UniProject was created to resolve the operational friction that typically arises during academic project courses. We bridge students, guides, and departments onto a unified platform.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2'>
              <div className='flex space-x-3.5'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex-shrink-0'>
                  <FileText className='h-5 w-5' />
                </div>
                <div>
                  <h4 className='font-bold text-sm sm:text-base'>Problems Solved</h4>
                  <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>Eliminates version confusion, late file hand-ins, and manual review boards.</p>
                </div>
              </div>

              <div className='flex space-x-3.5'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0'>
                  <Users className='h-5 w-5' />
                </div>
                <div>
                  <h4 className='font-bold text-sm sm:text-base'>Who Can Use It</h4>
                  <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>Distinct secure views for Students (uploads), Faculty (guides), and Admins (setup).</p>
                </div>
              </div>

              <div className='flex space-x-3.5'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex-shrink-0'>
                  <Clock className='h-5 w-5' />
                </div>
                <div>
                  <h4 className='font-bold text-sm sm:text-base'>Why It Was Created</h4>
                  <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>Constructed to replace spreadsheets and paper logs with real-time audit verification.</p>
                </div>
              </div>

              <div className='flex space-x-3.5'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex-shrink-0'>
                  <Layers className='h-5 w-5' />
                </div>
                <div>
                  <h4 className='font-bold text-sm sm:text-base'>Unified Ecosystem</h4>
                  <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>Seamless coordination of meetings, timelines, syllabus, and marks sheet rubrics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Platform Features */}
      <section
        id='section-features'
        className='h-screen snap-start w-full flex items-center justify-center relative px-6 py-20 bg-white dark:bg-slate-900/40'
      >
        <div className='max-w-7xl w-full flex flex-col justify-center h-full'>
          <div className='text-center max-w-2xl mx-auto mb-10'>
            <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
              Major Features
            </h2>
            <p className='text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2'>
              Enjoy high-fidelity project management tools custom-built for academic workflows.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar'>
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className='group border border-slate-200/60 bg-white p-5 rounded-2xl shadow-sm dark:border-slate-800/40 dark:bg-slate-900/80'
              >
                <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 transition-colors group-hover:bg-blue-500/10'>
                  {feat.icon}
                </div>
                <h3 className='mb-1.5 font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base'>
                  {feat.title}
                </h3>
                <p className='leading-relaxed text-slate-500 dark:text-slate-400 text-xs'>
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Benefits & Call-to-Action */}
      <section
        id='section-benefits'
        className='h-screen snap-start w-full flex items-center justify-center relative px-6 py-20 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50'
      >
        <div className='max-w-4xl w-full flex flex-col justify-center h-full space-y-10'>
          <div className='text-center space-y-4'>
            <h2 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
              Benefits & User Experience
            </h2>
            <p className='text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto'>
              Why institutions adopt UniProject over manual filing systems.
            </p>
          </div>

          {/* Grid of highlight items */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
            <div className='p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm'>
              <h4 className='font-bold text-sm sm:text-base text-blue-600 dark:text-blue-400 flex items-center gap-2'>
                <ShieldCheck className='h-5 w-5' />
                Security First
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed'>
                Password hashing, secure HTTP headers (Helmet), JWT authorizations, and audit logging track all actions.
              </p>
            </div>

            <div className='p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm'>
              <h4 className='font-bold text-sm sm:text-base text-indigo-600 dark:text-indigo-400 flex items-center gap-2'>
                <Zap className='h-5 w-5' />
                Fast Performance
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed'>
                Stateless backend, React memoization, and lazy loading keep pages loading instantly on any network.
              </p>
            </div>

            <div className='p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm'>
              <h4 className='font-bold text-sm sm:text-base text-violet-600 dark:text-violet-400 flex items-center gap-2'>
                <Sparkles className='h-5 w-5' />
                Ease of Use
              </h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed'>
                Intuitive layout triggers, forms autofill, auto-focus code traversals, and simple dashboards require zero training.
              </p>
            </div>
          </div>

          {/* Final Call to Action Block */}
          <div className='rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center space-y-5 shadow-lg relative overflow-hidden'>
            <div className='absolute right-0 top-0 h-40 w-40 bg-white/5 blur-2xl rounded-full' />
            <h3 className='text-xl sm:text-2xl font-bold'>Ready to Manage Academic Projects Effortlessly?</h3>
            <p className='text-xs sm:text-sm text-blue-100 max-w-lg mx-auto leading-relaxed'>
              Sign up today as a student to coordinate your submissions, or sign in to verify updates on your team milestones.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center space-y-3.5 sm:space-y-0 sm:space-x-4 pt-1'>
              <Link
                to='/register'
                className='w-full sm:w-auto flex items-center justify-center rounded-xl bg-white px-8 py-3 text-sm font-bold text-blue-700 shadow-md hover:bg-slate-50 transition-all active:scale-[0.98]'
              >
                Sign Up
              </Link>
              <Link
                to='/login'
                className='w-full sm:w-auto flex items-center justify-center rounded-xl border border-white/30 bg-transparent px-8 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all active:scale-[0.98]'
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Embedded at the bottom of Section 4) */}
      <div className='absolute bottom-0 w-full border-t border-slate-200/50 py-4 bg-slate-100/30 dark:border-slate-800/40 dark:bg-slate-950/30 text-center text-xs text-slate-500 dark:text-slate-400'>
        © {new Date().getFullYear()} UniProject Academic Portal. All rights reserved.
      </div>

    </div>
  );
});

Landing.displayName = 'Landing';

export default Landing;
