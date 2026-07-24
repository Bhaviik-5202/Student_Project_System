import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import meetingService from '../../../services/meetingService';
import { useAuth } from '../../../hooks/useAuth';
import { List, Plus, Calendar, Clock, MapPin, Users, User, Eye, Edit2, Trash2 } from 'lucide-react';
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

const MeetingRow = memo(
  ({ meeting, onView, onEdit, onDelete, currentUser }) => {
    const canManage = currentUser?.role === 'admin' || currentUser?.role === 'faculty';

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

    const isActive = meeting.isActive !== false && meeting.status !== 'cancelled';

    return (
      <tr className='hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/80 /40 transition-colors'>
        {/* Title & Type */}
        <td className='py-4 px-4'>
          <div className='font-bold text-slate-900 dark:text-white text-sm'>
            {meeting.title}
          </div>
          <div className='text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5'>
            {TYPE_LABELS[meeting.type] || meeting.type || 'Sync Session'}
          </div>
        </td>

        {/* Project */}
        <td className='py-4 px-4'>
          <div className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
            {meeting.project?.title || <span className='text-slate-400 italic'>General (No Project)</span>}
          </div>
        </td>

        {/* Organizer */}
        <td className='py-4 px-4'>
          <div className='flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300'>
            <User size={13} className='text-slate-400' />
            <span>{meeting.organizer?.name || 'Faculty Guide'}</span>
          </div>
          {meeting.organizer?.email && (
            <div className='text-[10px] text-slate-400 dark:text-slate-500 dark:text-slate-400'>
              {meeting.organizer.email}
            </div>
          )}
        </td>

        {/* Participants */}
        <td className='py-4 px-4'>
          <div className='flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400'>
            <Users size={14} className='text-indigo-500' />
            <span className='font-semibold text-slate-800 dark:text-slate-200'>
              {Array.isArray(meeting.participants) ? meeting.participants.length : 0} Members
            </span>
          </div>
        </td>

        {/* Date & Time */}
        <td className='py-4 px-4 whitespace-nowrap'>
          <div className='text-xs font-bold text-slate-900 dark:text-white'>
            {meeting.date ? new Date(meeting.date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
          </div>
          <div className='text-[11px] font-medium text-slate-500 dark:text-slate-400'>
            {meeting.time || '10:00 AM'}
          </div>
        </td>

        {/* Status Badge */}
        <td className='py-4 px-4 whitespace-nowrap'>
          {getStatusBadge(meeting.status)}
        </td>

        {/* Active / Inactive Badge */}
        <td className='py-4 px-4 whitespace-nowrap'>
          {isActive ? (
            <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'>
              <span className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' /> Active
            </span>
          ) : (
            <span className='inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800'>
              <span className='h-2 w-2 rounded-full bg-rose-500' /> Inactive
            </span>
          )}
        </td>

        {/* Created & Updated */}
        <td className='py-4 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap'>
          <div>Created: {meeting.createdAt ? new Date(meeting.createdAt).toLocaleDateString() : 'N/A'}</div>
          <div className='text-[10px] text-slate-400'>Updated: {meeting.updatedAt ? new Date(meeting.updatedAt).toLocaleDateString() : 'N/A'}</div>
        </td>

        {/* Actions */}
        <td className='py-4 px-4 text-right whitespace-nowrap'>
          <div className='flex items-center justify-end gap-1.5'>
            <button
              onClick={() => onView(meeting.id)}
              className='rounded-lg p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800   transition-colors'
              title='View Details'
            >
              <Eye size={16} />
            </button>
            {canManage && (
              <>
                <button
                  onClick={() => onEdit(meeting.id)}
                  className='rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 transition-colors'
                  title='Edit Meeting'
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(meeting.id)}
                  className='rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 transition-colors'
                  title='Delete Meeting'
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  }
);

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

  const canCreate = user?.role === 'admin' || user?.role === 'faculty';

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

        <div className='overflow-x-auto'>
          {loading ? (
            <div className='p-12 text-center text-sm font-medium italic text-slate-400'>
              Accessing meeting schedule archive...
            </div>
          ) : error ? (
            <div className='p-12 text-center text-sm font-bold tracking-wider text-rose-500'>
              {error}
            </div>
          ) : meetings.length === 0 ? (
            <div className='p-12 text-center text-slate-400 italic text-sm'>
              No meetings scheduled at this time.
            </div>
          ) : (
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-900/50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  <th className='py-3 px-4'>Title & Type</th>
                  <th className='py-3 px-4'>Project</th>
                  <th className='py-3 px-4'>Organizer</th>
                  <th className='py-3 px-4'>Participants</th>
                  <th className='py-3 px-4'>Date & Time</th>
                  <th className='py-3 px-4'>Status</th>
                  <th className='py-3 px-4'>Active Status</th>
                  <th className='py-3 px-4'>Timestamps</th>
                  <th className='py-3 px-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-slate-700/50'>
                {meetings.map((meeting) => (
                  <MeetingRow
                    key={meeting.id}
                    meeting={meeting}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    currentUser={user}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

MeetingRow.displayName = 'MeetingRow';
MeetingList.displayName = 'MeetingList';
export default MeetingList;
