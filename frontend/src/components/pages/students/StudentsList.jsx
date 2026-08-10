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
import { subscribeDataChanged } from '../../../utils/eventBus';
import PageHeader from '../../common/PageHeader';

const MobileStudentCard = memo(({ student, onEdit, onDelete, userRole }) => (
  <div className='flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
    <div className='flex items-start justify-between gap-3'>
      <div className='flex items-center gap-3'>
        {student.avatar ? (
          <img
            src={student.avatar}
            alt={student.name}
            className='h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700'
          />
        ) : (
          <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 text-lg font-black text-indigo-600 dark:from-indigo-950/60 dark:to-indigo-900/40 dark:text-indigo-400'>
            {student.name ? (
              student.name.charAt(0).toUpperCase()
            ) : (
              <UserIcon size={20} />
            )}
          </div>
        )}
        <div className='flex flex-col'>
          <div className='text-[15px] font-black text-slate-900 dark:text-white leading-tight'>
            {student.name}
          </div>
          <div className='text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5'>
            {student.rollNumber || `STU-2026-001`}
          </div>
        </div>
      </div>
      <span
        className={`inline-flex shrink-0 items-center rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
          student.status === 'Active'
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
            : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
        }`}
      >
        {student.status || 'Active'}
      </span>
    </div>

    <div className='mt-2 flex flex-col gap-2 rounded-xl bg-slate-50/50 p-3 dark:bg-slate-800/40'>
      <div className='flex items-center gap-2 text-[12px] font-semibold text-slate-700 dark:text-slate-300'>
        <MailIcon size={14} className='text-slate-400' />
        <span className='truncate'>{student.email}</span>
      </div>
      <div className='flex items-center gap-2 text-[12px] font-semibold text-slate-700 dark:text-slate-300'>
        <DeptIcon size={14} className='text-slate-400' />
        <span className='truncate'>
          {student.department || 'Computer Engineering'}
        </span>
      </div>
      <div className='flex items-center justify-between mt-1'>
        <div className='flex items-center gap-1.5 flex-wrap'>
          <span className='rounded-md bg-white px-2 py-1 text-[10px] font-bold text-slate-600 shadow-sm dark:bg-slate-700 dark:text-slate-300'>
            {student.semester
              ? student.semester.startsWith('Sem')
                ? student.semester
                : `Sem ${student.semester}`
              : 'Sem 1'}
          </span>
          <span className='rounded-md bg-white px-2 py-1 text-[10px] font-bold text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400'>
            {student.academicYear || '2024-25'}
          </span>
        </div>
        {userRole === 'admin' && (
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onEdit(student.id)}
              className='flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform active:scale-90 dark:bg-indigo-500/20 dark:text-indigo-400'
            >
              <EditIcon size={18} />
            </button>
            <button
              onClick={() => onDelete(student.id)}
              className='flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-transform active:scale-90 dark:bg-rose-500/20 dark:text-rose-400'
            >
              <TrashIcon size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
));

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
          <img
            src={student.avatar}
            alt={student.name}
            className='h-9 w-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700'
          />
        ) : (
          <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100/50 font-bold text-indigo-600 dark:border-indigo-800/40 dark:from-indigo-950/60 dark:to-indigo-900/40 dark:text-indigo-400'>
            {student.name ? (
              student.name.charAt(0).toUpperCase()
            ) : (
              <UserIcon size={16} />
            )}
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

    {/* Semester / Academic Year */}
    <td className='whitespace-nowrap px-6 py-4'>
      <div className='flex flex-col gap-0.5'>
        <span className='text-xs font-bold text-slate-800 dark:text-slate-200'>
          {student.semester
            ? student.semester.startsWith('Sem')
              ? student.semester
              : `Sem ${student.semester}`
            : 'Sem 1'}
        </span>
        <span className='text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
          {student.academicYear || '2024-25'}
        </span>
      </div>
    </td>

    {/* Contact Number */}
    <td className='whitespace-nowrap px-6 py-4'>
      <span className='text-xs text-slate-600 dark:text-slate-400'>
        {student.phone && student.phone !== 'N/A' ? (
          student.phone
        ) : (
          <span className='italic text-slate-400'>—</span>
        )}
      </span>
    </td>

    {/* Status */}
    <td className='whitespace-nowrap px-6 py-4'>
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
          student.status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50'
            : 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/50'
        }`}
      >
        {student.status || 'Active'}
      </span>
    </td>

    {/* Registration Date */}
    <td className='whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400'>
      {new Date(
        student.registrationDate || student.createdAt || Date.now()
      ).toLocaleDateString(undefined, { dateStyle: 'medium' })}
    </td>

    {/* Actions */}
    <td className='whitespace-nowrap px-3 py-3 sm:px-6 sm:py-4 text-right text-sm'>
      {userRole === 'admin' && (
        <div className='flex justify-end gap-1.5 opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100'>
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
  const userRole = user?.role;
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

  const fetchStudents = useCallback(async () => {
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
            academicYear: student.academicYear || '',
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
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Auto-refresh when any student or user CRUD event fires
  useEffect(() => {
    const unsubscribe = subscribeDataChanged((detail) => {
      if (
        detail?.type === 'student_updated' ||
        detail?.type === 'student_deleted' ||
        detail?.type === 'user_changed'
      ) {
        fetchStudents();
      }
    });
    return () => unsubscribe();
  }, [fetchStudents]);

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
        actions={
          userRole === 'admin' && (
            <button
              onClick={() => navigate('/user-management/new')}
              className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition'
            >
              <PlusIcon size={16} /> Add User / Student
            </button>
          )
        }
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
              className='w-full rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/60 py-2.5 !pl-14 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:placeholder-slate-500 dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
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
              className='w-full cursor-pointer appearance-none rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/60 py-2.5 !pl-14 pr-10 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
            >
              <option value=''>All Departments</option>
              <option value='Computer Engineering'>Computer Engineering</option>
              <option value='Information Technology'>
                Information Technology
              </option>
              <option value='Electronics & Communication'>
                Electronics & Communication
              </option>
              <option value='Mechanical Engineering'>
                Mechanical Engineering
              </option>
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
              className='w-full cursor-pointer appearance-none rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/60 py-2.5 !pl-14 pr-10 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
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

      {/* Modern Table Container - Desktop/Tablet Only */}
      <div className='hidden md:block overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 shadow-xs backdrop-blur-sm dark:border-slate-800 '>
        <div className='table-responsive overflow-x-auto'>
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
                      <span className='text-rose-500 font-semibold'>
                        {error}
                      </span>
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

      {/* Mobile Card Layout */}
      <div className='block md:hidden space-y-4'>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <MobileStudentCard
              key={student.id}
              student={student}
              onEdit={handleEdit}
              onDelete={handleDelete}
              userRole={user?.role}
            />
          ))
        ) : (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-12 px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
            {loading ? (
              <div className='flex flex-col items-center gap-3'>
                <div className='h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent' />
                <span className='text-[13px] font-semibold text-slate-500'>
                  Accessing directory...
                </span>
              </div>
            ) : (
              <>
                <UsersIcon className='mb-3 h-10 w-10 text-slate-300 dark:text-slate-600' />
                <span className='text-[13px] font-semibold text-slate-500'>
                  {error ? (
                    <span className='text-rose-500'>{error}</span>
                  ) : (
                    'No matching records found.'
                  )}
                </span>
              </>
            )}
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
});

StudentsList.displayName = 'StudentsList';
export default StudentsList;
