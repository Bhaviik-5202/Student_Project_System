import React from 'react';
import { FileText, Scale, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../common/PageHeader';

const TermsAndConditions = () => {
  return (
    <div className='space-y-8 animate-fade-in pt-0 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <PageHeader
        title='Terms of Service & Conditions'
        subtitle='Terms governing institutional system usage, academic integrity, and acceptable user conduct.'
        icon={Scale}
      />

      <div className='rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-6 text-xs leading-relaxed text-slate-700 dark:text-slate-300 shadow-sm'>
        <div className='space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>1. Institutional Terms</h2>
          <p>
            By accessing or using Student Project System, users agree to strictly follow institutional regulations, role privileges, and academic honor codes.
          </p>
        </div>

        <div className='space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>2. Academic Integrity & Originality</h2>
          <p>
            All submitted project proposals, code repositories, documentations, and milestone deliverables must represent original student work or properly cited collaborative references. Plagiarism or misrepresentation will result in disciplinary action under institutional guidelines.
          </p>
        </div>

        <div className='space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>3. User Account Responsibilities</h2>
          <p>
            Users are responsible for keeping account access credentials confidential. Any unauthorized access under your account must be reported to the platform administrator immediately.
          </p>
        </div>

        <div className='space-y-2'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>4. Intellectual Property</h2>
          <p>
            Project deliverables created by students remain the property of the respective student authors and institution subject to institutional project agreements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
