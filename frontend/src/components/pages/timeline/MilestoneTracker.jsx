import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Flag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronDown,
  X,
  Save,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import timelineService from '../../../services/timelineService';
import projectService from '../../../services/projectService';
import { useAuth } from '../../../hooks/useAuth';

/* ─── Milestone Form Modal ────────────────────────────────────── */
const MilestoneModal = ({
  isOpen,
  onClose,
  onSave,
  milestone = null,
  saving,
}) => {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: milestone?.name || milestone?.title || '',
        description: milestone?.description || '',
        dueDate: milestone?.rawDueDate
          ? new Date(milestone.rawDueDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [isOpen, milestone]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Milestone title is required');
      return;
    }
    onSave(form);
  };

  return (
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl dark:bg-slate-800'>
        {/* Header */}
        <div className='flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-indigo-600 px-6 py-4 dark:border-slate-700'>
          <h3 className='flex items-center gap-2 text-base font-bold text-white'>
            <Flag size={16} />
            {milestone ? 'Edit Milestone' : 'New Milestone'}
          </h3>
          <button
            onClick={onClose}
            type='button'
            className='text-white/80 hover:text-white'
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4 p-6'>
          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300'>
              Title <span className='text-rose-500'>*</span>
            </label>
            <input
              type='text'
              className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 '
              placeholder='e.g. Literature Review Submission'
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300'>
              Description
            </label>
            <textarea
              rows={3}
              className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 '
              placeholder='Brief description of this milestone...'
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className='mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300'>
              Due Date
            </label>
            <input
              type='date'
              className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 '
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <div className='flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:bg-slate-700 '
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={saving}
              className='flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60'
            >
              {saving ? (
                <RefreshCw size={14} className='animate-spin' />
              ) : (
                <Save size={14} />
              )}
              {milestone ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Delete Confirm Modal ────────────────────────────────────── */
const DeleteModal = ({ isOpen, onClose, onConfirm, saving }) => {
  if (!isOpen) return null;
  return (
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl dark:bg-slate-800'>
        <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30'>
          <AlertCircle size={24} className='text-rose-600 dark:text-rose-400' />
        </div>
        <h3 className='mb-2 text-base font-bold text-slate-900 dark:text-white'>
          Delete Milestone?
        </h3>
        <p className='mb-6 text-sm text-slate-500 dark:text-slate-400'>
          This action cannot be undone. The milestone will be permanently
          removed.
        </p>
        <div className='flex justify-end gap-3'>
          <button
            onClick={onClose}
            className='rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:bg-slate-700 '
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className='flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60'
          >
            {saving && <RefreshCw size={14} className='animate-spin' />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────── */
const MilestoneTracker = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [timelineId, setTimelineId] = useState(null); // The DB timeline _id
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isStaff = user?.role === 'admin' || user?.role === 'faculty';

  /* ── Load all projects ───────────────────────────────────────── */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getAllProjects();
        const list = res?.success ? res.data || [] : [];
        setProjects(list);

        if (list.length === 0) {
          setLoading(false);
          return;
        }

        // Resolve initial project from URL param or first in list
        if (id) {
          const found = list.find(
            (p) => (p._id || p.id) === id || p.slug === id
          );
          setSelectedProjectId(
            found ? found._id || found.id : list[0]._id || list[0].id
          );
        } else {
          setSelectedProjectId(list[0]._id || list[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch projects', err);
        setError('Could not load projects');
        setLoading(false);
      }
    };
    fetchProjects();
  }, [id]);

  /* ── Load milestones for selected project ────────────────────── */
  const fetchMilestones = useCallback(async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await timelineService.getByProject(projectId);
      // api.js interceptor: response.data already unwrapped → { success, data }
      // timelineService returns api response directly → { success, data, message }
      const dataArr = res?.success && Array.isArray(res.data) ? res.data : [];

      if (dataArr.length > 0) {
        const timeline = dataArr[0];
        setTimelineId(timeline._id || timeline.id);
        const mapped = (
          Array.isArray(timeline.milestones) ? timeline.milestones : []
        ).map((m) => ({
          id: m._id || m.id,
          name: m.title,
          description: m.description || '',
          rawDueDate: m.dueDate || null,
          dueDate: m.dueDate
            ? new Date(m.dueDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'TBD',
          completed: !!m.completed,
        }));
        setMilestones(mapped);
      } else {
        setTimelineId(null);
        setMilestones([]);
      }
    } catch (err) {
      console.error('Failed to fetch milestones', err);
      setError('Could not load milestones for this project');
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) fetchMilestones(selectedProjectId);
  }, [selectedProjectId, fetchMilestones]);

  /* ── Dropdown change ─────────────────────────────────────────── */
  const handleProjectChange = useCallback(
    (e) => {
      const newId = e.target.value;
      setSelectedProjectId(newId);
      const project = projects.find((p) => (p._id || p.id) === newId);
      if (project)
        navigate(`/milestones/${project.slug || newId}`, { replace: true });
    },
    [projects, navigate]
  );

  /* ── Save milestones array to backend ────────────────────────── */
  const persistMilestones = useCallback(
    async (updatedMilestones) => {
      // Build payload matching schema: array of { title, description, dueDate, completed }
      const payload = updatedMilestones.map((m) => ({
        ...(m.id ? { _id: m.id } : {}),
        title: m.name,
        description: m.description || '',
        dueDate: m.rawDueDate || null,
        completed: !!m.completed,
      }));

      if (timelineId) {
        // Update existing timeline
        const res = await timelineService.update(timelineId, {
          milestones: payload,
        });
        if (!res?.success) throw new Error(res?.message || 'Update failed');
        return res;
      } else {
        // Create new timeline
        const res = await timelineService.create({
          project: selectedProjectId,
          milestones: payload,
        });
        if (!res?.success) throw new Error(res?.message || 'Create failed');
        return res;
      }
    },
    [timelineId, selectedProjectId]
  );

  /* ── Create / Edit milestone ─────────────────────────────────── */
  const handleSaveMilestone = useCallback(
    async (form) => {
      setSaving(true);
      try {
        let updated;
        if (editingMilestone) {
          // Edit existing
          updated = milestones.map((m) =>
            m.id === editingMilestone.id
              ? {
                  ...m,
                  name: form.title,
                  description: form.description,
                  rawDueDate: form.dueDate || null,
                  dueDate: form.dueDate
                    ? new Date(form.dueDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'TBD',
                }
              : m
          );
        } else {
          // Add new (temporary id will be replaced after refetch)
          const newItem = {
            id: null,
            name: form.title,
            description: form.description,
            rawDueDate: form.dueDate || null,
            dueDate: form.dueDate
              ? new Date(form.dueDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'TBD',
            completed: false,
          };
          updated = [...milestones, newItem];
        }

        await persistMilestones(updated);
        toast.success(
          editingMilestone ? 'Milestone updated' : 'Milestone created'
        );
        setShowModal(false);
        setEditingMilestone(null);
        // Refetch to get real DB ids
        await fetchMilestones(selectedProjectId);
      } catch (err) {
        console.error(err);
        toast.error(err.message || 'Failed to save milestone');
      } finally {
        setSaving(false);
      }
    },
    [
      editingMilestone,
      milestones,
      persistMilestones,
      fetchMilestones,
      selectedProjectId,
    ]
  );

  /* ── Toggle complete ─────────────────────────────────────────── */
  const handleToggleComplete = useCallback(
    async (milestoneId) => {
      const updated = milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      setMilestones(updated);
      try {
        await persistMilestones(updated);
        toast.success('Status updated');
      } catch (err) {
        console.error(err);
        toast.error('Failed to update status');
        setMilestones(milestones); // revert
      }
    },
    [milestones, persistMilestones]
  );

  /* ── Delete milestone ────────────────────────────────────────── */
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const updated = milestones.filter((m) => m.id !== deleteTarget);
      await persistMilestones(updated);
      setMilestones(updated);
      toast.success('Milestone deleted');
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete milestone');
    } finally {
      setSaving(false);
    }
  }, [deleteTarget, milestones, persistMilestones]);

  /* ── Stats ───────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const completed = milestones.filter((m) => m.completed).length;
    const pending = milestones.length - completed;
    const pct =
      milestones.length > 0
        ? Math.round((completed / milestones.length) * 100)
        : 0;
    return { completed, pending, total: milestones.length, pct };
  }, [milestones]);

  const selectedProject = useMemo(
    () => projects.find((p) => (p._id || p.id) === selectedProjectId),
    [projects, selectedProjectId]
  );

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className='animate-fade-in space-y-6 pt-0 pb-6'>
      <PageHeader
        title='Milestone Tracker'
        subtitle='Track and evaluate key project deliverables and target deadlines'
        icon={Flag}
        badge={
          milestones.length > 0
            ? `${stats.completed}/${stats.total} Done`
            : undefined
        }
        actions={
          <div className='flex flex-wrap items-center gap-3'>
            {/* Project Selector */}
            <div className='flex items-center gap-2'>
              <span className='hidden text-xs font-semibold text-slate-500 dark:text-slate-400 sm:block'>
                Project:
              </span>
              <div className='relative'>
                <select
                  value={selectedProjectId}
                  onChange={handleProjectChange}
                  disabled={projects.length === 0}
                  className='appearance-none rounded-xl border border-gray-200 bg-white dark:bg-slate-900 py-2 pl-3 pr-8 text-xs font-semibold text-indigo-600 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400 disabled:opacity-50'
                >
                  {projects.length === 0 ? (
                    <option value=''>No projects found</option>
                  ) : (
                    projects.map((p) => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {p.title}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown
                  size={14}
                  className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400'
                />
              </div>
            </div>

            {/* New Milestone button (staff only) */}
            {isStaff && selectedProjectId && (
              <button
                onClick={() => {
                  setEditingMilestone(null);
                  setShowModal(true);
                }}
                className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'
              >
                <Plus size={15} />
                New Milestone
              </button>
            )}
          </div>
        }
      />

      {/* Progress bar (when milestones exist) */}
      {milestones.length > 0 && (
        <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
              Overall Progress
            </span>
            <span className='text-xs font-bold text-indigo-600 dark:text-indigo-400'>
              {stats.pct}%
            </span>
          </div>
          <div className='h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900'>
            <div
              className='h-full rounded-full bg-indigo-500 transition-all duration-700'
              style={{ width: `${stats.pct}%` }}
            />
          </div>
          <div className='mt-3 flex gap-4 text-xs text-slate-500 dark:text-slate-400'>
            <span className='flex items-center gap-1'>
              <CheckCircle2 size={12} className='text-emerald-500' />{' '}
              {stats.completed} completed
            </span>
            <span className='flex items-center gap-1'>
              <Clock size={12} className='text-amber-500' /> {stats.pending}{' '}
              pending
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className='flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white dark:bg-slate-900 p-20 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <RefreshCw className='h-8 w-8 animate-spin text-indigo-500' />
          <p className='text-sm italic text-gray-400'>
            Synchronizing milestone archives...
          </p>
        </div>
      ) : error ? (
        <div className='flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-20 text-center dark:border-rose-900/30 dark:bg-rose-900/10'>
          <AlertCircle className='h-8 w-8 text-rose-500' />
          <p className='text-sm font-medium text-rose-600 dark:text-rose-400'>
            {error}
          </p>
          <button
            onClick={() => fetchMilestones(selectedProjectId)}
            className='rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700'
          >
            Retry
          </button>
        </div>
      ) : milestones.length === 0 ? (
        <div className='flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white dark:bg-slate-900 p-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/20'>
            <Flag size={28} className='text-indigo-400' />
          </div>
          <div>
            <h3 className='mb-1 text-base font-bold text-gray-900 dark:text-white'>
              {projects.length === 0
                ? 'No Projects Found'
                : 'No Milestones Yet'}
            </h3>
            <p className='text-sm text-gray-500 dark:text-slate-400'>
              {projects.length === 0
                ? 'Create a project first to start tracking milestones.'
                : isStaff
                  ? 'Add the first milestone to start tracking progress.'
                  : 'No milestones have been set for this project yet.'}
            </p>
          </div>
          {isStaff && projects.length > 0 && (
            <button
              onClick={() => {
                setEditingMilestone(null);
                setShowModal(true);
              }}
              className='flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700'
            >
              <Plus size={16} /> Create First Milestone
            </button>
          )}
        </div>
      ) : (
        <div className='space-y-4'>
          {milestones.map((milestone) => (
            <div
              key={milestone.id || milestone.name}
              className={`group relative rounded-2xl border bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md dark:bg-slate-800 ${
                milestone.completed
                  ? 'border-emerald-200 dark:border-emerald-900/40'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* Status stripe */}
              <div
                className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${
                  milestone.completed
                    ? 'bg-emerald-400'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />

              <div className='ml-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                {/* Left content */}
                <div className='flex-1'>
                  <div className='mb-1 flex items-center gap-2'>
                    <span className='text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400'>
                      Phase Milestone
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        milestone.completed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200  dark:text-slate-300'
                      }`}
                    >
                      {milestone.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>

                  <h3 className='text-base font-bold text-gray-900 dark:text-white'>
                    {milestone.name}
                  </h3>

                  {milestone.description && (
                    <p className='mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400'>
                      {milestone.description}
                    </p>
                  )}

                  <div className='mt-3 flex items-center gap-1.5 text-xs text-slate-400'>
                    <Clock size={12} />
                    <span>
                      Due:{' '}
                      <span className='font-semibold text-slate-700 dark:text-slate-300'>
                        {milestone.dueDate}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className='flex shrink-0 items-center gap-2'>
                  {/* View Project */}
                  <button
                    onClick={() =>
                      navigate(
                        `/projects/${selectedProject?.slug || selectedProjectId}`
                      )
                    }
                    className='rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:bg-slate-700 '
                  >
                    View Project
                  </button>

                  {isStaff && (
                    <>
                      {/* Toggle complete */}
                      <button
                        onClick={() => handleToggleComplete(milestone.id)}
                        title={
                          milestone.completed
                            ? 'Mark as Pending'
                            : 'Mark as Complete'
                        }
                        className={`rounded-xl p-2 transition-colors ${
                          milestone.completed
                            ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'border border-slate-200 bg-white dark:bg-slate-900 text-slate-400 hover:border-emerald-300 hover:text-emerald-500 dark:border-slate-600 dark:bg-slate-700'
                        }`}
                      >
                        <CheckCircle2 size={16} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingMilestone(milestone);
                          setShowModal(true);
                        }}
                        title='Edit milestone'
                        className='rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-2 text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-700 '
                      >
                        <Edit2 size={15} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(milestone.id)}
                        title='Delete milestone'
                        className='rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-2 text-slate-500 dark:text-slate-400 hover:border-rose-300 hover:text-rose-600 dark:border-slate-600 dark:bg-slate-700 '
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <MilestoneModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMilestone(null);
        }}
        onSave={handleSaveMilestone}
        milestone={editingMilestone}
        saving={saving}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        saving={saving}
      />
    </div>
  );
});

MilestoneTracker.displayName = 'MilestoneTracker';

export default MilestoneTracker;
