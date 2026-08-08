import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  ArrowLeft,
  ArrowRight,
  FileText,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';

const DEFAULT_CHAPTERS = [
  {
    id: 1,
    title: '1. Login & Authentication',
    sections: [
      {
        title: 'Account Authentication & OTP Verification',
        content:
          'Access the system by selecting your assigned role (Student, Faculty, or Admin) on the Login screen. Enter your institutional email address and password. First-time registrations generate a 6-digit One-Time Password (OTP) sent to your inbox to activate your credentials.',
      },
    ],
  },
  {
    id: 2,
    title: '2. Role-Based Dashboards',
    sections: [
      {
        title: 'Personalized Workspace Dashboards',
        content:
          'The system renders customized dashboards based on user permissions: Admin Dashboard provides system oversight, user management, and global reports. Faculty Dashboard displays guided projects, review queues, and sync meetings. Student Dashboard tracks assigned projects, guide updates, upcoming deadlines, and notifications.',
      },
    ],
  },
  {
    id: 3,
    title: '3. Project Management',
    sections: [
      {
        title: 'Submitting & Editing Project Proposals',
        content:
          'Students create proposals under Projects -> New Proposal. Select project category (Web, Mobile, AI/ML, Cyber Security, etc.), classification (Major Project, Minor Project, UDP, IDP, Academic), assign active student teammates, and choose a Faculty Guide.',
      },
    ],
  },
  {
    id: 4,
    title: '4. Faculty Guide Allocation',
    sections: [
      {
        title: 'Guide Assignment & Workload Distribution',
        content:
          'Faculty members guide up to 5 project groups. Department heads and administrators can allocate or reassign faculty guides dynamically via the Guide Allocation tool.',
      },
    ],
  },
  {
    id: 5,
    title: '5. Meeting Management',
    sections: [
      {
        title: 'Review Meetings & Event Synchronization',
        content:
          'Faculty guides and admins schedule evaluation meetings. Scheduled meetings appear live across Student, Faculty, and Admin dashboards without requiring manual page refreshes.',
      },
    ],
  },
  {
    id: 6,
    title: '6. Resource Management',
    sections: [
      {
        title: 'Document Library, Preview & Downloads',
        content:
          'Access project guidelines, SRS templates, evaluation rubrics, and video tutorials under Resources. Authenticated users can preview documents in-browser or download attachments directly.',
      },
    ],
  },
  {
    id: 7,
    title: '7. Reports & Export Capabilities',
    sections: [
      {
        title: 'Dynamic Analytics & Multi-Format Exports',
        content:
          'Generate dynamic database reports on project status distribution, guide workloads, and student progress. Export reports to PDF, Excel, or CSV formats with single-click actions.',
      },
    ],
  },
  {
    id: 8,
    title: '8. Notifications & Real-Time Alerts',
    sections: [
      {
        title: 'System Activity Alerts',
        content:
          'Receive instant notifications for project status updates, meeting invitations, guide assignments, and milestone deadlines through the top navigation alert bell.',
      },
    ],
  },
  {
    id: 9,
    title: '9. Profile & Settings Management',
    sections: [
      {
        title: 'Account Customization & Security',
        content:
          'Update your contact details, profile picture, department information, and change password securely in Profile Settings.',
      },
    ],
  },
  {
    id: 10,
    title: '10. Troubleshooting & Support',
    sections: [
      {
        title: 'Common Issues & Help Contact',
        content:
          'If you encounter login errors or document download issues, check your internet connectivity or request a new OTP code. Contact institutional IT support at support@sps-univ.edu for assistance.',
      },
    ],
  },
];

const UserGuide = memo(() => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState(DEFAULT_CHAPTERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await api.get('/help/guide');
        if (
          response.success &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setChapters(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user guide', error);
      }
    };
    fetchGuide();
  }, []);

  const [activeChapter, setActiveChapter] = useState(1);

  const handleChapterChange = useCallback((chapterId) => {
    setActiveChapter(chapterId);
  }, []);

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='System User Guide'
        subtitle='Complete user manual and technical documentation for the Student Project Management System'
        icon={FileText}
      />

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
        {/* Chapters Navigation */}
        <div className='lg:col-span-1'>
          <div className='rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
              Chapters
            </h3>
            <div className='space-y-2'>
              {loading ? (
                <div className='text-sm text-slate-500 dark:text-slate-400'>
                  Loading chapters...
                </div>
              ) : (
                chapters.map((chapter, idx) => (
                  <button
                    key={chapter.id || chapter._id || idx}
                    onClick={() => handleChapterChange(chapter.id || idx + 1)}
                    className={`w-full rounded-lg p-3 text-left transition-colors ${
                      activeChapter === (chapter.id || idx + 1)
                        ? 'border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className='font-medium'>{chapter.title}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chapter Content */}
        <div className='lg:col-span-3'>
          <div className='rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'>
            {chapters.find(
              (ch, idx) => (ch.id || idx + 1) === activeChapter
            ) && (
              <>
                <h2 className='mb-6 text-2xl font-bold text-slate-900 dark:text-white'>
                  {
                    chapters.find(
                      (ch, idx) => (ch.id || idx + 1) === activeChapter
                    )?.title
                  }
                </h2>

                <div className='prose max-w-none space-y-6'>
                  {chapters
                    .find((ch, idx) => (ch.id || idx + 1) === activeChapter)
                    ?.sections?.map((section, idx) => (
                      <div key={idx}>
                        <h3 className='mb-3 text-xl font-semibold text-slate-900 dark:text-white'>
                          {section.title || section}
                        </h3>
                        {section.content && (
                          <div
                            className='text-slate-700 dark:text-slate-300'
                            dangerouslySetInnerHTML={{
                              __html: section.content,
                            }}
                          />
                        )}
                        {!section.content && section.body && (
                          <p className='text-slate-700 dark:text-slate-300'>
                            {section.body}
                          </p>
                        )}
                      </div>
                    ))}
                </div>

                <div className='mt-8 border-t border-slate-200 pt-6 dark:border-slate-700'>
                  <div className='flex justify-between'>
                    <button
                      onClick={() =>
                        handleChapterChange(Math.max(1, activeChapter - 1))
                      }
                      className='rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                      disabled={activeChapter === 1}
                    >
                      <ArrowLeft className='mr-2 inline' size={16} /> Previous
                      Chapter
                    </button>
                    <button
                      onClick={() =>
                        handleChapterChange(
                          Math.min(chapters.length, activeChapter + 1)
                        )
                      }
                      className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                      disabled={activeChapter === chapters.length}
                    >
                      Next Chapter{' '}
                      <ArrowRight className='ml-2 inline' size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

UserGuide.displayName = 'UserGuide';

export default UserGuide;
