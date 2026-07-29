import React, { useState } from 'react';
import { BookOpen, FileText, Layers, ShieldCheck, Search, ChevronRight, Terminal, UserCheck } from 'lucide-react';
import PageHeader from '../../common/PageHeader';

const DOC_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    content: (
      <div className='space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300'>
        <h3 className='text-base font-bold text-slate-900 dark:text-white'>System Overview</h3>
        <p>
          Student Project System is a centralized portal for managing academic projects, team allocations, project proposals, milestone evaluation, and faculty feedback.
        </p>
        <div className='p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 space-y-2'>
          <h4 className='font-bold text-indigo-900 dark:text-indigo-300 text-xs'>Quick Onboarding Steps</h4>
          <ol className='list-decimal list-inside space-y-1 text-xs text-indigo-800 dark:text-indigo-200'>
            <li>Log in using your institutionally assigned credentials.</li>
            <li>Navigate to <strong>My Profile</strong> to verify department and contact information.</li>
            <li>Go to <strong>Projects</strong> to view assigned projects or submit new proposals.</li>
            <li>Track timeline deadlines and meetings directly from your <strong>Dashboard</strong>.</li>
          </ol>
        </div>
      </div>
    ),
  },
  {
    id: 'role-capabilities',
    title: 'Role Capabilities (RBAC)',
    icon: UserCheck,
    content: (
      <div className='space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300'>
        <h3 className='text-base font-bold text-slate-900 dark:text-white'>Role-Based Access Controls</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2'>
            <span className='px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold text-[10px] uppercase'>Admin</span>
            <p className='text-xs font-semibold text-slate-800 dark:text-white'>Full Management Access</p>
            <ul className='list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1'>
              <li>User management & role assignments</li>
              <li>Project approvals & archiving</li>
              <li>System settings & audit logs</li>
            </ul>
          </div>

          <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2'>
            <span className='px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase'>Faculty</span>
            <p className='text-xs font-semibold text-slate-800 dark:text-white'>Guide & Evaluation Access</p>
            <ul className='list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1'>
              <li>View assigned student projects</li>
              <li>Schedule & conduct project reviews</li>
              <li>Grade milestones & give feedback</li>
            </ul>
          </div>

          <div className='p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2'>
            <span className='px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase'>Student</span>
            <p className='text-xs font-semibold text-slate-800 dark:text-white'>Project Execution Access</p>
            <ul className='list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1'>
              <li>Submit project proposals</li>
              <li>View team & guide details</li>
              <li>Upload milestone deliverables</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'project-proposal',
    title: 'Project Proposal Workflow',
    icon: Layers,
    content: (
      <div className='space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300'>
        <h3 className='text-base font-bold text-slate-900 dark:text-white'>Proposal Submission Guidelines</h3>
        <p>
          Students can create new proposals by selecting their department, domain category, project type, semester, and faculty guide.
        </p>
        <div className='p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2'>
          <h4 className='font-bold text-slate-900 dark:text-white text-xs'>Cascading Field Dependencies</h4>
          <p className='text-xs text-slate-600 dark:text-slate-400'>
            Selecting a Department automatically filters available Domain Categories. Selecting a Domain Category restricts available Project Types to relevant options stored in MongoDB.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'api-reference',
    title: 'API & Security Standards',
    icon: Terminal,
    content: (
      <div className='space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300'>
        <h3 className='text-base font-bold text-slate-900 dark:text-white'>RESTful API Architecture</h3>
        <p>
          All API requests require Bearer JWT tokens in the <code>Authorization</code> header. Requests are validated using Mongoose schemas and strict Express role middleware.
        </p>
      </div>
    ),
  },
];

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = DOC_SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSection = DOC_SECTIONS.find((s) => s.id === activeTab) || DOC_SECTIONS[0];

  return (
    <div className='space-y-8 animate-fade-in pt-0 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <PageHeader
        title='System Documentation'
        subtitle='Comprehensive guides, architecture overviews, and operational instructions.'
        icon={BookOpen}
      />

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        {/* Sidebar Navigation */}
        <div className='space-y-4 lg:col-span-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search docs...'
              className='w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 space-y-1 shadow-sm'>
            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = sec.id === activeTab;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className='flex items-center gap-2.5'>
                    <Icon size={16} />
                    <span>{sec.title}</span>
                  </div>
                  <ChevronRight size={14} className={isActive ? 'opacity-100' : 'opacity-40'} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className='lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-6'>
          <div className='flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4'>
            <div className='p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'>
              <currentSection.icon size={24} />
            </div>
            <div>
              <h2 className='text-xl font-bold text-slate-900 dark:text-white'>{currentSection.title}</h2>
              <p className='text-xs text-slate-500 dark:text-slate-400'>Official System Reference Guide</p>
            </div>
          </div>

          {currentSection.content}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
