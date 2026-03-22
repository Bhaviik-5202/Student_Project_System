import { useState, useEffect, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { downloadCSV, convertToCSV } from '../../../utils/exportUtils';
import { toast } from 'react-hot-toast';

const GradeDistribution = memo(() => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/analytics/grades');
        setCourses(response.data || []);
      } catch (error) {
        console.error('Failed to fetch grade distribution', error);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleExport = () => {
    if (courses.length === 0) {
      toast.error('No data available to export');
      return;
    }

    const exportData = courses.map((course) => ({
      'Course Name': course.name || course.courseName,
      'Average Grade': `${course.avgGrade}%`,
      'Grade A': course.a || 0,
      'Grade B': course.b || 0,
      'Grade C': course.c || 0,
      'Grade D': course.d || 0,
      'Grade F': course.f || 0,
      'Total Students':
        (course.a || 0) +
        (course.b || 0) +
        (course.c || 0) +
        (course.d || 0) +
        (course.f || 0),
    }));

    const csvData = convertToCSV(exportData);
    downloadCSV(
      csvData,
      `Grade_Distribution_Report_${new Date().toISOString().split('T')[0]}.csv`
    );
    toast.success('Report exported successfully');
  };

  const [selectedCourse, setSelectedCourse] = useState(1);

  const selectedCourseData = useMemo(
    () => courses.find((c) => c.id === selectedCourse),
    [courses, selectedCourse]
  );

  const gradeItems = useMemo(
    () => [
      {
        grade: 'A (90-100%)',
        count: selectedCourseData?.a || 0,
        color: 'bg-emerald-500',
      },
      {
        grade: 'B (80-89%)',
        count: selectedCourseData?.b || 0,
        color: 'bg-blue-500',
      },
      {
        grade: 'C (70-79%)',
        count: selectedCourseData?.c || 0,
        color: 'bg-amber-500',
      },
      {
        grade: 'D (60-69%)',
        count: selectedCourseData?.d || 0,
        color: 'bg-orange-500',
      },
      {
        grade: 'F (Below 60%)',
        count: selectedCourseData?.f || 0,
        color: 'bg-rose-500',
      },
    ],
    [selectedCourseData]
  );

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              Grade Distribution
            </h1>
            <p className='text-slate-600 dark:text-slate-400'>
              View grade statistics across courses
            </p>
          </div>
          <button
            onClick={handleExport}
            className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
          >
            Export Report
          </button>
        </div>

        <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Course Selection */}
          <div className='lg:col-span-1'>
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>
                Select Course
              </h3>
              <div className='max-h-96 space-y-3 overflow-y-auto'>
                {coursesLoading ? (
                  <div className='py-4 text-center text-slate-500'>
                    Loading courses...
                  </div>
                ) : courses.length === 0 ? (
                  <div className='py-4 text-center text-slate-500'>
                    No course data found.
                  </div>
                ) : (
                  courses.map((course) => (
                    <button
                      key={course.id || course._id}
                      onClick={() => setSelectedCourse(course.id || course._id)}
                      className={`w-full rounded-lg p-4 text-left transition-colors ${
                        selectedCourse === (course.id || course._id)
                          ? 'border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                          : 'border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className='font-medium text-slate-900 dark:text-white'>
                        {course.name || course.courseName}
                      </div>
                      <div className='text-sm text-slate-600 dark:text-slate-400'>
                        Average Grade: {course.avgGrade}%
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Grade Distribution Chart */}
          <div className='lg:col-span-2'>
            <div className='rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
              <h3 className='mb-6 text-lg font-semibold text-slate-900 dark:text-white'>
                {selectedCourseData?.name} - Grade Distribution
              </h3>

              <div className='space-y-4'>
                {gradeItems.map((item, index) => {
                  const total =
                    (selectedCourseData?.a || 0) +
                    (selectedCourseData?.b || 0) +
                    (selectedCourseData?.c || 0) +
                    (selectedCourseData?.d || 0) +
                    (selectedCourseData?.f || 0);
                  const percentage =
                    total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;

                  return (
                    <div key={index}>
                      <div className='mb-1 flex justify-between text-sm text-slate-600 dark:text-slate-400'>
                        <span>{item.grade}</span>
                        <span>
                          {item.count} students ({percentage}%)
                        </span>
                      </div>
                      <div className='h-4 w-full rounded-full bg-slate-200 dark:bg-slate-700'>
                        <div
                          className={`h-4 rounded-full ${item.color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Statistics */}
              <div className='mt-8 border-t border-slate-200 pt-6 dark:border-slate-700'>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                      {selectedCourseData?.avgGrade}%
                    </div>
                    <div className='text-sm text-slate-600 dark:text-slate-400'>
                      Average Grade
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                      {(selectedCourseData?.a || 0) +
                        (selectedCourseData?.b || 0) +
                        (selectedCourseData?.c || 0)}
                    </div>
                    <div className='text-sm text-slate-600 dark:text-slate-400'>
                      Passing Students
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                      {selectedCourseData?.f || 0}
                    </div>
                    <div className='text-sm text-slate-600 dark:text-slate-400'>
                      Failed Students
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                      {selectedCourseData
                        ? selectedCourseData.a +
                          selectedCourseData.b +
                          selectedCourseData.c +
                          selectedCourseData.d +
                          selectedCourseData.f
                        : 0}
                    </div>
                    <div className='text-sm text-slate-600 dark:text-slate-400'>
                      Total Students
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

GradeDistribution.displayName = 'GradeDistribution';

export default GradeDistribution;
