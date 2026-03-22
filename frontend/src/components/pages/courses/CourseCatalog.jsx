import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  User,
  Clock,
  Plus,
  GraduationCap,
  Info,
  Layers,
} from 'lucide-react';
import courseService from '../../../services/courseService';
import { useAuth } from '../../../hooks/useAuth';

const CourseCard = memo(({ course }) => {
  const navigate = useNavigate();

  return (
    <div className='card flex h-full flex-col transition-shadow hover:shadow-md'>
      <div className='card-header flex items-start justify-between pb-2'>
        <div className='flex items-center gap-2'>
          <BookOpen className='h-5 w-5 text-indigo-500' />
          <span className='text-xs font-semibold uppercase tracking-wider text-gray-500'>
            {course.code}
          </span>
        </div>
        <span className='badge badge-secondary text-[10px]'>
          {course.semester || 'Current Term'}
        </span>
      </div>

      <div className='card-body flex-1'>
        <h3 className='mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white'>
          {course.name || course.title}
        </h3>
        <p className='mb-4 line-clamp-2 text-sm text-gray-500 dark:text-gray-400'>
          {course.description || 'Course description not available.'}
        </p>

        <div className='space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800'>
          <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
            <User className='h-4 w-4' />
            <span>
              {course.faculty?.name || course.instructor || 'Visiting Faculty'}
            </span>
          </div>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2 font-medium text-gray-600 dark:text-gray-300'>
              <GraduationCap className='h-4 w-4 text-indigo-500' />
              <span>{course.credits || 0} Credits</span>
            </div>
            <div className='flex items-center gap-2 text-gray-500'>
              <Clock className='h-4 w-4 text-gray-400' />
              <span>{course.schedule?.split(' ')[0] || 'Flexible'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-auto border-t border-gray-50 p-4 dark:border-gray-800'>
        <button
          onClick={() => navigate(`/courses/${course.id || course._id}`)}
          className='btn btn-primary flex w-full items-center justify-center gap-2'
        >
          <Info className='h-4 w-4' /> View Details
        </button>
      </div>
    </div>
  );
});

CourseCard.displayName = 'CourseCard';

const CourseCatalog = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getAllCourses();
        if (res?.success) {
          setCourses(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchLower = searchTerm.toLowerCase();
    const name = (course.name || course.title || '').toLowerCase();
    const code = (course.code || '').toLowerCase();
    const instructor = (
      course.faculty?.name ||
      course.instructor ||
      ''
    ).toLowerCase();

    return (
      name.includes(searchLower) ||
      code.includes(searchLower) ||
      instructor.includes(searchLower)
    );
  });

  const canAddCourse = user?.role === 'admin' || user?.role === 'faculty';

  return (
    <div className='course-page animate-fade-in'>
      {/* Header Section (Standardized with Project Catalog style) */}
      <div className='flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center'>
        <div className='flex items-center gap-5'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Academic Catalog
            </h1>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Explore and register for available modules
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-4'>
          <div className='group relative max-w-sm'>
            <Search
              size={18}
              className='absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500'
            />
            <div className='absolute left-12 top-1/2 z-10 h-5 w-[1px] -translate-y-1/2 bg-gray-200 dark:bg-slate-700' />
            <input
              type='text'
              placeholder='Filter modules...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='form-control h-11 border-gray-100 bg-gray-100/50 pl-16 text-sm transition-all focus:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-800'
            />
          </div>
          {canAddCourse && (
            <button
              onClick={() => navigate('/courses/new')}
              className='btn btn-secondary'
            >
              <Plus size={18} /> New Module
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className='course-loading-container'>
          <div className='course-spinner'></div>
          <p className='course-loading-text'>Syncing course catalog...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div
          className='course-card-simple'
          style={{
            textAlign: 'center',
            padding: '48px',
            maxWidth: '512px',
            margin: '40px auto',
          }}
        >
          <h3
            style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}
          >
            No Modules Found
          </h3>
          <p style={{ color: 'var(--course-text-muted)' }}>
            Try adjusting your search for "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className='course-grid'>
          {filteredCourses.map((course) => (
            <div
              key={course.id || course._id}
              className='course-card-simple course-card-details'
            >
              <div className='course-card-header'>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <BookOpen
                    className='course-icon-md'
                    style={{ color: 'var(--course-primary)' }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--course-text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {course.code}
                  </span>
                </div>
                <span className='course-badge course-badge-gray'>
                  {course.semester || 'Current Term'}
                </span>
              </div>

              <div className='course-card-body'>
                <h3 className='course-card-title'>
                  {course.name || course.title}
                </h3>
                <p
                  style={{
                    color: 'var(--course-text-muted)',
                    fontSize: '14px',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {course.description || 'Course description not available.'}
                </p>

                <div
                  style={{
                    paddingTop: '16px',
                    borderTop: '1px solid var(--course-border)',
                  }}
                >
                  <div className='course-card-info-row'>
                    <User className='h-4 w-4' />
                    <span>
                      {course.faculty?.name ||
                        course.instructor ||
                        'Visiting Faculty'}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '8px',
                    }}
                  >
                    <div className='course-card-info-row'>
                      <GraduationCap
                        className='h-4 w-4'
                        style={{ color: 'var(--course-primary)' }}
                      />
                      <span style={{ fontWeight: '600' }}>
                        {course.credits || 0} Credits
                      </span>
                    </div>
                    <div className='course-card-info-row'>
                      <Clock className='h-4 w-4' />
                      <span>
                        {course.schedule?.split(' ')[0] || 'Flexible'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--course-border)',
                }}
              >
                <button
                  onClick={() =>
                    navigate(`/courses/${course.id || course._id}`)
                  }
                  className='course-btn course-btn-primary'
                  style={{ width: '100%' }}
                >
                  <Info className='h-4 w-4' /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

CourseCatalog.displayName = 'CourseCatalog';

export default CourseCatalog;
