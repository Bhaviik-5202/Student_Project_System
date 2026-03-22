import React, { memo, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Coffee,
  Layout,
  ArrowRight,
} from 'lucide-react';
import courseService from '../../../services/courseService';

const CourseSchedule = memo(() => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days.includes(today) ? today : 'Monday';
  });

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await courseService.getMyCourses();
        if (response?.success && Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error('Error fetching schedule', error);
        toast.error('Failed to load your schedule');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const todaySchedule = useMemo(() => {
    if (!Array.isArray(courses)) return [];

    const dayShort = selectedDay.substring(0, 3);

    return courses
      .filter((c) => {
        if (!c) return false;
        const schedule = String(c.schedule || '');
        return schedule.includes(dayShort);
      })
      .map((c) => {
        const scheduleStr = String(c.schedule || '');
        const parts = scheduleStr.split(' ');
        const timePart = parts.length > 1 ? parts.slice(1).join(' ') : 'TBA';

        return {
          id: c.id || c._id,
          name: c.name || c.title || 'Untitled Module',
          code: c.code || 'N/A',
          time: timePart,
          room: c.room || 'Digital Library',
          faculty: c.faculty?.name || c.instructor || 'Visiting Professor',
        };
      });
  }, [courses, selectedDay]);

  const totalCredits = useMemo(() => {
    if (!Array.isArray(courses)) return 0;
    return courses.reduce((acc, c) => acc + (Number(c?.credits) || 0), 0);
  }, [courses]);

  if (loading) {
    return (
      <div className='course-loading-container'>
        <div className='course-spinner'></div>
        <p className='course-loading-text'>Compiling timetable...</p>
      </div>
    );
  }

  return (
    <div className='course-page'>
      <div className='course-header'>
        <div>
          <h1 className='course-title'>Academic Schedule</h1>
          <p className='course-subtitle'>
            Weekly lecture and laboratory timetables
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            className='course-card-simple'
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontWeight: '700', fontSize: '14px' }}>
              {new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
              })}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`course-btn ${selectedDay === day ? 'course-btn-primary' : 'course-btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '8px 24px' }}
          >
            {day}
          </button>
        ))}
      </div>

      <div className='course-details-grid'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
              {selectedDay} Modules
            </h3>
          </div>

          {todaySchedule.length === 0 ? (
            <div
              className='course-card-simple'
              style={{ textAlign: 'center', padding: '64px' }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
                No lectures today
              </h3>
              <p style={{ color: 'var(--course-text-muted)' }}>
                Enjoy your break or catch up on self-study.
              </p>
            </div>
          ) : (
            todaySchedule.map((item, index) => (
              <div key={item.id || index} className='course-schedule-grid'>
                <div className='course-schedule-time'>
                  {item.time.split('-')[0].trim()}
                </div>
                <div className='course-schedule-event'>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <span
                        className='course-badge course-badge-blue'
                        style={{ marginBottom: '4px' }}
                      >
                        {item.code}
                      </span>
                      <h4 style={{ fontWeight: '700', fontSize: '16px' }}>
                        {item.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => navigate(`/courses/${item.id}`)}
                      className='course-btn course-btn-secondary'
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Enter <ArrowRight className='ml-1 h-4 w-4' />
                    </button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      fontSize: '12px',
                      color: 'var(--course-text-muted)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <MapPin className='h-4 w-4' /> {item.room}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <User className='h-4 w-4' /> {item.faculty}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className='course-card-simple'>
            <h3
              style={{
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--course-text-muted)',
                marginBottom: '20px',
              }}
            >
              Semester Overview
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  padding: '12px',
                  borderRadius: '12px',
                }}
                className='dark:bg-white/5'
              >
                <span style={{ fontSize: '13px', fontWeight: '600' }}>
                  Active Modules
                </span>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: 'var(--course-primary)',
                  }}
                >
                  {courses.length}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  padding: '12px',
                  borderRadius: '12px',
                }}
                className='dark:bg-white/5'
              >
                <span style={{ fontSize: '13px', fontWeight: '600' }}>
                  Total Units
                </span>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: 'var(--course-primary)',
                  }}
                >
                  {totalCredits}
                </span>
              </div>
            </div>
          </div>

          <div className='course-card-simple'>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--course-border)',
              }}
            >
              Quick Actions
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <button
                onClick={() => navigate('/courses/catalog')}
                className='course-btn course-btn-secondary'
                style={{ justifyContent: 'space-between', width: '100%' }}
              >
                Browse Catalog <ArrowRight className='h-4 w-4' />
              </button>
              <button
                onClick={() => navigate('/courses/register')}
                className='course-btn course-btn-secondary'
                style={{ justifyContent: 'space-between', width: '100%' }}
              >
                Enrollment <ArrowRight className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseSchedule.displayName = 'CourseSchedule';

export default CourseSchedule;
