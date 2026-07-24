import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import {
  User as UserIcon,
  Users as UsersIcon,
  Search as SearchIcon,
  Mail as MailIcon,
  Edit2 as EditIcon,
  Trash2 as TrashIcon,
  Calendar as CalendarIcon,
  Building as DeptIcon,
  Plus as PlusIcon,
  RotateCcw as ResetIcon,
  X as ClearIcon,
  Filter as FilterIcon,
} from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import studentService from '../../../services/studentService';
import PageHeader from '../../common/PageHeader';

const StudentRow = memo(({ student, onEdit, onDelete, userRole }) => (
  <tr className='group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-900/50'>
    {/* Roll Number & Enrollment */}
    <td className='whitespace-nowrap px-6 py-4'>
      <div className='font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400'>
        {student.rollNumber || `STU-2026-001`}
      </div>
      {student.enrollmentNumber && (
        <div className='font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500 dark:text-slate-400'>
          {student.enrollmentNumber}
        </div>
      )}
    </td>

    {/* Full Name & Avatar */}
    <td className='whitespace-nowrap px-6 py-4'>
      <div className='flex items-center gap-3'>
        {student.avatar ? (
          <img src={student.avatar} alt={student.name} className='h-9 w-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700' />
        ) : (
          <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100/50 font-bold text-indigo-600 dark:border-indigo-800/40 dark:from-indigo-950/60 dark:to-indigo-900/40 dark:text-indigo-400'>
            {student.name ? student.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
          </div>
        )}
        <div>
          <div className='text-sm font-bold text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600  dark:group-hover:text-indigo-400'>
            {student.name}
          </div>
          <div className='flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400'>
            <MailIcon size={12} className='text-slate-400' />
            {student.email}
          </div>
        </div>
      </div>
    </td>

    {/* Department */}
    <td className='whitespace-nowrap px-6 py-4'>
      <div className='flex items-center gap-1.5'>
        <DeptIcon size={14} className='text-indigo-500 dark:text-indigo-400' />
        <span className='text-sm font-semibold text-slate-700 dark:text-slate-300'>
          {student.department || 'Computer Engineering'}
        </span>
      </div>
    </td>

    {/* Semester / Year */}
    <td className='whitespace-nowrap px-6 py-4'>
      <div className='flex flex-col gap-0.5'>
        <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
          {student.semester ? (student.semester.startsWith('Sem') ? student.semester : `Sem ${student.semester}`) : 'Sem 1'}
        </span>
        <span className='text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
          Year {student.year || 1}
        </span>
      </div>
    </td>

    {/* Contact Number */}
    <td className='whitespace-nowrap px-6 py-4'>
      <span className='text-xs text-slate-600 dark:text-slate-400'>
        {student.phone && student.phone !== 'N/A' ? student.phone : <span className='italic text-slate-400'>—</span>}
      </span>
    </td>

    {/* Status */}
    <td className='whitespace-nowrap px-6 py-4'>
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${student.status === 'Active'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50'
          : 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/50'
          }`}
      >
        {student.status || 'Active'}
      </span>
    </td>

    {/* Registration Date */}
    <td className='whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400'>
      {new Date(student.registrationDate || student.createdAt || Date.now()).toLocaleDateString(undefined, { dateStyle: 'medium' })}
    </td>

    {/* Actions */}
    <td className='whitespace-nowrap px-6 py-4 text-right text-sm'>
      {userRole !== 'faculty' && (
        <div className='flex justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100'>
          <button
            onClick={() => onEdit(student.id)}
            className='rounded-xl p-2 text-indigo-600 transition-all hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30'
            title='Edit Student'
          >
            <EditIcon size={15} />
          </button>
          <button
            onClick={() => onDelete(student.id)}
            className='rounded-xl p-2 text-rose-600 transition-all hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30'
            title='Delete Student'
          >
            <TrashIcon size={15} />
          </button>
        </div>
      )}
    </td>
  </tr>
));

const StudentsList = memo(() => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const name = student.name || '';
      const email = student.email || '';
      const id = student.id || '';

      const matchesSearch =
        search === '' ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        id.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        department === '' || student.department === department;
      const matchesYear = year === '' || String(student.year) === String(year);
      return matchesSearch && matchesDepartment && matchesYear;
    });
  }, [students, search, department, year]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await studentService.getAllStudents();
        if (res.success) {
          setStudents(
            (res.data || []).map((student) => ({
              id: student._id || student.id,
              name: student.name,
              rollNumber: student.rollNumber || student.studentId || '',
              enrollmentNumber: student.enrollmentNumber || '',
              department: student.department,
              semester: student.semester || '',
              year: student.year,
              email: student.email,
              phone: student.phone || '',
              status: student.status || 'Active',
            }))
          );
        } else {
          setError(res.message || 'Failed to load students');
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleEdit = useCallback(
    (id) => {
      navigate(`/students/${id}/edit`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (
        !window.confirm('Are you sure you want to delete this student record?')
      )
        return;

      const toastId = toast.loading('Deleting record...');
      const res = await studentService.deleteStudent(id);

      if (res.success) {
        setStudents(students.filter((s) => s.id !== id));
        toast.success('Student record deleted successfully', { id: toastId });
      } else {
        toast.error(res.message || 'Failed to delete student', { id: toastId });
      }
    },
    [students]
  );

  return (
    <div className='space-y-6 pt-0 pb-6'>
      <PageHeader
        title='Student Directory'
        subtitle='Manage active student profiles and academic records'
        icon={UsersIcon}
        badge={`${filteredStudents.length} Records`}
      />

      {/* Enhanced Filter Toolbar */}
      <div className='rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900/90 p-4 shadow-sm backdrop-blur-md dark:border-slate-800  sm:p-5'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          {/* Left Controls: Search Bar */}
          <div className='group relative min-w-[280px] flex-1'>
            <SearchIcon
              size={18}
              className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'
            />
            <div className='absolute left-11 top-1/2 z-10 h-5 w-[1px] -translate-y-1/2 bg-slate-200 dark:bg-slate-700' />
            <input
              type='text'
              placeholder='Search by name, email or roll number...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/60 py-2.5 pl-14 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:placeholder-slate-500 dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className='absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 dark:bg-slate-700/50 hover:text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                title='Clear search'
              >
                <ClearIcon size={14} />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className='group relative w-full sm:w-56'>
            <DeptIcon
              size={16}
              className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'
            />
            <div className='absolute left-11 top-1/2 z-10 h-5 w-[1px] -translate-y-1/2 bg-slate-200 dark:bg-slate-700' />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className='w-full cursor-pointer appearance-none rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/60 py-2.5 pl-14 pr-10 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
            >
              <option value=''>All Departments</option>
              <option value='Computer Engineering'>Computer Engineering</option>
              <option value='Information Technology'>Information Technology</option>
              <option value='Electronics & Communication'>Electronics & Communication</option>
              <option value='Mechanical Engineering'>Mechanical Engineering</option>
              <option value='Civil Engineering'>Civil Engineering</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className='group relative w-full sm:w-48'>
            <CalendarIcon
              size={16}
              className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'
            />
            <div className='absolute left-11 top-1/2 z-10 h-5 w-[1px] -translate-y-1/2 bg-slate-200 dark:bg-slate-700' />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className='w-full cursor-pointer appearance-none rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/60 py-2.5 pl-14 pr-10 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
            >
              <option value=''>All Years</option>
              <option value='1'>1st Year</option>
              <option value='2'>2nd Year</option>
              <option value='3'>3rd Year</option>
              <option value='4'>Final Year</option>
            </select>
          </div>

          {/* Reset Filters & Counter */}
          <div className='flex items-center gap-3'>
            {(search || department || year) && (
              <span className='inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40'>
                <FilterIcon size={12} className='mr-1' />
                Active
              </span>
            )}
            <button
              onClick={() => {
                setSearch('');
                setDepartment('');
                setYear('');
              }}
              disabled={!search && !department && !year}
              className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none dark:border-slate-700   dark:hover:bg-slate-700/80'
            >
              <ResetIcon size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className='overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 shadow-xs backdrop-blur-sm dark:border-slate-800 '>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left'>
            <thead>
              <tr className='border-b border-slate-200/80 bg-slate-50 dark:bg-slate-800/60 dark:border-slate-800 dark:bg-slate-900/80'>
                <th className='px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
                  Roll No.
                </th>
                <th className='px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
                  Full Name
                </th>
                <th className='px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
                  Department
                </th>
                <th className='px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
                  Semester
                </th>
                <th className='px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
                  Contact
                </th>
                <th className='px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
                  Status
                </th>
                <th className='px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
                  Reg. Date
                </th>
                <th className='px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/80'>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    userRole={user?.role}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan='8'
                    className='py-16 text-center text-sm font-medium italic text-slate-400 dark:text-slate-500 dark:text-slate-400'
                  >
                    {loading ? (
                      <div className='flex items-center justify-center gap-2'>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent' />
                        <span>Accessing student directory...</span>
                      </div>
                    ) : error ? (
                      <span className='text-rose-500 font-semibold'>{error}</span>
                    ) : (
                      'No matching records found in the directory.'
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Outlet />
    </div>
  );
});

StudentsList.displayName = 'StudentsList';
export default StudentsList;
