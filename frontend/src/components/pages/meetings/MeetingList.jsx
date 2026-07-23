import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import meetingService from '../../../services/meetingService';
import { useAuth } from '../../../hooks/useAuth';
import { List, Plus } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import '../../../assets/styles/meetings.css';

const MeetingRow = memo(
  ({ meeting, onView, onEdit, onDelete, currentUser }) => {
    const isAdmin = currentUser?.role === 'admin';
    const getStatusColor = (status) => {
      switch (status) {
        case 'scheduled':
          return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30';
        case 'completed':
          return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30';
        case 'cancelled':
          return 'text-rose-600 bg-rose-50 dark:bg-rose-900/30';
        default:
          return 'text-gray-600 bg-gray-50 dark:bg-slate-800';
      }
    };

    return (
      <tr>
        <td>
          <div className='font-bold text-gray-900 dark:text-white'>
            {meeting.title}
          </div>
          <div className='meeting-subtitle'>
            {meeting.type || 'Sync Session'}
          </div>
        </td>
        <td>
          <div className='font-medium text-gray-600 dark:text-gray-400'>
            {meeting.organizer?.name || 'Faculty Member'}
          </div>
        </td>
        <td>
          <div className='font-medium text-gray-900 dark:text-white'>
            {new Date(meeting.date).toLocaleDateString()}
          </div>
          <div className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
            {meeting.time || '10:00 AM'}
          </div>
        </td>
        <td>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${getStatusColor(meeting.status)}`}
          >
            {meeting.status}
          </span>
        </td>
        <td className='text-right'>
          <button
            onClick={() => onView(meeting.id)}
            className='meeting-btn meeting-btn-secondary mr-2'
          >
            View
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(meeting.id)}
                className='meeting-btn meeting-btn-secondary mr-2'
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(meeting.id)}
                className='meeting-btn meeting-btn-danger'
              >
                Delete
              </button>
            </>
          )}
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
          date: m.date,
          time: m.time,
          location: m.location,
          status: m.status,
          organizer: m.organizer,
          type: m.type,
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

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='Meeting Management'
        subtitle='Control and organize project sessions'
        icon={List}
        badge={`${meetings.length} Meetings`}
        actions={
          user?.role === 'admin' && (
            <button
              onClick={() => navigate('/meetings/new')}
              className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'
            >
              <Plus size={16} />
              Schedule New Meeting
            </button>
          )
        }
      />

      <div className='meeting-card'>
          <div className='meeting-card-header'>
            <div>
              <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
                All Scheduled Meetings
              </h2>
              <p className='meeting-subtitle mt-0.5'>
                History of all project synchronization sessions
              </p>
            </div>
          </div>

          <div className='meeting-table-container'>
            {loading ? (
              <div className='p-12 text-center text-sm font-medium italic text-gray-400'>
                Loading sessions...
              </div>
            ) : error ? (
              <div className='p-12 text-center text-sm font-bold uppercase tracking-widest text-red-500'>
                {error}
              </div>
            ) : meetings.length === 0 ? (
              <div className='p-12 text-center'>
                <p className='text-sm font-medium italic text-gray-400'>
                  No meetings scheduled at this time.
                </p>
              </div>
            ) : (
              <table className='meeting-table'>
                <thead>
                  <tr>
                    <th>Title & Session</th>
                    <th>Organizer</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th className='text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody>
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
