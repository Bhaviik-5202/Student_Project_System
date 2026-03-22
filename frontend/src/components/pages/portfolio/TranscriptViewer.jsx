import React, { useState, useMemo, useCallback, useEffect } from 'react';
import api from '../../../utils/api';

const TranscriptViewer = () => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [viewMode, setViewMode] = useState('detailed');

  const [studentInfo, setStudentInfo] = useState({
    name: '',
    studentId: '',
    program: '',
    enrollmentDate: '',
    expectedGraduation: '',
    advisor: '',
    department: '',
  });
  const [academicYears, setAcademicYears] = useState([
    { id: 'all', name: 'All Years' },
  ]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await api.get('/portfolio/transcript');
        const data = response.data || {};
        if (data.studentInfo) setStudentInfo(data.studentInfo);
        if (data.academicYears)
          setAcademicYears([
            { id: 'all', name: 'All Years' },
            ...data.academicYears,
          ]);
        if (data.courses) setCourses(data.courses);
      } catch (error) {
        console.error('Failed to fetch transcript details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTranscript();
  }, []);

  const filteredCourses = useMemo(
    () =>
      selectedYear === 'all'
        ? courses
        : courses.filter((course) =>
            course.semester.includes(selectedYear.split('-')[0])
          ),
    [courses, selectedYear]
  );

  const calculateStats = useCallback(() => {
    const relevantCourses = selectedYear === 'all' ? courses : filteredCourses;
    const totalCredits = relevantCourses.reduce(
      (sum, course) => sum + course.credits,
      0
    );
    const totalPoints = relevantCourses.reduce(
      (sum, course) => sum + course.points * course.credits,
      0
    );
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    const gradeDistribution = {
      A: relevantCourses.filter((c) => c.grade === 'A').length,
      'A-': relevantCourses.filter((c) => c.grade === 'A-').length,
      'B+': relevantCourses.filter((c) => c.grade === 'B+').length,
      B: relevantCourses.filter((c) => c.grade === 'B').length,
      Other: relevantCourses.filter(
        (c) => !['A', 'A-', 'B+', 'B'].includes(c.grade)
      ).length,
    };

    return { totalCredits, gpa, gradeDistribution };
  }, [courses, filteredCourses, selectedYear]);

  const stats = useMemo(() => calculateStats(), [calculateStats]);

  const getGradeColor = useCallback((grade) => {
    switch (grade) {
      case 'A':
        return 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200';
      case 'A-':
        return 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-200';
      case 'B+':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200';
      case 'B':
        return 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200';
      case 'B-':
        return 'bg-amber-50 dark:bg-amber-900/50 text-amber-600 dark:text-amber-200';
      case 'C+':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200';
      case 'C':
        return 'bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-200';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownload = useCallback((format) => {
    alert(`Downloading transcript as ${format.toUpperCase()}`);
  }, []);

  if (loading)
    return (
      <div className='p-6 text-center text-slate-500'>
        Loading transcript...
      </div>
    );

  return (
    <div className='rounded-lg bg-white p-6 shadow dark:bg-slate-900'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex flex-col justify-between lg:flex-row lg:items-center'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>
              Academic Transcript
            </h2>
            <p className='mt-1 text-gray-600'>
              Official record of academic performance
            </p>
          </div>
          <div className='mt-4 flex items-center space-x-3 lg:mt-0'>
            <button
              onClick={handlePrint}
              className='rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50'
            >
              <i className='fas fa-print mr-2'></i>
              Print
            </button>
            <div className='relative'>
              <button className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
                <i className='fas fa-download mr-2'></i>
                Download
              </button>
              <div className='absolute right-0 mt-1 hidden w-40 rounded-lg border border-gray-200 bg-white shadow-lg'>
                {['PDF', 'Excel', 'CSV'].map((format) => (
                  <button
                    key={format}
                    onClick={() => handleDownload(format)}
                    className='block w-full px-4 py-2 text-left hover:bg-gray-50'
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <div className='text-sm text-gray-600'>Student Name</div>
            <div className='font-bold text-gray-800'>{studentInfo.name}</div>
          </div>
          <div className='rounded-lg bg-green-50 p-4'>
            <div className='text-sm text-gray-600'>Student ID</div>
            <div className='font-bold text-gray-800'>
              {studentInfo.studentId}
            </div>
          </div>
          <div className='rounded-lg bg-purple-50 p-4'>
            <div className='text-sm text-gray-600'>Program</div>
            <div className='font-bold text-gray-800'>{studentInfo.program}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className='mb-6 flex flex-col justify-between lg:flex-row lg:items-center'>
        <div className='mb-4 flex space-x-3 lg:mb-0'>
          {academicYears.map((year) => (
            <button
              key={year.id}
              onClick={() => setSelectedYear(year.id)}
              className={`rounded-lg px-4 py-2 ${
                selectedYear === year.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {year.name}
              {year.gpa && ` (GPA: ${year.gpa})`}
            </button>
          ))}
        </div>
        <div className='flex space-x-2'>
          <button
            onClick={() => setViewMode('detailed')}
            className={`rounded-lg px-4 py-2 ${
              viewMode === 'detailed'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Detailed View
          </button>
          <button
            onClick={() => setViewMode('summary')}
            className={`rounded-lg px-4 py-2 ${
              viewMode === 'summary'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Summary View
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className='mb-8'>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4'>
            <div className='text-2xl font-bold text-blue-600'>{stats.gpa}</div>
            <div className='text-sm text-gray-600'>Cumulative GPA</div>
          </div>
          <div className='rounded-lg bg-gradient-to-r from-green-50 to-green-100 p-4'>
            <div className='text-2xl font-bold text-green-600'>
              {stats.totalCredits}
            </div>
            <div className='text-sm text-gray-600'>Total Credits</div>
          </div>
          <div className='rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 p-4'>
            <div className='text-2xl font-bold text-purple-600'>
              {filteredCourses.length}
            </div>
            <div className='text-sm text-gray-600'>Courses Completed</div>
          </div>
          <div className='rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 p-4'>
            <div className='text-2xl font-bold text-yellow-600'>95%</div>
            <div className='text-sm text-gray-600'>Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      {viewMode === 'detailed' ? (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Course Code
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Course Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Semester
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Credits
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Grade
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Instructor
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {filteredCourses.map((course) => (
                <tr key={course.id} className='hover:bg-gray-50'>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>
                      {course.code}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-900'>{course.name}</div>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <div className='text-sm text-gray-900'>
                      {course.semester}
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <div className='text-sm text-gray-900'>
                      {course.credits}
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getGradeColor(
                        course.grade
                      )}`}
                    >
                      {course.grade} ({course.points})
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4'>
                    <span className='rounded-full bg-green-100 px-3 py-1 text-sm text-green-700'>
                      {course.status}
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                    {course.instructor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='space-y-6'>
          {academicYears
            .filter((year) => year.id !== 'all')
            .map((year) => {
              const yearCourses = courses.filter((course) =>
                course.semester.includes(year.id.split('-')[0])
              );
              const yearCredits = yearCourses.reduce(
                (sum, course) => sum + course.credits,
                0
              );
              const yearPoints = yearCourses.reduce(
                (sum, course) => sum + course.points * course.credits,
                0
              );
              const yearGPA =
                yearCredits > 0 ? (yearPoints / yearCredits).toFixed(2) : 0;

              return (
                <div
                  key={year.id}
                  className='rounded-lg border border-gray-200 p-4'
                >
                  <div className='mb-4 flex items-center justify-between'>
                    <h3 className='font-bold text-gray-800'>{year.name}</h3>
                    <div className='flex items-center space-x-4'>
                      <span className='text-sm text-gray-600'>
                        {yearCourses.length} courses
                      </span>
                      <span className='rounded-full bg-blue-100 px-3 py-1 text-blue-700'>
                        GPA: {yearGPA}
                      </span>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {yearCourses.map((course) => (
                      <div
                        key={course.id}
                        className='rounded-lg border border-gray-200 p-3'
                      >
                        <div className='mb-2 flex items-start justify-between'>
                          <div>
                            <div className='font-medium'>{course.code}</div>
                            <div className='text-sm text-gray-600'>
                              {course.name}
                            </div>
                          </div>
                          <span
                            className={`rounded px-2 py-1 text-xs ${getGradeColor(
                              course.grade
                            )}`}
                          >
                            {course.grade}
                          </span>
                        </div>
                        <div className='text-xs text-gray-500'>
                          {course.credits} credits • {course.instructor}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Grade Distribution */}
      <div className='mt-8 border-t border-gray-200 pt-6'>
        <h3 className='mb-4 text-lg font-bold text-gray-800'>
          Grade Distribution
        </h3>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <div>
            <h4 className='mb-3 font-medium text-gray-700'>By Grade</h4>
            <div className='space-y-3'>
              {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div
                      className={`h-8 w-8 ${getGradeColor(
                        grade
                      )} mr-3 flex items-center justify-center rounded-lg`}
                    >
                      {grade}
                    </div>
                    <span className='text-gray-700'>{grade}</span>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='h-2 w-32 overflow-hidden rounded-full bg-gray-200'>
                      <div
                        className={`h-full ${
                          getGradeColor(grade).split(' ')[0]
                        } rounded-full`}
                        style={{
                          width: `${(count / filteredCourses.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className='font-medium'>{count}</span>
                    <span className='text-gray-500'>
                      ({Math.round((count / filteredCourses.length) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className='mb-3 font-medium text-gray-700'>
              Academic Progress
            </h4>
            <div className='space-y-4'>
              <div>
                <div className='mb-1 flex justify-between text-sm'>
                  <span>Credit Completion</span>
                  <span>{stats.totalCredits} / 120 credits</span>
                </div>
                <div className='h-3 overflow-hidden rounded-full bg-gray-200'>
                  <div
                    className='h-full rounded-full bg-green-500'
                    style={{ width: `${(stats.totalCredits / 120) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className='mb-1 flex justify-between text-sm'>
                  <span>GPA Trend</span>
                  <span>3.8 → 3.6 → 3.7 → 3.5</span>
                </div>
                <div className='h-24 rounded-lg bg-gray-50 p-4'>
                  {/* Simple chart visualization */}
                  <div className='flex h-full items-end space-x-2'>
                    {[3.5, 3.7, 3.6, 3.8].map((gpa, index) => (
                      <div
                        key={index}
                        className='flex-1 rounded-t bg-gradient-to-t from-blue-500 to-blue-400'
                        style={{ height: `${gpa * 20}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Footer */}
      <div className='mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400'>
        <div className='flex justify-between'>
          <div>
            <p>Issued by: {studentInfo.department}</p>
            <p>Date of Issue: {new Date().toLocaleDateString()}</p>
          </div>
          <div className='text-right'>
            <p>Advisor: {studentInfo.advisor}</p>
            <p>Status: Active</p>
          </div>
        </div>
        <div className='mt-4 text-center'>
          <p>
            This is an unofficial transcript. Official transcripts require
            university seal.
          </p>
        </div>
      </div>
    </div>
  );
};

TranscriptViewer.displayName = 'TranscriptViewer';

export default React.memo(TranscriptViewer);
