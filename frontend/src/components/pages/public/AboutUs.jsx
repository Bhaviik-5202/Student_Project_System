import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import PageHeader from '../../common/PageHeader';

import {
  Info,
  Target,
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  FileCheck2,
  FolderKanban,
  Zap,
  BarChart3,
  BookOpen,
} from 'lucide-react';

/**
 * AboutUs Component
 *
 * Official institutional information page for Student Project System.
 * Rewritten for responsive typography, full light/dark mode support,
 * role-aware navigation, and institutional feature breakdown.
 */
const AboutUs = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExploreDashboard = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const role = user.role?.toLowerCase();
    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const FEATURES = [
    {
      title: 'Real-Time Milestone Tracking',
      description:
        'Live milestone tracking and sprint progress bars for student teams and project guides.',
      icon: FolderKanban,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400',
    },
    {
      title: 'Faculty Allocation Engine',
      description:
        'Automated and manual guide allocation to balance guide workload and project domains.',
      icon: Users,
      color:
        'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400',
    },
    {
      title: 'Evaluation & Rubrics',
      description:
        'Standardized grading rubrics, evaluation reviews, and feedback history logs.',
      icon: FileCheck2,
      color:
        'text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400',
    },
    {
      title: 'Centralized Resource Repository',
      description:
        'Institutional templates, documentation guidelines, project guidelines, and sample reports.',
      icon: BookOpen,
      color:
        'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400',
    },
    {
      title: 'Institutional Audit & Security',
      description:
        'Role-based access control, activity audit trails, and strict data governance compliance.',
      icon: ShieldCheck,
      color:
        'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400',
    },
    {
      title: 'Analytics & Reporting',
      description:
        'Exportable CSV & PDF reports, live performance telemetry, and grade distribution charts.',
      icon: BarChart3,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400',
    },
  ];

  return (
    <div className='w-full space-y-8 animate-fade-in pt-0 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      {/* Page Header */}
      <PageHeader
        title='About Student Project System'
        subtitle='Empowering higher education institutions with unified project governance, guide allocation, and real-time collaboration.'
        icon={Info}
      />

      {/* Hero Banner Section */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-6 sm:p-10 md:p-12 text-white shadow-xl'>
        <div className='absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none' />
        <div className='relative z-10 max-w-3xl space-y-4'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-md border border-white/20'>
            <Sparkles className='h-3.5 w-3.5 text-amber-300' />
            <span>Academic Platform Version 2.4.0</span>
          </div>

          <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight'>
            Transforming Academic Project Workflows
          </h1>

          <p className='text-blue-100 text-xs sm:text-sm md:text-base leading-relaxed'>
            Student Project System connects students, faculty guides, and system
            administrators into an integrated ecosystem. From initial project
            proposals to final rubric evaluations, every step is transparent,
            traceable, and secure.
          </p>

          <div className='pt-2'>
            <button
              onClick={handleExploreDashboard}
              className='inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-indigo-700 hover:bg-indigo-50 active:scale-[0.98] transition-all shadow-md'
            >
              <span>{user ? 'Go to My Dashboard' : 'Explore Platform'}</span>
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Pillars */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs transition-all hover:shadow-md'>
          <div className='h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400'>
            <Target className='h-5 w-5' />
          </div>
          <h3 className='text-base font-bold text-slate-900 dark:text-white'>
            Institutional Mission
          </h3>
          <p className='text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
            To provide universities and colleges with robust digital
            infrastructure that standardizes project management, eliminates
            administrative bottlenecks, and ensures timely project completion.
          </p>
        </div>

        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs transition-all hover:shadow-md'>
          <div className='h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400'>
            <Users className='h-5 w-5' />
          </div>
          <h3 className='text-base font-bold text-slate-900 dark:text-white'>
            Role-Based Workflows
          </h3>
          <p className='text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
            Tailored dashboards for System Administrators, Faculty Guides, and
            Student Groups ensure every user accesses exact tools and insights
            relevant to their role.
          </p>
        </div>

        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs transition-all hover:shadow-md'>
          <div className='h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400'>
            <ShieldCheck className='h-5 w-5' />
          </div>
          <h3 className='text-base font-bold text-slate-900 dark:text-white'>
            Compliance & Security
          </h3>
          <p className='text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
            Strict educational data protection standards with automated activity
            logging, role permissions enforcement, and secure repository
            management.
          </p>
        </div>
      </div>

      {/* Platform Features Grid */}
      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs'>
        <div className='flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4'>
          <div>
            <h2 className='text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2'>
              <Award className='text-blue-600 dark:text-blue-400 h-5 w-5' />
              <span>Core Institutional Capabilities</span>
            </h2>
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
              Comprehensive features designed for modern academic management
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className='flex flex-col justify-between rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-2'
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${feature.color}`}
                  >
                    <Icon className='h-4.5 w-4.5' />
                  </div>
                  <h4 className='text-xs font-bold text-slate-900 dark:text-white'>
                    {feature.title}
                  </h4>
                </div>
                <p className='text-[11px] leading-relaxed text-slate-600 dark:text-slate-400'>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;
