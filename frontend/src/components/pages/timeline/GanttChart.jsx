import { useState, useEffect, useMemo, memo } from 'react';
import timelineService from '../../../services/timelineService';

const GanttChart = memo(() => {
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGanttData = async () => {
      try {
        const response = await timelineService.getAll();
        if (response.success) {
          const mappedData = response.data.map((t) => {
            const total = t.milestones?.length || 0;
            const completed =
              t.milestones?.filter((m) => m.completed).length || 0;

            const dates =
              t.milestones
                ?.map((m) => new Date(m.dueDate).getTime())
                .filter((d) => !isNaN(d)) || [];
            const start =
              dates.length > 0
                ? new Date(Math.min(...dates)).toLocaleDateString()
                : new Date(t.createdAt).toLocaleDateString();
            const end =
              dates.length > 0
                ? new Date(Math.max(...dates)).toLocaleDateString()
                : new Date(t.updatedAt).toLocaleDateString();

            return {
              id: t._id,
              name: t.project?.title || 'Unknown Project',
              start: start,
              end: end,
              progress: total > 0 ? Math.round((completed / total) * 100) : 0,
              milestones: (t.milestones || []).map((m) => ({
                name: m.title,
                status: m.completed ? 'completed' : 'pending',
                date: m.dueDate
                  ? new Date(m.dueDate).toLocaleDateString()
                  : 'TBD',
              })),
            };
          });
          setTimelines(mappedData);
        }
      } catch (error) {
        console.error('Failed to fetch Gantt data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGanttData();
  }, []);

  const months = useMemo(
    () => [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    []
  );
  const gridLines = useMemo(() => Array.from({ length: 120 }), []);

  const statusStyles = {
    completed: {
      dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
      badge:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    },
    'in-progress': {
      dot: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]',
      badge:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
    },
    pending: {
      dot: 'bg-slate-300 dark:bg-slate-600',
      badge:
        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    },
  };

  return (
    <div className='min-h-screen bg-slate-50 font-sans dark:bg-slate-900'>
      <div className='container mx-auto max-w-7xl px-4 py-8'>
        <div className='animate-in fade-in slide-in-from-top-4 mb-10 flex flex-col items-start justify-between gap-6 duration-700 md:flex-row md:items-center'>
          <div>
            <div className='mb-2 flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none'>
                <svg
                  className='h-4 w-4 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h1 className='text-3xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white'>
                Strategic Scheduler
              </h1>
            </div>
            <p className='pl-11 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400'>
              Visualize professional project trajectories
            </p>
          </div>
          <button className='rounded-xl bg-gray-900 px-6 py-3 text-[10px] font-black uppercase leading-none tracking-[0.2em] text-white shadow-xl transition-all hover:scale-105 hover:bg-black active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-700'>
            Add New Venture
          </button>
        </div>

        {/* Gantt Visualization */}
        <div className='animate-in fade-in zoom-in mb-12 overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm duration-1000 dark:border-slate-700 dark:bg-slate-800'>
          <div className='overflow-x-auto'>
            <div className='min-w-[1000px] p-8'>
              {/* Timeline Header */}
              <div className='relative mb-10 flex'>
                <div className='w-64 flex-shrink-0'>
                  <span className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
                    Project Registry
                  </span>
                </div>
                <div className='flex-1'>
                  <div className='mb-4 flex justify-between border-b border-gray-50 pb-4 dark:border-slate-700/50'>
                    {months.map((month, index) => (
                      <div
                        key={index}
                        className='text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500'
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                  <div className='relative flex h-4'>
                    {gridLines.map((_, i) => (
                      <div
                        key={i}
                        className='h-full w-full border-r border-gray-100 dark:border-slate-700/50'
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Projects List */}
              {loading ? (
                <div className='flex flex-col items-center py-20 text-center'>
                  <div className='mb-4 h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent'></div>
                  <span className='text-[10px] font-black uppercase tracking-widest text-gray-400'>
                    Compiling Visuals...
                  </span>
                </div>
              ) : timelines.length === 0 ? (
                <div className='py-20 text-center'>
                  <h3 className='mb-2 text-lg font-black uppercase italic tracking-tight text-slate-900 dark:text-white'>
                    No Active Trajectories
                  </h3>
                  <p className='text-xs font-bold uppercase tracking-widest text-slate-400'>
                    Initialize project timelines to begin strategic mapping.
                  </p>
                </div>
              ) : (
                <div className='space-y-12'>
                  {timelines.map((project) => (
                    <div key={project.id} className='group relative'>
                      <div className='flex items-center'>
                        <div className='w-64 flex-shrink-0 pr-10'>
                          <h3 className='mb-2 truncate text-lg font-black leading-none tracking-tighter text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white'>
                            {project.name}
                          </h3>
                          <div className='flex items-center gap-2'>
                            <span className='rounded bg-gray-50 px-2 py-0.5 text-[10px] font-bold uppercase leading-none tracking-widest text-slate-400 dark:bg-slate-900'>
                              {project.start} — {project.end}
                            </span>
                          </div>
                        </div>

                        <div className='relative flex-1 py-4'>
                          {/* Grid Background Overlay */}
                          <div className='absolute inset-0 flex'>
                            {Array.from({ length: 12 }).map((_, i) => (
                              <div
                                key={i}
                                className='h-full flex-1 border-r border-gray-50 dark:border-slate-700/30'
                              ></div>
                            ))}
                          </div>

                          {/* Progress Track */}
                          <div className='relative flex h-12 items-center'>
                            <div className='absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-gray-100 shadow-inner dark:bg-slate-700'>
                              <div
                                className='h-full bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.4)] transition-all duration-1000 ease-out'
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>

                            {/* Milestone Marker Pins */}
                            <div className='absolute inset-x-0 bottom-0 top-0 flex'>
                              {project.milestones.map((milestone, idx) => (
                                <div
                                  key={idx}
                                  className='group/pin absolute top-1/2 -translate-y-1/2 transform'
                                  style={{
                                    left: `${Math.max(5, Math.min(95, (idx + 1) * (100 / (project.milestones.length + 1))))}%`,
                                  }}
                                >
                                  <div className='flex flex-col items-center'>
                                    <div
                                      className={`z-10 h-4 w-4 scale-75 rounded-full border-4 border-white shadow-md transition-all duration-500 group-hover/pin:scale-125 dark:border-slate-800 ${
                                        statusStyles[milestone.status]?.dot ||
                                        statusStyles.pending.dot
                                      }`}
                                    ></div>
                                    <div className='absolute top-6 translate-y-2 transform whitespace-nowrap opacity-0 transition-all duration-300 group-hover/pin:translate-y-0 group-hover/pin:opacity-100'>
                                      <div className='rounded-lg bg-gray-900 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-xl'>
                                        {milestone.name} • {milestone.date}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className='w-24 flex-shrink-0 pl-6 text-right'>
                          <div className='flex flex-col items-end'>
                            <span className='font-mono text-xl font-black tabular-nums leading-none tracking-tighter text-indigo-600 dark:text-indigo-400'>
                              {project.progress}%
                            </span>
                            <span className='mt-1 text-[8px] font-black uppercase tracking-widest text-gray-300'>
                              Completion
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details on Hover */}
                      <div className='mt-4 translate-y-2 border-t border-gray-50 pt-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 dark:border-slate-700/50'>
                        <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5'>
                          {project.milestones.map((m, i) => (
                            <div
                              key={i}
                              className='rounded-2xl border border-gray-100 bg-gray-50/50 p-3 dark:border-slate-700/50 dark:bg-slate-900/40'
                            >
                              <div className='mb-2 flex items-center gap-2'>
                                <div
                                  className={`h-1.5 w-1.5 rounded-full ${statusStyles[m.status]?.dot || 'bg-slate-300'}`}
                                ></div>
                                <span className='truncate text-[9px] font-black uppercase tracking-tight text-gray-900 dark:text-white'>
                                  {m.name}
                                </span>
                              </div>
                              <div className='text-[8px] font-bold uppercase tracking-widest text-gray-400'>
                                Delivery: {m.date}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Aesthetic Overlay */}
          <div className='h-2 w-full bg-indigo-600/5'></div>
        </div>

        {/* Legend Section */}
        <div className='flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:flex-row'>
          <div className='flex flex-col'>
            <h4 className='mb-1 text-xs font-black uppercase leading-none tracking-[0.2em] text-slate-900 dark:text-white'>
              Chronological Legend
            </h4>
            <p className='text-[10px] font-bold text-slate-400'>
              Mapping the evolution of active ventures
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-10'>
            <div className='flex items-center gap-3'>
              <div className='h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30'></div>
              <span className='text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                Finalized
              </span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='h-3 w-3 animate-pulse rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/30'></div>
              <span className='text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                Active Velocity
              </span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600'></div>
              <span className='text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                Pipeline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

GanttChart.displayName = 'GanttChart';

export default GanttChart;
