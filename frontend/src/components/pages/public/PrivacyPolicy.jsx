import React from 'react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../common/PageHeader';

const PrivacyPolicy = () => {
  return (
    <div className='space-y-8 animate-fade-in pt-0 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <PageHeader
        title='Privacy Policy'
        subtitle='How we collect, protect, and manage academic user data and records.'
        icon={Shield}
      />

      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-6 text-xs leading-relaxed text-slate-700 dark:text-slate-300 shadow-sm'>
        <div className='space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>1. Institutional Data Privacy Commitment</h2>
          <p>
            Student Project System is committed to safeguarding the privacy and integrity of student records, project deliverables, and faculty evaluation metrics in accordance with educational data protection standards.
          </p>
        </div>

        <div className='space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>2. Information Collected</h2>
          <ul className='list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400'>
            <li>Personal Identifiers: Full Name, Institutional Email, Phone Number.</li>
            <li>Academic Profiles: Department, Academic Year, Enrolled Courses, Role Assignments.</li>
            <li>Project Artifacts: Proposal Descriptions, Uploaded Resource Documents, GitHub Repository URLs.</li>
          </ul>
        </div>

        <div className='space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>3. How Information is Used</h2>
          <p>
            Data collected is exclusively utilized for academic governance, project tracking, faculty allocation, evaluation rubrics generation, and system communications.
          </p>
        </div>

        <div className='space-y-2'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>4. Data Protection & Security</h2>
          <p>
            All user credentials and sensitive records are protected with industry-standard encryption, tokenized authentication, and strict Role-Based Access Control (RBAC).
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
