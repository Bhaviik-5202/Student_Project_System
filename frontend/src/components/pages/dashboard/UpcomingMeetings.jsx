import { Link } from 'react-router-dom';
import {
  Plus,
  Users,
  Clock,
  MapPin,
  Video,
  MoreHorizontal,
  Calendar as CalendarIcon,
} from 'lucide-react';

const UpcomingMeetings = ({ meetings = [], userRole }) => {
  return (
    <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
            Upcoming Meetings
          </h3>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Your scheduled meetings and events
          </p>
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
          meetings.map((meeting, index) => (
            <div
              key={index}
              className={`rounded-lg border p-4 transition-all duration-150 hover:shadow-sm ${
                meeting.type === 'review'
                  ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30'
                  : meeting.type === 'faculty'
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/30'
              }`}
            >
              <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center'>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        meeting.type === 'review'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : meeting.type === 'faculty'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                      } mr-3`}
                    >
                      {meeting.type === 'review'
                        ? 'Project Review'
                        : meeting.type === 'faculty'
                          ? 'Faculty Meeting'
                          : 'Weekly Sync'}
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
                      {meeting.time}
                    </span>
                    <span className='flex items-center'>
                      <MapPin size={14} className='mr-1' />
                      {meeting.location}
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    className={`rounded-lg px-3 py-1.5 text-sm transition duration-150 ${
                      meeting.type === 'review'
                        ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {meeting.type === 'review' ? (
                      <>
                        <Video size={14} className='mr-1' /> Join
                      </>
                    ) : (
                      'Details'
                    )}
                  </button>
                  <button className='rounded-lg p-1.5 text-slate-400 transition duration-150 hover:bg-white hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300'>
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='rounded-lg border border-dashed border-slate-200 py-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400'>
            No upcoming meetings found.
          </div>
        )}
      </div>

      {/* Meeting Stats */}
      <div className='mt-6 border-t border-gray-200 pt-6'>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center'>
            <CalendarIcon size={16} className='mr-2 text-gray-400' />
            <span className='text-gray-600'>Total:</span>
            <span className='ml-1 font-medium text-gray-900'>
              {meetings.length} meetings
            </span>
          </div>
          <Link
            to='/meetings'
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
