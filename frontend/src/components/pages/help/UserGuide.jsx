import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const UserGuide = memo(() => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await api.get('/help/guide');
        if (response.success && response.data) {
          setChapters(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user guide', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, []);

  const [activeChapter, setActiveChapter] = useState(1);

  const handleChapterChange = useCallback((chapterId) => {
    setActiveChapter(chapterId);
  }, []);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => navigate('/help')}
            className='mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            ← Back to Help Center
          </button>
          <div className='mb-8 text-center'>
            <h1 className='mb-4 text-3xl font-bold text-slate-900 dark:text-white'>
              User Guide
            </h1>
            <p className='mx-auto max-w-2xl text-slate-600 dark:text-slate-400'>
              Complete user manual and documentation for the Project Management
              System
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {/* Chapters Navigation */}
          <div className='lg:col-span-1'>
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Chapters
              </h3>
              <div className='space-y-2'>
                {loading ? (
                  <div className='text-sm text-slate-500'>
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
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
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
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
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
                        className='rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                        disabled={activeChapter === 1}
                      >
                        ← Previous Chapter
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
                        Next Chapter →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

UserGuide.displayName = 'UserGuide';

export default UserGuide;
