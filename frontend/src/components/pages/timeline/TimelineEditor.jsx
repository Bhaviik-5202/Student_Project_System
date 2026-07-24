import { useCallback, useState, useEffect, memo, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Edit, Save, ArrowLeft } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import timelineService from '../../../services/timelineService';
import projectService from '../../../services/projectService';

const TimelineEditor = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [timeline, setTimeline] = useState({
    project: '',
    milestones: [],
  });
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    dueDate: '',
    description: '',
  });

  // Fetch all projects for selection
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        if (response.success) {
          setProjects(response.data);

          // If we have an ID or slug from URL, find the matching project
          if (id) {
            const foundProject = response.data.find(
              (p) => p._id === id || p.slug === id
            );
            if (foundProject) {
              setSelectedProjectId(foundProject._id);
            } else if (response.data.length > 0) {
              // Fallback to first project if the specific ID/slug wasn't found
              setSelectedProjectId(response.data[0]._id);
            }
          } else if (response.data.length > 0) {
            setSelectedProjectId(response.data[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };
    fetchProjects();
  }, [id]);

  // Fetch timeline for the selected project
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchTimeline = async () => {
      setFetching(true);
      try {
        const response = await timelineService.getByProject(selectedProjectId);
        if (response.success && response.data.length > 0) {
          setTimeline(response.data[0]);
        } else {
          // Initialize a blank timeline for the selected project
          setTimeline({
            project: selectedProjectId,
            milestones: [],
          });
        }
      } catch (error) {
        console.error('Failed to fetch timeline data', error);
      } finally {
        setFetching(false);
      }
    };
    fetchTimeline();
  }, [selectedProjectId]);

  const handleProjectChange = (e) => {
    const newId = e.target.value;
    const project = projects.find((p) => p._id === newId);
    if (project) {
      navigate(`/timeline-editor/${project.slug || newId}`);
    } else {
      setSelectedProjectId(newId);
    }
  };

  const handleNewMilestoneChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewMilestone((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addMilestone = useCallback(() => {
    if (!newMilestone.title || !newMilestone.dueDate) {
      toast.error('Title and Date are required for a milestone');
      return;
    }

    const tempId = Date.now().toString();
    setTimeline((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { ...newMilestone, _id: tempId, completed: false },
      ],
    }));
    setNewMilestone({ title: '', dueDate: '', description: '' });
    toast.success('Milestone staged');
  }, [newMilestone]);

  const removeMilestone = useCallback((mid) => {
    setTimeline((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => (m._id || m.id) !== mid),
    }));
    toast.success('Milestone removed');
  }, []);

  const toggleMilestoneStatus = useCallback((mid) => {
    setTimeline((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        (m._id || m.id) === mid ? { ...m, completed: !m.completed } : m
      ),
    }));
  }, []);

  const saveTimeline = useCallback(async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project first');
      return;
    }

    setLoading(true);
    try {
      // Prepare milestones by removing temporary IDs
      const cleanedMilestones = timeline.milestones.map((m) => {
        const { _id, ...rest } = m;
        // Only keep _id if it's a valid MongoDB ObjectId (24 chars hex)
        if (_id && /^[0-9a-fA-F]{24}$/.test(_id)) {
          return { _id, ...rest };
        }
        return rest;
      });

      let response;
      if (timeline._id) {
        response = await timelineService.update(timeline._id, {
          ...timeline,
          milestones: cleanedMilestones,
        });
      } else {
        response = await timelineService.create({
          project: selectedProjectId,
          milestones: cleanedMilestones,
        });
      }

      if (response && response.success) {
        toast.success('Timeline successfully synchronized');
        navigate('/timeline');
      } else {
        toast.error(response?.message || 'Failed to preserve timeline');
      }
    } catch (error) {
      toast.error('Critical synchronization failure');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [timeline, selectedProjectId, navigate]);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const inputClass =
    'w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all';

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Timeline Editor'
        subtitle='Configure milestones, deadlines, and project phase trajectories'
        icon={Edit}
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
                Select Project
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
            <button
              onClick={saveTimeline}
              disabled={loading}
              className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 dark:shadow-none'
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Timeline'}
            </button>
          </div>
        }
      />

      {fetching ? (
        <div className='rounded-xl border border-gray-200 bg-white dark:bg-slate-900 p-20 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600'></div>
          <p className='text-sm italic text-gray-400'>
            Accessing timeline archives...
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Configuration Panel */}
          <div className='space-y-6 lg:col-span-1'>
            <div className='rounded-xl border border-gray-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-6 border-b border-gray-50 pb-2 text-sm font-bold tracking-widest text-gray-900 dark:text-white dark:border-slate-700 '>
                New Milestone
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='mb-1 block text-[10px] font-bold tracking-widest text-gray-400 shadow-sm'>
                    Objective Title
                  </label>
                  <input
                    type='text'
                    name='title'
                    placeholder='e.g. Beta Launch'
                    className='w-full rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm font-medium outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900'
                    value={newMilestone.title}
                    onChange={handleNewMilestoneChange}
                  />
                </div>
                <div>
                  <label className='mb-1 block text-[10px] font-bold tracking-widest text-gray-400'>
                    Target Delivery
                  </label>
                  <input
                    type='date'
                    name='dueDate'
                    className='w-full rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900'
                    value={newMilestone.dueDate}
                    onChange={handleNewMilestoneChange}
                  />
                </div>
                <div>
                  <label className='mb-1 block text-[10px] font-bold tracking-widest text-gray-400'>
                    Scope Description
                  </label>
                  <textarea
                    name='description'
                    rows='3'
                    placeholder='What must be achieved?'
                    className='w-full resize-none rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm font-medium outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900'
                    value={newMilestone.description}
                    onChange={handleNewMilestoneChange}
                  ></textarea>
                </div>
                <button
                  onClick={addMilestone}
                  className='w-full rounded-lg bg-gray-900 py-2 text-xs font-bold tracking-wider text-white transition-all hover:opacity-90 active:scale-95 dark:bg-indigo-600'
                >
                  <i className='fas fa-plus mr-2' /> Stage Objective
                </button>
              </div>
            </div>

            <div className='rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm dark:border-slate-700 dark:bg-indigo-900/10'>
              <h4 className='mb-2 flex items-center gap-2 text-[10px] font-bold tracking-widest text-indigo-700 dark:text-indigo-400'>
                <i className='fas fa-info-circle text-[8px]' /> Editor's Note
              </h4>
              <p className='text-[10px] font-medium leading-relaxed text-gray-500 dark:text-gray-400'>
                Staged objectives are only preserved once you save the timeline.
                Ensure your trajectory is logically consistent.
              </p>
            </div>
          </div>

          {/* Trajectory Manifest */}
          <div className='space-y-6 lg:col-span-2'>
            <div className='min-h-[500px] rounded-xl border border-gray-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
              <div className='mb-6 flex items-center justify-between'>
                <h3 className='text-sm font-bold tracking-widest text-gray-900 dark:text-white'>
                  Phase Manifest ({timeline.milestones.length})
                </h3>
                <div className='mx-6 h-px flex-1 bg-gray-50 dark:bg-slate-700/50'></div>
              </div>

              {timeline.milestones.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                  <i className='fas fa-history mb-4 text-4xl text-gray-200' />
                  <h4 className='mb-2 text-sm font-bold tracking-widest text-gray-900 dark:text-white'>
                    Timeline Uninitialized
                  </h4>
                  <p className='max-w-xs text-xs leading-relaxed text-gray-400'>
                    Stage your first objective to begin planning your project
                    timeline archives.
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {timeline.milestones.map((m, i) => (
                    <div
                      key={m._id || m.id}
                      className='rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-800/50 p-6 transition-all hover:border-indigo-500/30 dark:border-slate-700/50 dark:bg-slate-900/40'
                    >
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex flex-1 items-center gap-4'>
                          <button
                            onClick={() => toggleMilestoneStatus(m._id || m.id)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                              m.completed
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-gray-200 text-transparent hover:border-indigo-500 dark:border-slate-700'
                            }`}
                          >
                            <i className='fas fa-check text-xs' />
                          </button>
                          <div className='flex-1'>
                            <div className='mb-1 flex items-center gap-2'>
                              <h4
                                className={`text-base font-bold transition-all ${m.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}
                              >
                                {m.title}
                              </h4>
                              <span className='text-[10px] font-bold text-indigo-500/50'>
                                #{i + 1}
                              </span>
                            </div>
                            <div className='flex items-center gap-3'>
                              <span className='text-[10px] font-bold tabular-nums tracking-widest text-gray-400'>
                                Due: {new Date(m.dueDate).toLocaleDateString()}
                              </span>
                              <span
                                className={`text-[10px] font-bold tracking-widest ${m.completed ? 'text-emerald-500' : 'text-indigo-500'}`}
                              >
                                {m.completed ? 'Validated' : 'Scheduled'}
                              </span>
                            </div>
                            {m.description && (
                              <p className='mt-3 border-l-2 border-gray-100 pl-4 text-xs italic leading-relaxed text-gray-500 dark:text-gray-400 dark:border-slate-800'>
                                {m.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeMilestone(m._id || m.id)}
                          className='flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-300 transition-all hover:border-red-500/30 hover:text-red-500 dark:border-slate-700'
                        >
                          <i className='fas fa-trash-alt text-xs' />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

TimelineEditor.displayName = 'TimelineEditor';

export default TimelineEditor;
