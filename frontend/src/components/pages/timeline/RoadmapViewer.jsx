import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import timelineService from '../../../services/timelineService';
import projectService from '../../../services/projectService';

const RoadmapViewer = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(id || '');
  const [projectData, setProjectData] = useState(null);
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

  // Fetch timeline for selected project and map to roadmap
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        const response = await timelineService.getByProject(selectedProjectId);
        if (response.success && response.data.length > 0) {
          const timeline = response.data[0];
          const milestones = Array.isArray(timeline.milestones)
            ? timeline.milestones
            : [];

          setProjectData({
            title: timeline.project?.title || 'Strategic Roadmap',
            description:
              timeline.project?.description ||
              'Visualizing the long-term project trajectory and key benchmarks.',
            phases: milestones.map((m, index) => {
              const date = new Date(m.dueDate);
              const quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
              const year = date.getFullYear();

              return {
                id: m._id || m.id,
                name: m.title,
                status: m.completed
                  ? 'completed'
                  : index === 0 && !m.completed
                    ? 'in-progress'
                    : 'upcoming',
                quarter: `${quarter} ${year}`,
                objectives: [
                  m.description || '',
                  `Deadline: ${date.toLocaleDateString()}`,
                  m.completed ? 'Criteria met' : 'Execution pending',
                ],
              };
            }),
          });
        } else {
          setProjectData(null);
        }
      } catch (error) {
        console.error('Failed to fetch roadmap data', error);
        setProjectData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [selectedProjectId]);

  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
  };

  const statusStyles = {
    completed: {
      indicator: 'bg-emerald-500',
      card: 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      bullet: 'text-emerald-500',
    },
    'in-progress': {
      indicator: 'bg-indigo-500',
      card: 'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/40 dark:bg-indigo-900/20',
      text: 'text-indigo-700 dark:text-indigo-300',
      bullet: 'text-indigo-500',
    },
    upcoming: {
      indicator: 'bg-slate-300 dark:bg-slate-600',
      card: 'border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-800 dark:bg-slate-800/40',
      text: 'text-slate-500 dark:text-slate-400',
      bullet: 'text-slate-400',
    },
  };

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title={projectData ? projectData.title : 'Project Roadmap'}
        subtitle={projectData ? projectData.description : 'Select a project to visualize its strategic trajectory and milestones'}
        icon={Compass}
        badge='Strategic Roadmap'
        actions={
          <div className='flex items-center gap-3'>
            <button
              onClick={() => handleNavigate('/timeline')}
              className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:border-slate-700 dark:bg-slate-800  transition-all'
            >
              <ArrowLeft size={16} />
              Overview
            </button>
            <select
              value={selectedProjectId}
              onChange={handleProjectChange}
              className='rounded-xl border border-gray-200 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-indigo-600 shadow-sm transition-all focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400'
            >
              <option value='' disabled>
                Select Venture
              </option>
              {projects.map((p) => (
                <option
                  key={p._id || p.id}
                  value={p._id || p.id}
                  className='bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white dark:bg-slate-800 '
                >
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        }
      />

        {loading ? (
          <div className='flex flex-col items-center p-20 text-center'>
            <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent'></div>
            <span className='text-xs font-black tracking-widest text-gray-400'>
              Compiling Strategy...
            </span>
          </div>
        ) : !projectData ? (
          <div className='rounded-3xl border border-dashed border-slate-200 bg-white dark:bg-slate-900 p-20 text-center dark:border-slate-700 dark:bg-slate-800'>
            <h3 className='mb-2 text-xl font-black italic tracking-tight text-slate-900 dark:text-white'>
              No Strategic Data
            </h3>
            <p className='mx-auto max-w-xs text-xs font-bold text-slate-500 dark:text-slate-400'>
              This project hasn't established its long-term milestones yet.
              Switch ventures or initialize a timeline.
            </p>
          </div>
        ) : (
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='relative mb-12 overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white dark:bg-slate-900 p-10 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
              <div className='relative z-10'>
                {/* Visual Connector Line */}
                <div className='absolute left-[34px] right-0 top-[2.1rem] hidden h-px bg-slate-100 dark:bg-slate-700 lg:block'></div>

                <div className='relative grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4'>
                  {projectData.phases.map((phase) => (
                    <div key={phase.id} className='group relative'>
                      {/* Top Indicator */}
                      <div
                        className={`absolute left-6 top-0 z-10 h-6 w-6 -translate-y-1/2 transform rounded-full border-[6px] border-white shadow-lg transition-all duration-500 dark:border-slate-800 lg:left-1/2 lg:-translate-x-1/2 ${
                          statusStyles[phase.status].indicator
                        } group-hover:scale-125`}
                      ></div>

                      {/* Phase Component */}
                      <div
                        className={`mt-10 rounded-3xl border-2 p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                          statusStyles[phase.status].card
                        }`}
                      >
                        <div className='mb-6'>
                          <div className='flex items-start justify-between gap-4'>
                            <h3 className='text-xl font-black italic leading-tight tracking-tighter text-slate-900 dark:text-white'>
                              {phase.name}
                            </h3>
                            <span className='rounded-lg border border-gray-50 bg-white dark:bg-slate-900/50 px-3 py-1 text-[10px] font-black tracking-widest dark:border-slate-700 '>
                              {phase.quarter}
                            </span>
                          </div>
                          <div
                            className={`mt-3 inline-block w-fit rounded px-2 py-0.5 text-[10px] font-black tracking-[0.2em] ${statusStyles[phase.status].text || 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                          >
                            {phase.status.charAt(0).toUpperCase() +
                              phase.status.slice(1).replace('-', ' ')}
                          </div>
                        </div>

                        <div className='space-y-4 border-t border-slate-100 pt-6 dark:border-slate-700'>
                          <div className='mb-1 text-[10px] font-black tracking-widest text-slate-400'>
                            Phase Objectives
                          </div>
                          <ul className='space-y-3'>
                            {phase.objectives.map((objective, idx) => (
                              <li
                                key={idx}
                                className='group/item flex items-start text-xs font-bold text-slate-600 dark:text-slate-400'
                              >
                                <span
                                  className={`mr-3 mt-0.5 transition-colors ${
                                    phase.status === 'completed'
                                      ? statusStyles.completed.bullet
                                      : phase.status === 'in-progress' &&
                                          idx === 0
                                        ? statusStyles['in-progress'].bullet
                                        : statusStyles.upcoming.bullet
                                  } group-hover/item:scale-125`}
                                >
                                  {phase.status === 'completed' ||
                                  (phase.status === 'in-progress' && idx === 0)
                                    ? '●'
                                    : '○'}
                                </span>
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative Accent */}
              <div className='absolute right-0 top-0 -mr-48 -mt-48 h-96 w-96 rounded-full bg-indigo-50 opacity-50 blur-[100px] dark:bg-slate-700/20'></div>
            </div>

            {/* Legend Component */}
            <div className='flex flex-col items-center justify-between gap-6 rounded-3xl border border-gray-100 bg-white dark:bg-slate-900 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:flex-row'>
              <div className='flex flex-col'>
                <h4 className='mb-1 text-xs font-black tracking-widest text-slate-900 dark:text-white'>
                  Strategic Legend
                </h4>
                <p className='text-[10px] font-bold text-slate-400'>
                  Understanding the execution lifecycle
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-8'>
                <div className='flex items-center gap-3'>
                  <div className='h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30'></div>
                  <span className='text-[10px] font-black tracking-[0.1em] text-slate-500 dark:text-slate-400'>
                    Validated
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='h-3 w-3 animate-pulse rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/30'></div>
                  <span className='text-[10px] font-black tracking-[0.1em] text-slate-500 dark:text-slate-400'>
                    In Focus
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600'></div>
                  <span className='text-[10px] font-black tracking-[0.1em] text-slate-500 dark:text-slate-400'>
                    Pipeline
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });

RoadmapViewer.displayName = 'RoadmapViewer';

export default RoadmapViewer;
