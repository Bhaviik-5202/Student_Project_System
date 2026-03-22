import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import timelineService from '../../../services/timelineService';
import projectService from '../../../services/projectService';
import { useAuth } from '../../../hooks/useAuth';

const MilestoneTracker = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all projects for the selector
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        if (response.success && Array.isArray(response.data)) {
          setProjects(response.data);

          if (id) {
            const foundProject = response.data.find(
              (p) => (p._id || p.id) === id || p.slug === id
            );
            if (foundProject) {
              setSelectedProjectId(foundProject._id || foundProject.id);
            } else if (response.data.length > 0) {
              setSelectedProjectId(response.data[0]._id || response.data[0].id);
            } else {
              setLoading(false);
            }
          } else if (response.data.length > 0) {
            setSelectedProjectId(response.data[0]._id || response.data[0].id);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, [id]);

  // Fetch timeline for selected project
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchMilestones = async () => {
      setLoading(true);
      try {
        const data = await timelineService.getByProject(selectedProjectId);
        // data should be an array based on timelineService.getByProject returning response.data (which is the array)
        if (Array.isArray(data) && data.length > 0) {
          const timeline = data[0];
          const milestones = Array.isArray(timeline.milestones)
            ? timeline.milestones
            : [];
          setProjectData({
            name: timeline.project?.title || 'Project Milestones',
            milestones: milestones.map((m) => ({
              id: m._id || m.id,
              name: m.title,
              description: m.description,
              dueDate: m.dueDate
                ? new Date(m.dueDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'TBD',
              status: m.completed ? 'completed' : 'pending',
              progress: m.completed ? 100 : 0,
            })),
          });
        } else {
          setProjectData(null);
        }
      } catch (error) {
        console.error('Failed to fetch milestone data', error);
        setProjectData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, [selectedProjectId]);

  const handleProjectChange = (e) => {
    const newId = e.target.value;
    const project = projects.find((p) => (p._id || p.id) === newId);
    if (project) {
      navigate(`/milestones/${project.slug || newId}`);
    } else {
      setSelectedProjectId(newId);
    }
  };

  const statusStyles = {
    completed: {
      dot: 'bg-emerald-500',
      badge:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    },
    'in-progress': {
      dot: 'bg-amber-500',
      badge:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    },
    pending: {
      dot: 'bg-slate-400',
      badge:
        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    },
  };

  const progressStyles = {
    high: 'bg-emerald-500',
    medium: 'bg-indigo-500',
    low: 'bg-amber-500',
  };

  const stats = useMemo(() => {
    if (!projectData || !projectData.milestones)
      return { completed: 0, inProgress: 0, pending: 0 };
    const completed = projectData.milestones.filter(
      (m) => m.status === 'completed'
    ).length;
    const inProgress = projectData.milestones.filter(
      (m) => m.status === 'in-progress'
    ).length;
    const pending = projectData.milestones.filter(
      (m) => m.status === 'pending'
    ).length;

    return { completed, inProgress, pending };
  }, [projectData]);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const selectedProjectSlug = useMemo(() => {
    const p = projects.find((p) => (p._id || p.id) === selectedProjectId);
    return p?.slug || selectedProjectId;
  }, [projects, selectedProjectId]);

  return (
    <div className='project-page animate-fade-in text-gray-600 dark:text-gray-400'>
      <div className='project-header'>
        <div>
          <h1 className='project-title text-gray-900 dark:text-white'>
            Milestone Tracker
          </h1>
          <div className='mt-1.5 flex items-center gap-3 font-medium'>
            <span className='text-sm text-gray-500'>Archives:</span>
            <select
              value={selectedProjectId}
              onChange={handleProjectChange}
              className='cursor-pointer border-none bg-transparent p-0 text-sm font-bold text-indigo-600 transition-all focus:ring-0 dark:text-indigo-400'
            >
              <option value='' disabled>
                Select Venture
              </option>
              {projects.map((p) => (
                <option
                  key={p._id || p.id}
                  value={p._id || p.id}
                  className='bg-white text-sm text-gray-900 dark:bg-slate-800 dark:text-white'
                >
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => handleNavigate('/timeline')}
            className='text-xs font-bold text-gray-400 hover:text-gray-600'
          >
            Temporal View
          </button>
          {user?.role !== 'student' && (
            <button
              onClick={() =>
                navigate(`/timeline-editor/${selectedProjectSlug}`)
              }
              className='project-btn project-btn-primary'
            >
              New Milestone
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className='rounded-xl border border-gray-200 bg-white p-20 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600'></div>
          <p className='text-sm italic text-gray-400'>
            Synchronizing milestone archives...
          </p>
        </div>
      ) : !projectData ? (
        <div className='rounded-xl border border-dashed border-gray-200 bg-white p-20 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <h3 className='mb-1 text-lg font-bold text-gray-900 dark:text-white'>
            No Milestones Found
          </h3>
          <p className='mx-auto max-w-[200px] text-xs leading-relaxed text-gray-500'>
            No milestones have been established for this project archives.
          </p>
        </div>
      ) : (
        <div className='space-y-6'>
          <div className='project-card-simple relative overflow-hidden'>
            <div className='relative z-10'>
              {/* Timeline Axis */}
              <div className='absolute bottom-0 left-6 top-0 w-[1px] bg-gray-50 dark:bg-slate-700/50'></div>

              <div className='space-y-6'>
                {projectData.milestones.map((milestone) => (
                  <div key={milestone.id} className='group relative pl-12'>
                    {/* Timeline Node */}
                    <div
                      className={`absolute left-[18px] top-2.5 z-20 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm dark:border-slate-800 ${
                        statusStyles[milestone.status].dot
                      }`}
                    ></div>

                    {/* Milestone Component */}
                    <div className='rounded-xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-indigo-500/30 dark:border-slate-700/50 dark:bg-slate-900/40'>
                      <div className='mb-6 flex flex-col items-start justify-between gap-4 md:flex-row'>
                        <div className='flex-1'>
                          <div className='mb-1 flex items-center gap-2'>
                            <span className='text-[10px] font-bold text-indigo-500 dark:text-indigo-400'>
                              Phase Milestone
                            </span>
                          </div>
                          <h3 className='text-lg font-bold leading-tight text-gray-900 dark:text-white'>
                            {milestone.name}
                          </h3>
                          <div className='mt-3 flex items-center gap-4'>
                            <div className='flex items-center gap-2'>
                              <span className='text-[10px] font-bold text-gray-400'>
                                Target:
                              </span>
                              <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                                {milestone.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            statusStyles[milestone.status].badge
                          }`}
                        >
                          {milestone.status.replace('-', ' ')}
                        </span>
                      </div>

                      {milestone.description && (
                        <div className='mb-6 rounded-lg border border-gray-50 bg-white p-4 dark:border-slate-700/50 dark:bg-slate-800/50'>
                          <p className='text-sm leading-relaxed text-gray-600 dark:text-gray-400'>
                            {milestone.description}
                          </p>
                        </div>
                      )}

                      {/* Progress Tracker */}
                      <div className='mb-6'>
                        <div className='mb-2 flex items-center justify-between'>
                          <span className='text-[10px] font-bold text-gray-400'>
                            Execution Fidelity
                          </span>
                          <span className='text-xs font-bold text-indigo-600 dark:text-indigo-400'>
                            {milestone.progress}%
                          </span>
                        </div>
                        <div className='h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-900'>
                          <div
                            className={`h-full transition-all duration-1000 ease-out ${
                              milestone.progress === 100
                                ? progressStyles.high
                                : milestone.progress >= 50
                                  ? progressStyles.medium
                                  : progressStyles.low
                            }`}
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className='flex flex-col items-center gap-2 border-t border-gray-50 pt-4 dark:border-slate-700/50 sm:flex-row'>
                        <button
                          onClick={() =>
                            navigate(`/projects/${selectedProjectSlug}`)
                          }
                          className='project-btn project-btn-primary w-full sm:flex-1'
                        >
                          View Details
                        </button>
                        {user?.role !== 'student' && (
                          <button
                            onClick={() =>
                              navigate(
                                `/timeline-editor/${selectedProjectSlug}`
                              )
                            }
                            className='project-btn project-btn-secondary w-full sm:w-auto'
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='project-card-simple'>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/20'></div>
                <span className='text-[10px] font-bold text-gray-400'>
                  Completed
                </span>
              </div>
              <div className='text-3xl font-bold tabular-nums text-gray-900 dark:text-white'>
                {stats.completed}
              </div>
            </div>

            <div className='project-card-simple'>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20'></div>
                <span className='text-[10px] font-bold text-gray-400'>
                  In Progress
                </span>
              </div>
              <div className='text-3xl font-bold tabular-nums text-gray-900 dark:text-white'>
                {stats.inProgress}
              </div>
            </div>

            <div className='project-card-simple'>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'></div>
                <span className='text-[10px] font-bold text-gray-400'>
                  Pending
                </span>
              </div>
              <div className='text-3xl font-bold tabular-nums text-gray-900 dark:text-white'>
                {stats.pending}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

MilestoneTracker.displayName = 'MilestoneTracker';

export default MilestoneTracker;
