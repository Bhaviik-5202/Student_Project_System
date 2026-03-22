import { useCallback, useState, useEffect, useMemo, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import timelineService from '../../../services/timelineService';
import projectService from '../../../services/projectService';

const SprintPlanner = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(id || '');
  const [sprints, setSprints] = useState([]);
  const [activeSprintId, setActiveSprintId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all projects for the selector
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        if (response.success) {
          setProjects(response.data);
          if (!selectedProjectId && response.data.length > 0) {
            setSelectedProjectId(response.data[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };
    fetchProjects();
  }, [selectedProjectId]);

  // Fetch timeline and map milestones to sprints
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const response = await timelineService.getByProject(selectedProjectId);
        if (response.success && response.data.length > 0) {
          const timeline = response.data[0];
          const mappedSprints = (timeline.milestones || []).map((m, index) => ({
            id: m._id || m.id,
            name: `Sprint ${index + 1}: ${m.title}`,
            start:
              index === 0
                ? new Date(timeline.createdAt).toLocaleDateString()
                : new Date(
                    timeline.milestones[index - 1].dueDate
                  ).toLocaleDateString(),
            end: new Date(m.dueDate).toLocaleDateString(),
            status: m.completed
              ? 'completed'
              : index === 0 && !m.completed
                ? 'in-progress'
                : 'planned',
            velocity: 0,
            completed: 0,
            tasks: [],
          }));
          setSprints(mappedSprints);
          if (mappedSprints.length > 0) {
            const current =
              mappedSprints.find((s) => s.status === 'in-progress') ||
              mappedSprints[0];
            setActiveSprintId(current.id);
          }
        } else {
          setSprints([]);
          setActiveSprintId(null);
        }
      } catch (error) {
        console.error('Failed to fetch sprints', error);
        setSprints([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [selectedProjectId]);

  const activeSprintData = useMemo(
    () => sprints.find((s) => s.id === activeSprintId),
    [sprints, activeSprintId]
  );

  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
  };

  const sprintStatusStyles = {
    completed:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    'in-progress':
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
    planned:
      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  };

  const taskStatusStyles = {
    completed:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    'in-progress':
      'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    todo: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  };

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const activeProjectTitle = useMemo(() => {
    return (
      projects.find((p) => p._id === selectedProjectId)?.title ||
      'Project Tasks'
    );
  }, [projects, selectedProjectId]);

  return (
    <div className='min-h-screen bg-slate-50 font-sans dark:bg-slate-900'>
      <div className='container mx-auto max-w-6xl px-4 py-8'>
        <div className='animate-in fade-in slide-in-from-top-4 mb-8 duration-700'>
          <button
            onClick={() => handleNavigate('/timeline')}
            className='mb-6 flex items-center text-xs font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200'
          >
            ← Back to Overview
          </button>
          <div className='flex flex-col items-start justify-between gap-6 md:flex-row md:items-center'>
            <div>
              <div className='mb-1 flex items-center gap-3'>
                <h1 className='text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white'>
                  Sprint Planner
                </h1>
                <div className='rounded bg-indigo-600 px-2 py-0.5 text-[9px] font-black leading-none tracking-widest text-white'>
                  Agile
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-bold text-slate-500'>
                  {activeProjectTitle}
                </span>
                <span className='text-slate-300 dark:text-slate-700'>•</span>
                <select
                  value={selectedProjectId}
                  onChange={handleProjectChange}
                  className='cursor-pointer border-none bg-transparent p-0 text-[10px] font-black uppercase tracking-widest text-indigo-600 focus:ring-0 dark:text-indigo-400'
                >
                  <option value='' disabled>
                    Change Project
                  </option>
                  {projects.map((p) => (
                    <option
                      key={p._id}
                      value={p._id}
                      className='bg-white text-slate-900 dark:bg-slate-800 dark:text-white'
                    >
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className='rounded-xl bg-gray-900 px-6 py-3 text-[10px] font-black tracking-[0.2em] text-white shadow-lg transition-all hover:scale-105 hover:bg-black active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-700'>
              Launch New Sprint
            </button>
          </div>
        </div>

        {loading ? (
          <div className='flex flex-col items-center p-20 text-center'>
            <div className='mb-4 h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent'></div>
            <span className='text-xs font-black uppercase tracking-widest text-gray-400'>
              Optimizing Workflow...
            </span>
          </div>
        ) : (
          <div className='animate-in fade-in slide-in-from-bottom-4 mb-8 grid grid-cols-1 gap-8 duration-1000 lg:grid-cols-4'>
            {/* Sprint Navigation */}
            <div className='lg:col-span-1'>
              <div className='rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
                <h3 className='mb-6 flex items-center gap-2 text-xs font-black tracking-[0.2em] text-slate-900 dark:text-white'>
                  <div className='h-2 w-2 rounded-full bg-indigo-600'></div>
                  Iteration Cycles
                </h3>
                <div className='space-y-4'>
                  {sprints.length === 0 ? (
                    <p className='text-[10px] font-bold italic text-slate-400'>
                      No iterations established
                    </p>
                  ) : (
                    sprints.map((sprint) => (
                      <button
                        key={sprint.id}
                        onClick={() => setActiveSprintId(sprint.id)}
                        className={`group relative w-full overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 ${
                          activeSprintId === sprint.id
                            ? 'translate-x-1 bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                            : 'border border-gray-100 bg-gray-50/50 hover:border-indigo-500/50 dark:border-slate-700/50 dark:bg-slate-900/40'
                        }`}
                      >
                        <div
                          className={`mb-2 text-xs font-black tracking-tight ${activeSprintId === sprint.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}
                        >
                          {sprint.name}
                        </div>
                        <div
                          className={`mb-3 text-[9px] font-bold tracking-widest ${activeSprintId === sprint.id ? 'text-indigo-100/70' : 'text-slate-400'}`}
                        >
                          {sprint.start} — {sprint.end}
                        </div>
                        <div className='relative z-10 flex items-center justify-between'>
                          <span
                            className={`rounded px-2 py-0.5 text-[8px] font-black tracking-widest ${
                              activeSprintId === sprint.id
                                ? 'bg-white/20 text-white'
                                : sprintStatusStyles[sprint.status]
                            }`}
                          >
                            {sprint.status.charAt(0).toUpperCase() +
                              sprint.status.slice(1)}
                          </span>
                        </div>
                        {activeSprintId === sprint.id && (
                          <div className='absolute bottom-0 right-0 top-0 w-1 bg-white/30'></div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Iteration Command Center */}
            <div className='lg:col-span-3'>
              {activeSprintData ? (
                <div className='relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
                  <div className='relative z-10'>
                    <div className='mb-10 flex flex-col items-start justify-between gap-6 md:flex-row'>
                      <div>
                        <div className='mb-2 text-[10px] font-black tracking-[0.3em] text-indigo-500'>
                          Cycle Overview
                        </div>
                        <h3 className='text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white'>
                          "{activeSprintData.name}"
                        </h3>
                        <div className='mt-4 flex items-center gap-3'>
                          <div className='flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1 dark:bg-slate-900'>
                            <span className='text-[9px] font-black tracking-widest text-gray-400 dark:text-gray-500'>
                              Timeframe
                            </span>
                            <span className='text-[11px] font-black tabular-nums text-slate-700 dark:text-slate-300'>
                              {activeSprintData.start} — {activeSprintData.end}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`rotate-1 transform rounded-xl px-4 py-1.5 text-[10px] font-black tracking-[0.2em] ${sprintStatusStyles[activeSprintData.status]}`}
                      >
                        {activeSprintData.status}
                      </span>
                    </div>

                    {/* Cycle Velocity Metrics */}
                    <div className='mb-10 grid grid-cols-2 gap-6 md:grid-cols-4'>
                      {[
                        {
                          label: 'Intensity',
                          value: activeSprintData.velocity,
                          color: 'text-slate-900 dark:text-white',
                          sub: 'Total Points',
                        },
                        {
                          label: 'Validated',
                          value: activeSprintData.completed,
                          color: 'text-emerald-500',
                          sub: 'Executed',
                        },
                        {
                          label: 'Pending',
                          value:
                            activeSprintData.velocity -
                            activeSprintData.completed,
                          color: 'text-amber-500',
                          sub: 'Remaining',
                        },
                        {
                          label: 'Density',
                          value: activeSprintData.tasks.length,
                          color: 'text-indigo-600 dark:text-indigo-400',
                          sub: 'Sub-Objectives',
                        },
                      ].map((metric, i) => (
                        <div
                          key={i}
                          className='rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:scale-105 dark:border-slate-700/50 dark:bg-slate-900/40'
                        >
                          <div className='mb-1 text-[9px] font-black tracking-widest text-gray-400'>
                            {metric.label}
                          </div>
                          <div
                            className={`font-mono text-3xl font-black tracking-tighter ${metric.color}`}
                          >
                            {metric.value}
                          </div>
                          <div className='mt-1 text-[8px] font-bold text-gray-300'>
                            {metric.sub}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Visual Fidelity Monitor */}
                    <div className='mb-12 rounded-3xl border border-indigo-50/50 bg-indigo-50/30 p-8 dark:border-slate-700 dark:bg-slate-900/30'>
                      <div className='mb-4 flex items-end justify-between'>
                        <div className='flex flex-col'>
                          <span className='text-[10px] font-black tracking-[0.25em] text-indigo-600 dark:text-indigo-400'>
                            Execution Fidelity
                          </span>
                          <span className='text-[9px] font-bold text-gray-400'>
                            Iterative Progress Synchronization
                          </span>
                        </div>
                        <span className='font-mono text-xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400'>
                          {Math.round(
                            (activeSprintData.completed /
                              activeSprintData.velocity) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className='h-2 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner dark:bg-slate-700'>
                        <div
                          className='h-full bg-indigo-600 shadow-lg transition-all duration-1000 ease-out'
                          style={{
                            width: `${(activeSprintData.completed / activeSprintData.velocity) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Operational Tasks */}
                    <div>
                      <div className='mb-6 flex items-center justify-between'>
                        <h4 className='flex items-center gap-2 text-xs font-black tracking-[0.2em] text-slate-900 dark:text-white'>
                          <div className='h-1.5 w-1.5 rounded-full bg-indigo-600'></div>
                          Sprint Objectives
                        </h4>
                        <button className='text-[9px] font-black tracking-widest text-indigo-600 decoration-2 dark:text-indigo-400'>
                          Manage All
                        </button>
                      </div>
                      <div className='space-y-4'>
                        {activeSprintData.tasks.map((task, index) => (
                          <div
                            key={index}
                            className='group/task flex flex-col items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-500/30 hover:shadow-xl hover:shadow-gray-200/30 dark:border-slate-700/50 dark:bg-slate-900/60 dark:hover:shadow-none sm:flex-row'
                          >
                            <div className='flex flex-1 items-center gap-4'>
                              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-xs font-black text-gray-400 dark:bg-slate-800'>
                                0{index + 1}
                              </div>
                              <div>
                                <div className='mb-2 font-black italic leading-none tracking-tight text-slate-900 dark:text-white'>
                                  "{task.task}"
                                </div>
                                <div className='flex items-center gap-3'>
                                  <span className='text-[9px] font-bold tracking-widest text-slate-400'>
                                    Lead: {task.assignee}
                                  </span>
                                  <div className='h-1 w-1 rounded-full bg-gray-200'></div>
                                  <span className='text-[9px] font-black tracking-widest text-indigo-500/70'>
                                    {task.points} Influence Points
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className='mt-4 flex items-center gap-4 sm:mt-0'>
                              <span
                                className={`rounded-lg px-3 py-1.5 text-[9px] font-black tracking-widest ${taskStatusStyles[task.status]}`}
                              >
                                {task.status.charAt(0).toUpperCase() +
                                  task.status.slice(1)}
                              </span>
                              <button className='flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 transition-all hover:bg-indigo-600 hover:text-white dark:border-slate-700'>
                                <svg
                                  className='h-4 w-4'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visual Accent */}
                  <div className='absolute right-0 top-0 -mr-40 -mt-40 h-80 w-80 rounded-full bg-indigo-600/5 blur-[100px]'></div>
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center rounded-[2.5rem] border border-gray-100 bg-white py-32 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
                  <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-slate-900'>
                    <svg
                      className='h-6 w-6 text-gray-300'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
                      />
                    </svg>
                  </div>
                  <h3 className='mb-2 text-xl font-black tracking-tight text-slate-900 dark:text-white'>
                    Select Cycle
                  </h3>
                  <p className='text-[10px] font-bold tracking-widest text-slate-400'>
                    Synchronize with an iterative focus to begin deep work.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SprintPlanner.displayName = 'SprintPlanner';

export default SprintPlanner;
