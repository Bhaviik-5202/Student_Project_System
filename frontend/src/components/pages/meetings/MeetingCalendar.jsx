import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import meetingService from '../../../services/meetingService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import PageHeader from '../../common/PageHeader';
import '../../../assets/styles/meetings.css';

const MeetingCalendar = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    const res = await meetingService.getAllMeetings();
    if (res.success) {
      setMeetings(res.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    // Previous month filler
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        month: 'prev',
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Current month days
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      days.push({ day: i, month: 'curr', date: new Date(year, month, i) });
    }

    // Next month filler
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, month: 'next', date: new Date(year, month + 1, i) });
    }

    return days;
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getMeetingsForDate = useCallback(
    (date) => {
      return meetings.filter((m) => {
        if (!m.date) return false;
        const mDate = new Date(m.date);
        return mDate.toDateString() === date.toDateString();
      });
    },
    [meetings]
  );

  const changeMonth = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );
  };

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='Meeting Calendar'
        subtitle='Track and schedule project review sessions'
        icon={CalendarIcon}
        actions={
          user?.role === 'admin' && (
            <button
              onClick={() => navigate('/meetings/new')}
              className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all dark:shadow-none'
            >
              <Plus className='h-4 w-4' />
              Schedule New Meeting
            </button>
          )
        }
      />

      <div className='meeting-card'>
        {/* Calendar Controls */}
        <div className='meeting-card-header'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
            {monthName} <span className='text-indigo-600'>{year}</span>
          </h2>
          <div className='flex gap-2'>
            <button
              onClick={() => changeMonth(-1)}
              className='meeting-btn meeting-btn-secondary p-2'
            >
              <ChevronLeft className='h-5 w-5' />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className='meeting-btn meeting-btn-secondary text-xs font-bold uppercase tracking-widest'
            >
              Today
            </button>
            <button
              onClick={() => changeMonth(1)}
              className='meeting-btn meeting-btn-secondary p-2'
            >
              <ChevronRight className='h-5 w-5' />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className='meeting-calendar-grid'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className='bg-gray-50 p-4 text-center dark:bg-slate-900/50'
            >
              <span className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                {day}
              </span>
            </div>
          ))}

          {daysInMonth.map((item, index) => {
            const dayMeetings = getMeetingsForDate(item.date);
            const isToday =
              item.date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`meeting-calendar-day ${item.month !== 'curr' ? 'inactive' : ''} ${isToday ? 'selected' : ''}`}
              >
                <div className='mb-2 flex items-start justify-between'>
                  <span
                    className={`text-sm font-bold ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}
                  >
                    {item.day}
                  </span>
                  {dayMeetings.length > 0 && (
                    <span className='h-1.5 w-1.5 rounded-full bg-indigo-500'></span>
                  )}
                </div>

                <div className='space-y-1'>
                  {dayMeetings.slice(0, 2).map((m, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/meetings/${m._id || m.id}`)}
                      className='cursor-pointer truncate rounded border border-indigo-100 bg-indigo-50 p-1 text-[9px] font-bold text-indigo-600 transition-colors hover:bg-indigo-100 dark:border-indigo-800/30 dark:bg-indigo-900/20 dark:text-indigo-400'
                    >
                      {m.time ? `${m.time} ${m.title}` : m.title}
                    </div>
                  ))}
                  {dayMeetings.length > 2 && (
                    <div className='pl-1 text-[9px] font-bold text-gray-400'>
                      +{dayMeetings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

MeetingCalendar.displayName = 'MeetingCalendar';
export default MeetingCalendar;
