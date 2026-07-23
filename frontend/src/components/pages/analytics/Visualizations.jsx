import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import api from '../../../utils/api';

const Visualizations = memo(() => {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(true);
  const [gradeBars, setGradeBars] = useState([]);
  const [performanceMonths, setPerformanceMonths] = useState([]);
  const [courseEnrollments] = useState([
    { course: 'Software Engineering', enrollment: 45, capacity: 50 },
    { course: 'Database Systems', enrollment: 40, capacity: 45 },
    { course: 'Web Development', enrollment: 35, capacity: 40 },
  ]);

  useEffect(() => {
    const fetchVisuals = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/dashboard');
        const data = response.data || {};

        // Map activityData to grade bars for visual similarity
        if (data.activityData) {
          setGradeBars(
            data.activityData.map((a) => ({
              label: a.label,
              value: a.value,
              color: a.color,
            }))
          );
        }

        if (data.performanceData) {
          setPerformanceMonths(data.performanceData);
        }
      } catch (error) {
        console.error('Failed to fetch visualization data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisuals();
  }, []);

  return (
    <div className='space-y-6 animate-fade-in p-4 md:p-6'>
      <PageHeader
        title='Data Visualizations'
        subtitle='Interactive graphical breakdowns and telemetry visualizations'
        icon={BarChart2}
        actions={
          <div className='flex items-center gap-1.5 rounded-xl bg-gray-100 p-1 dark:bg-slate-800'>
            {['bar', 'line', 'pie', 'radar'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                  chartType === type
                    ? 'bg-white text-indigo-600 shadow dark:bg-slate-700 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        }
      />

        {loading ? (
          <div className='p-8 text-center text-slate-500'>
            Loading visualizations...
          </div>
        ) : gradeBars.length === 0 ? (
          <div className='p-8 text-center text-slate-500'>
            No visualization data available.
          </div>
        ) : (
          <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Grade Distribution Chart */}
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Activity Distribution
              </h3>
              <div className='flex h-64 items-end justify-between'>
                {gradeBars.map((bar, index) => (
                  <div
                    key={index}
                    className='flex flex-1 flex-col items-center'
                  >
                    <div
                      className={`w-12 ${bar.color} rounded-t-lg transition-all duration-500`}
                      style={{ height: `${bar.value * 2}px` }}
                    ></div>
                    <div className='mt-2 text-center text-xs text-slate-600 dark:text-slate-400'>
                      {bar.label}
                    </div>
                    <div className='text-xs font-bold text-slate-500 dark:text-slate-400'>
                      {bar.value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Enrollment */}
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Course Enrollment
              </h3>
              <div className='space-y-4'>
                {courseEnrollments.map((course, index) => (
                  <div key={index}>
                    <div className='mb-1 flex justify-between text-sm text-slate-600 dark:text-slate-400'>
                      <span>{course.course}</span>
                      <span>
                        {course.enrollment}/{course.capacity}
                      </span>
                    </div>
                    <div className='h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
                      <div
                        className={`h-2 rounded-full ${
                          course.enrollment / course.capacity >= 0.9
                            ? 'bg-rose-500'
                            : course.enrollment / course.capacity >= 0.7
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${
                            (course.enrollment / course.capacity) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Trends */}
        <div className='mb-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          <h3 className='mb-6 text-lg font-semibold text-slate-900 dark:text-white'>
            Performance Trends Over Time
          </h3>
          <div className='flex h-64 items-end space-x-4'>
            {performanceMonths.map((month, index) => (
              <div key={index} className='flex flex-1 space-x-1'>
                <div
                  className='w-1/3 rounded-t bg-blue-500'
                  style={{ height: `${month.overall * 2}px` }}
                  title={`Overall: ${month.overall}%`}
                ></div>
                <div
                  className='w-1/3 rounded-t bg-emerald-500'
                  style={{ height: `${month.attendance * 2}px` }}
                  title={`Attendance: ${month.attendance}%`}
                ></div>
                <div
                  className='w-1/3 rounded-t bg-purple-500'
                  style={{ height: `${month.assignments * 2}px` }}
                  title={`Assignments: ${month.assignments}%`}
                ></div>
                <div className='absolute mt-2 text-xs text-slate-600 dark:text-slate-400'>
                  {month.month}
                </div>
              </div>
            ))}
          </div>
          <div className='mt-8 flex justify-center space-x-6'>
            <div className='flex items-center'>
              <div className='mr-2 h-3 w-3 rounded bg-blue-500'></div>
              <span className='text-sm text-slate-600 dark:text-slate-400'>
                Overall
              </span>
            </div>
            <div className='flex items-center'>
              <div className='mr-2 h-3 w-3 rounded bg-emerald-500'></div>
              <span className='text-sm text-slate-600 dark:text-slate-400'>
                Attendance
              </span>
            </div>
            <div className='flex items-center'>
              <div className='mr-2 h-3 w-3 rounded bg-purple-500'></div>
              <span className='text-sm text-slate-600 dark:text-slate-400'>
                Assignments
              </span>
            </div>
        </div>
      </div>
    </div>
  );
  });

Visualizations.displayName = 'Visualizations';

export default Visualizations;
