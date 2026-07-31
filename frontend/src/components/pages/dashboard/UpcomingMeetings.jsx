import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Plus,
  Users,
  Clock,
  MapPin,
  Video,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import meetingService from '../../../services/meetingService';
import { MEETING_TYPES } from '../../../utils/constants';

const TYPE_CONFIG = {
  review: {
    label: 'Project Review',
    cardClass:
      'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    isReview: true,
  },
  [MEETING_TYPES.PROJECT]: {
    label: 'Project Review',
    cardClass:
      'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    isReview: true,
  },
  faculty: {
    label: 'Faculty Meeting',
    cardClass:
      'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30',
    badgeClass:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    isReview: false,
  },
  [MEETING_TYPES.ONE_ON_ONE]: {
    label: 'One-on-One',
    cardClass:
      'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30',
    badgeClass:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    isReview: false,
  },
};

const DEFAULT_TYPE_CONFIG = {
  label: 'Weekly Sync',
  cardClass:
    'border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:bg-slate-700/30',
  badgeClass:
    'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 dark:bg-slate-700 dark:text-slate-200',
  isReview: false,
};

const getTypeConfig = (type) => TYPE_CONFIG[type] || DEFAULT_TYPE_CONFIG;

const isUrl = (value) => /^https?:\/\//i.test(value || '');

const formatMeetingTime = (meeting) => {
  if (meeting.time) return meeting.time;
  if (meeting.date) {
    return new Date(meeting.date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return 'TBD';
};

const UpcomingMeetings = ({ meetings = [], userRole, title, emptyMessage }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const canJoinMeeting = () => {
    if (!user) return false;
    return true;
  };

  const handleDetails = (meetingId) => {
    if (!meetingId) {
      toast.error('Meeting details are unavailable');
      return;
    }
    navigate(`/meetings/${meetingId}`);
  };

  const handleJoin = async (meeting) => {
    const link = isUrl(meeting.location) ? meeting.location : null;

    if (!link) {
      toast.error('No meeting link available for this session');
      return;
    }

    if (!canJoinMeeting()) {
      toast.error('You do not have permission to join this meeting');
      return;
    }

    if (!meeting.id) {
      toast.error('Meeting details are unavailable');
      return;
    }

    try {
      const res = await meetingService.joinMeeting(meeting.id);
      if (!res.success) {
        toast.error(res.message || 'Unable to join meeting');
        return;
      }
      window.open(link, '_blank', 'noopener,noreferrer');
    } catch {
      toast.error('Failed to join meeting');
    }
  };

  return (
    <div className='rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
            {title || 'Upcoming Meetings'}
          </h3>
        </div>
        {userRole !== 'faculty' && (
          <Link
            to='/meetings/new'
            className='flex items-center text-sm font-medium text-primary-600 hover:text-primary-700'
          >
            <Plus size={16} className='mr-1' /> Schedule
          </Link>
        )}
      </div>
      <div className='space-y-4'>
        {meetings.length > 0 ? (
          meetings.map((meeting) => {
            const typeConfig = getTypeConfig(meeting.type);
            const meetingId = meeting.id || meeting._id;

            return (
              <div
                key={meetingId}
                className={`rounded-lg border p-4 transition-all duration-150 hover:shadow-sm ${typeConfig.cardClass}`}
              >
                <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                  <div className='flex-1'>
                    <div className='mb-2 flex items-center'>
                      <span
                        className={`mr-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeConfig.badgeClass}`}
                      >
                        {typeConfig.label}
                      </span>
                      <span className='flex items-center text-xs text-slate-500 dark:text-slate-400'>
                        <Users size={12} className='mr-1' />
                        {meeting.participants || 0} people
                      </span>
                    </div>
                    <h4 className='mb-1 font-medium text-slate-900 dark:text-white'>
                      {meeting.title}
                    </h4>
                    <div className='flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400'>
                      <span className='flex items-center'>
                        <Clock size={14} className='mr-1' />
                        {formatMeetingTime(meeting)}
                      </span>
                      <span className='flex items-center'>
                        <MapPin size={14} className='mr-1' />
                        {meeting.location || 'Online'}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      onClick={() =>
                        typeConfig.isReview
                          ? handleJoin(meeting)
                          : handleDetails(meetingId)
                      }
                      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm transition duration-150 ${
                        typeConfig.isReview
                          ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                          : 'border border-slate-300 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {typeConfig.isReview ? (
                        <>
                          <Video size={14} className='mr-1' /> Join
                        </>
                      ) : (
                        'Details'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-10 text-center dark:border-slate-700'>
            <CalendarIcon className='mb-3 h-8 w-8 text-slate-300 dark:text-slate-600 sm:h-10 sm:w-10' />
            <p className='text-sm font-semibold text-slate-600 dark:text-slate-300'>
              {emptyMessage || 'No upcoming meetings.'}
            </p>
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4'>
              There are no meetings on your calendar.
            </p>
            {userRole !== 'faculty' && (
              <button
                onClick={() => navigate('/meetings/new')}
                className='rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
              >
                Schedule Meeting
              </button>
            )}
          </div>
        )}
      </div>

      <div className='mt-6 border-t border-gray-200 pt-6 dark:border-slate-700'>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center'>
            <CalendarIcon size={16} className='mr-2 text-gray-400' />
            <span className='text-gray-600 dark:text-gray-400'>Total:</span>
            <span className='ml-1 font-medium text-gray-900 dark:text-white'>
              {meetings.length} meetings
            </span>
          </div>
          <Link
            to='/meetings/calendar'
            className='font-medium text-primary-600 hover:text-primary-700'
          >
            View calendar →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMeetings;
