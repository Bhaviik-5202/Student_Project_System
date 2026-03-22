import { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const ProgressAnalytics = memo(() => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/analytics/progress');
        setProjects(response.data || []);
      } catch (error) {
        console.error('Failed to fetch progress analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  return (
    <div className='animate-fade-in space-y-6 p-4 md:p-6'>
      <div className='flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
            Progress Analytics
          </h1>
          <p className='mt-1 text-sm font-medium text-gray-500 dark:text-gray-400'>
            Monitor project progress and completion rates
          </p>
        </div>
      </div>

      <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Summary Stats */}
        <div className='lg:col-span-1'>
          <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
              Progress Summary
            </h3>
            <div className='space-y-6'>
              <div>
                <div className='mb-2 text-sm text-slate-600 dark:text-slate-400'>
                  Average Progress
                </div>
                <div className='flex items-center'>
                  <div className='mr-3 text-3xl font-bold text-slate-900 dark:text-white'>
                    {projects.length > 0
                      ? Math.round(
                          projects.reduce(
                            (sum, p) => sum + (p.progress || 0),
                            0
                          ) / projects.length
                        )
                      : 0}
                    %
                  </div>
                  <div className='flex items-center text-sm text-emerald-600 dark:text-emerald-400'>
                    <span>↑ 5.2%</span>
                  </div>
                </div>
              </div>

              <div>
                <div className='mb-2 text-sm text-slate-600 dark:text-slate-400'>
                  Projects by Status
                </div>
                <div className='space-y-2'>
                  {[
                    {
                      label: 'On Track',
                      count: projects.filter((p) => p.timeline === 'On Track')
                        .length,
                      color: 'bg-emerald-500',
                    },
                    {
                      label: 'Slightly Behind',
                      count: projects.filter(
                        (p) => p.timeline === 'Slightly Behind'
                      ).length,
                      color: 'bg-amber-500',
                    },
                    {
                      label: 'Behind Schedule',
                      count: projects.filter(
                        (p) => p.timeline === 'Behind Schedule'
                      ).length,
                      color: 'bg-rose-500',
                    },
                    {
                      label: 'Ahead',
                      count: projects.filter((p) => p.timeline === 'Ahead')
                        .length,
                      color: 'bg-blue-500',
                    },
                  ].map((status, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center'>
                        <div
                          className={`h-3 w-3 rounded-full ${status.color} mr-2`}
                        ></div>
                        <span className='text-sm text-slate-700 dark:text-slate-300'>
                          {status.label}
                        </span>
                      </div>
                      <span className='font-medium text-slate-900 dark:text-white'>
                        {status.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Details */}
        <div className='lg:col-span-2'>
          <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
              Project Progress Details
            </h3>
            <div className='space-y-4'>
              {loading ? (
                <div className='py-4 text-center text-slate-500'>
                  Loading project progress...
                </div>
              ) : projects.length === 0 ? (
                <div className='py-4 text-center text-slate-500'>
                  No project progress data found.
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id || project._id}
                    className='rounded-lg border border-slate-200 p-4 dark:border-slate-700'
                  >
                    <div className='mb-3 flex items-start justify-between'>
                      <div>
                        <div className='font-medium text-slate-900 dark:text-white'>
                          {project.name || project.title}
                        </div>
                        <div className='text-sm text-slate-600 dark:text-slate-400'>
                          Team Size: {project.teamSize || 0} members
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          project.timeline === 'On Track'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : project.timeline === 'Ahead'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : project.timeline === 'Slightly Behind'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                        }`}
                      >
                        {project.timeline || 'Unknown'}
                      </span>
                    </div>

                    <div className='mb-2'>
                      <div className='mb-1 flex justify-between text-sm text-slate-600 dark:text-slate-400'>
                        <span>Progress</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <div className='h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
                        <div
                          className={`h-3 rounded-full ${
                            (project.progress || 0) >= 80
                              ? 'bg-emerald-500'
                              : (project.progress || 0) >= 60
                                ? 'bg-blue-500'
                                : (project.progress || 0) >= 40
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                          }`}
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <button
                        onClick={() =>
                          navigate(`/projects/${project.id || project._id}`)
                        }
                        className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                      >
                        View Details
                      </button>
                      <button className='text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'>
                        View Team
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProgressAnalytics.displayName = 'ProgressAnalytics';

export default ProgressAnalytics;
