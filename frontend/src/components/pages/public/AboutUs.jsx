import React from 'react';
import {
  Info,
  Target,
  Users,
  Shield,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const AboutUs = () => {
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
    } else if (role === 'faculty') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className='space-y-8 animate-fade-in pt-0 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <PageHeader
        title='About Student Project System'
        subtitle='Engineered to streamline academic project governance, team collaboration, and faculty evaluations.'
        icon={Info}
      />

      {/* Hero Banner */}
      <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-8 md:p-12 text-white shadow-xl'>
        <div className='relative z-10 max-w-3xl space-y-4'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md'>
            <Sparkles className='h-4 w-4 text-amber-300' />
            <span>Academic Platform Version 2.0</span>
          </div>
          <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight'>
            Transforming Project Management for Modern Higher Education
          </h1>
          <p className='text-indigo-100 text-sm md:text-base leading-relaxed'>
            Student Project System bridges students, guides, and departmental
            committees into a single, unified digital workflow. From proposal
            submissions to final evaluation rubrics, every milestone is tracked
            with transparency.
          </p>
          <div className='pt-2 flex flex-wrap gap-4'>
            <button
              onClick={handleExploreDashboard}
              className='inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-all shadow-md'
            >
              <span>Explore Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Core Mission & Vision */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm'>
          <div className='h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400'>
            <Target size={24} />
          </div>
          <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
            Our Mission
          </h3>
          <p className='text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
            To provide higher education institutions with intuitive software
            tools that standardize project workflows, reduce administrative
            overhead, and promote student accountability.
          </p>
        </div>

        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm'>
          <div className='h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400'>
            <Users size={24} />
          </div>
          <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
            Role-Based Access
          </h3>
          <p className='text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
            Tailored interfaces for Administrators, Faculty Guides, and Student
            Team Leaders ensure every stakeholder gets pertinent metrics and
            controls without clutter.
          </p>
        </div>

        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm'>
          <div className='h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400'>
            <Shield size={24} />
          </div>
          <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
            Security & Audit
          </h3>
          <p className='text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
            Institutional security compliance with automated role enforcement,
            activity logs, and real-time validation checks across all project
            operations.
          </p>
        </div>
      </div>

      {/* Key Highlights */}
      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-6'>
        <h2 className='text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2'>
          <Award className='text-indigo-500' size={20} />
          <span>Why Institutions Choose Us</span>
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {[
            'Real-Time Milestone Tracking',
            'Faculty Allocation Engine',
            'Dynamic Department & Category Mapping',
            'Automated Evaluation Rubrics',
            'Interactive Resource Repository',
            'Instant Notifications & Alerts',
          ].map((item) => (
            <div
              key={item}
              className='flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800'
            >
              <CheckCircle2
                size={18}
                className='text-emerald-500 flex-shrink-0'
              />
              <span className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
