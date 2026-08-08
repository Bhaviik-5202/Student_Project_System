import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import meetingService from '../../../services/meetingService';
import { useAuth } from '../../../hooks/useAuth';
import {
  List,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Eye,
  Edit2,
  Trash2,
  FolderKanban,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import '../../../assets/styles/meetings.css';

const TYPE_LABELS = {
  review: 'Project Review',
  project: 'Project Review',
  team: 'Team Sync',
  one_on_one: 'One-on-One',
  faculty: 'Faculty Meeting',
  client: 'Client Review',
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'upcoming':
    case 'scheduled':
      return (
        <span className='inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'>
          Upcoming
        </span>
      );
    case 'ongoing':
      return (
        <span className='inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 animate-pulse'>
          Ongoing
        </span>
      );
    case 'completed':
      return (
        <span className='inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'>
          Completed
        </span>
      );
    case 'cancelled':
      return (
        <span className='inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800'>
          Cancelled
        </span>
      );
    default:
      return (
        <span className='inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200  dark:text-slate-300'>
          {status || 'Scheduled'}
        </span>
      );
  }
};

const MeetingCard = memo(({ meeting, onView, onEdit, onDelete, currentUser }) => {
  const canManage = currentUser?.role === 'admin';
  const isActive = meeting.isActive !== false && meeting.status !== 'cancelled';

  return (
    <div className='flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex flex-col'>
          <div className='text-[15px] font-black text-slate-900 dark:text-white leading-tight'>
            {meeting.title}
          </div>
          <div className='text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5'>
            {TYPE_LABELS[meeting.type] || meeting.type || 'Sync Session'}
          </div>
        </div>
        <div className='shrink-0'>{getStatusBadge(meeting.status)}</div>
      </div>

      <div className='mt-2 flex flex-col gap-2 rounded-xl bg-slate-50/50 p-3 dark:bg-slate-800/40 flex-1'>
        <div className='flex items-center gap-2 text-[12px] font-semibold text-slate-700 dark:text-slate-300'>
          <Calendar size={14} className='text-slate-400' />
          <span>{meeting.date ? new Date(meeting.date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}</span>
          <span className='text-slate-400 mx-1'>•</span>
          <Clock size={14} className='text-slate-400' />
          <span>{meeting.time || '10:00 AM'}</span>
        </div>
        <div className='flex items-center gap-2 text-[12px] font-semibold text-slate-700 dark:text-slate-300'>
          <User size={14} className='text-slate-400' />
          <span className='truncate'>{meeting.organizer?.name || 'Faculty Guide'}</span>
        </div>
        {meeting.project?.title && (
          <div className='flex items-center gap-2 text-[12px] font-semibold text-slate-700 dark:text-slate-300'>
            <FolderKanban size={14} className='text-slate-400' />
            <span className='truncate'>{meeting.project.title}</span>
          </div>
        )}

        <div className='mt-auto flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-700/50'>
          <div className='flex items-center gap-1.5'>
            <Users size={14} className='text-indigo-500' />
            <span className='text-[11px] font-bold text-slate-700 dark:text-slate-300'>
              {Array.isArray(meeting.participants) ? meeting.participants.length : 0} Members
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <button onClick={() => onView(meeting.id)} className='flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-transform active:scale-90 dark:bg-slate-700 dark:text-slate-300'>
              <Eye size={18} />
            </button>
            {canManage && (
              <>
                <button onClick={() => onEdit(meeting.id)} className='flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform active:scale-90 dark:bg-indigo-500/20 dark:text-indigo-400'>
                  <Edit2 size={18} />
                </button>
                <button onClick={() => onDelete(meeting.id)} className='flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-transform active:scale-90 dark:bg-rose-500/20 dark:text-rose-400'>
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});



const MeetingList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await meetingService.getAllMeetings();
    if (res.success) {
      setMeetings(
        (res.data || []).map((m) => ({
          id: m._id || m.id,
          title: m.title,
          type: m.type,
          project: m.project,
          organizer: m.organizer,
          participants: m.participants || [],
          date: m.date,
          time: m.time,
          location: m.location,
          status: m.status || 'scheduled',
          isActive: m.isActive !== false && m.status !== 'cancelled',
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
        }))
      );
    } else {
      setError(res.message || 'Failed to load meetings');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleView = useCallback(
    (id) => navigate(`/meetings/${id}`),
    [navigate]
  );
  const handleEdit = useCallback(
    (id) => navigate(`/meetings/${id}/edit`),
    [navigate]
  );
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting?'))
      return;
    const res = await meetingService.deleteMeeting(id);
    if (res.success) {
      toast.success('Meeting deleted successfully');
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } else {
      toast.error(res.message || 'Failed to delete meeting');
    }
  }, []);

  const canCreate = user?.role === 'admin';

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Meeting Management'
        subtitle='Control, organize, and monitor project synchronization sessions'
        icon={List}
        badge={`${meetings.length} Meetings`}
        actions={
          canCreate && (
            <button
              onClick={() => navigate('/meetings/new')}
              className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'
            >
              <Plus size={16} />
              <span>Schedule New Meeting</span>
            </button>
          )
        }
      />

      <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
        <div className='mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-lg font-bold text-slate-900 dark:text-white'>
              All Meeting Records
            </h2>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Complete registry of scheduled, active, and completed meetings
            </p>
          </div>
        </div>

        {/* Unified Card Grid View */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {loading ? (
            <div className='col-span-full flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent' />
              <span className='mt-3 text-[13px] font-semibold text-slate-500'>Accessing schedule...</span>
            </div>
          ) : error ? (
            <div className='col-span-full flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
              <span className='text-[13px] font-semibold text-rose-500'>{error}</span>
            </div>
          ) : meetings.length === 0 ? (
            <div className='col-span-full flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
              <Calendar className='mb-3 h-10 w-10 text-slate-300 dark:text-slate-600' />
              <span className='text-[13px] font-semibold text-slate-500'>No meetings scheduled.</span>
            </div>
          ) : (
            meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentUser={user}
              />
            ))
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

MeetingList.displayName = 'MeetingList';
export default MeetingList;
