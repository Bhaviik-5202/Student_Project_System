import { useCallback, useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Plus } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import timelineService from '../../../services/timelineService';
import { useAuth } from '../../../hooks/useAuth';

const ProjectTimeline = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimelines = async () => {
      try {
        const response = await timelineService.getAll();
        if (response.success) {
          const mappedProjects = response.data.map((t) => {
            const total = t.milestones?.length || 0;
            const completed =
              t.milestones?.filter((m) => m.completed).length || 0;

            // Get earliest and latest dates from milestones
            const dates =
              t.milestones
                ?.map((m) => new Date(m.dueDate).getTime())
                .filter((d) => !isNaN(d)) || [];
            const start =
              dates.length > 0
                ? new Date(Math.min(...dates))
                : new Date(t.createdAt);
            const end =
              dates.length > 0
                ? new Date(Math.max(...dates))
                : new Date(t.updatedAt);

            return {
              id: t._id,
              projectId: t.project?._id,
              projectSlug: t.project?.slug,
              name: t.project?.title || 'Unknown Project',
              progress: total > 0 ? Math.round((completed / total) * 100) : 0,
              start: start,
              end: end,
            };
          });
          setProjects(mappedProjects);
        }
      } catch (error) {
        console.error('Failed to fetch timeline projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimelines();
  }, []);

  const months = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], []);

  return (
    <div className='project-page animate-fade-in text-gray-600 dark:text-gray-400'>
      <PageHeader
        title='Project Timelines'
        subtitle='Orchestration of active academic ventures and milestone schedules'
        icon={Clock}
        badge={`${projects.length} Active Timelines`}
        actions={
          user?.role === 'admin' && (
            <button
              onClick={() => navigate('/projects/new')}
              className='flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'
            >
              <Plus size={16} />
              New Project
            </button>
          )
        }
      />
      <br />
      {loading ? (
        <div className='p-20 text-center text-sm italic text-gray-400'>
          Synchronizing roadmap...
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Timeline Visualization Card */}
          <div className='project-card-simple overflow-hidden'>
            <h3 className='mb-8 text-[10px] font-bold text-gray-400'>
              Temporal Overview
            </h3>

            <div className='relative'>
              {/* Grid Headers */}
              <div className='mb-4 flex'>
                <div className='w-1/4'></div>
                <div className='flex flex-1 justify-between px-2'>
                  {months.map((month) => (
                    <span
                      key={month}
                      className='text-[10px] font-bold text-gray-300'
                    >
                      {month}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Tracks */}
              <div className='space-y-6'>
                {projects.map((project) => {
                  const startMonth = new Date(project.start).getMonth();
                  const endMonth = new Date(project.end).getMonth();
                  const duration = Math.max(1, endMonth - startMonth + 1);

                  return (
                    <div
                      key={project.id || project._id}
                      className='flex items-center gap-4'
                    >
                      <div className='w-1/4'>
                        <div
                          className='truncate text-xs font-bold text-gray-900 dark:text-white'
                          title={project.name}
                        >
                          {project.name}
                        </div>
                        <div className='mt-1 text-[10px] text-gray-500 dark:text-gray-400'>
                          {project.progress}% Complete
                        </div>
                      </div>
                      <div className='relative h-6 flex-1 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-slate-800 dark:bg-slate-900'>
                        <div
                          className='absolute inset-y-0 border-x border-indigo-500/20 bg-indigo-500/10'
                          style={{
                            left: `${(startMonth / 6) * 100}%`,
                            width: `${(duration / 6) * 100}%`,
                          }}
                        >
                          <div
                            className='h-full bg-indigo-500 transition-all duration-1000'
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Project Details List */}
          <div className='project-card-simple overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='hidden w-full text-left md:table'>
                <thead>
                  <tr className='border-b border-gray-100 bg-gray-50 dark:bg-gray-800/50 dark:border-slate-700 dark:bg-slate-900/40'>
                    <th className='px-6 py-4 text-[10px] font-bold text-gray-400'>
                      Venture
                    </th>
                    <th className='px-6 py-4 text-[10px] font-bold text-gray-400'>
                      Schedule
                    </th>
                    <th className='px-6 py-4 text-[10px] font-bold text-gray-400'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-right text-[10px] font-bold text-gray-400'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-50 dark:divide-slate-700/50'>
                  {projects.map((project) => (
                    <tr
                      key={project.id || project._id}
                      className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-slate-800/30'
                    >
                      <td className='px-6 py-4'>
                        <span className='text-xs font-bold text-gray-900 dark:text-white'>
                          {project.name}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-[10px] font-bold text-gray-500 dark:text-gray-400'>
                          {new Date(project.start).toLocaleDateString()} —{' '}
                          {new Date(project.end).toLocaleDateString()}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <div className='h-1 w-16 flex-1 rounded-full bg-gray-100 dark:bg-slate-900'>
                            <div
                              className='h-full rounded-full bg-emerald-500'
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className='text-[10px] font-bold text-emerald-600'>
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <button
                          onClick={() =>
                            navigate(
                              `/projects/${project.projectSlug || project.projectId}`
                            )
                          }
                          className='text-[10px] font-bold text-indigo-600'
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile View */}
              <div className='block md:hidden divide-y divide-gray-50 dark:divide-slate-700/50'>
                {projects.map((project) => (
                  <div key={project.id || project._id} className='p-4 space-y-3 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/30'>
                    <div className='flex items-start justify-between'>
                      <div className='space-y-1'>
                        <div className='text-xs font-bold text-gray-900 dark:text-white'>
                          {project.name}
                        </div>
                        <div className='text-[10px] font-bold text-gray-500 dark:text-gray-400'>
                          {new Date(project.start).toLocaleDateString()} —{' '}
                          {new Date(project.end).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigate(
                            `/projects/${project.projectSlug || project.projectId}`
                          )
                        }
                        className='text-[10px] font-bold text-indigo-600 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5'
                      >
                        Review
                      </button>
                    </div>
                    <div className='flex items-center gap-2 pt-1'>
                      <div className='h-1.5 flex-1 rounded-full bg-gray-100 dark:bg-slate-900 overflow-hidden'>
                        <div
                          className='h-full rounded-full bg-emerald-500'
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className='text-[10px] font-bold text-emerald-600'>
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ProjectTimeline.displayName = 'ProjectTimeline';
export default ProjectTimeline;
