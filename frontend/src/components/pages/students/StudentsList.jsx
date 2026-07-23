import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import {
  User as UserIcon,
  Search as SearchIcon,
  Mail as MailIcon,
  Edit2 as EditIcon,
  Trash2 as TrashIcon,
  Calendar as CalendarIcon,
  Building as DeptIcon,
} from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import studentService from '../../../services/studentService';

const StudentRow = memo(({ student, onEdit, onDelete, userRole }) => (
  <tr className='group transition-colors hover:bg-gray-50 dark:hover:bg-slate-900/50'>
    {/* Roll Number */}
    <td className='whitespace-nowrap px-4 py-4'>
      <div className='font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400'>
        {student.rollNumber || <span className='text-gray-400 italic'>—</span>}
      </div>
      {student.enrollmentNumber && (
        <div className='font-mono text-[10px] text-gray-400 dark:text-slate-500'>
          {student.enrollmentNumber}
        </div>
      )}
    </td>

    {/* Full Name */}
    <td className='whitespace-nowrap px-4 py-4'>
      <div className='flex items-center gap-3'>
        <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100/50 text-indigo-600 dark:border-indigo-800 dark:from-indigo-900/30 dark:to-indigo-800/20 dark:text-indigo-400'>
          <UserIcon size={16} />
        </div>
        <div>
          <div className='text-sm font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white'>
            {student.name}
          </div>
          <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
            <MailIcon size={10} className='text-gray-400' />
            {student.email}
          </div>
        </div>
      </div>
    </td>

    {/* Department */}
    <td className='whitespace-nowrap px-4 py-4'>
      <div className='flex items-center gap-1.5'>
        <DeptIcon size={14} className='text-gray-400' />
        <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
          {student.department || <span className='italic text-gray-400'>—</span>}
        </span>
      </div>
    </td>

    {/* Semester / Year */}
    <td className='whitespace-nowrap px-4 py-4'>
      <div className='flex flex-col gap-0.5'>
        {student.semester && (
          <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>
            Sem {student.semester}
          </span>
        )}
        {student.year && (
          <span className='text-[10px] font-bold uppercase tracking-wide text-gray-400'>
            Year {student.year}
          </span>
        )}
      </div>
    </td>

    {/* Contact */}
    <td className='whitespace-nowrap px-4 py-4'>
      <span className='text-xs text-gray-600 dark:text-gray-400'>
        {student.phone && student.phone !== 'N/A' ? student.phone : <span className='italic text-gray-400'>—</span>}
      </span>
    </td>

    {/* Status */}
    <td className='whitespace-nowrap px-4 py-4'>
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
          student.status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}
      >
        {student.status || 'Active'}
      </span>
    </td>

    {/* Actions — Edit + Delete only */}
    <td className='whitespace-nowrap px-4 py-4 text-right text-sm'>
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
            className='rounded-xl p-2 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30'
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
      const matchesYear = year === '' || student.year === year;
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
    <div className='space-y-6 p-4 md:p-6'>
      <div className='flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-xl font-bold uppercase tracking-tight text-gray-900 dark:text-white'>
            Student Directory
          </h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Manage active student profiles and academic records
          </p>
        </div>
      </div>

      {/* Basic Filter Toolbar */}
      <div className='card'>
        <div className='card-body flex flex-wrap items-center gap-4'>
          <div className='group relative min-w-[280px] flex-1'>
            <SearchIcon
              size={18}
              className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500'
            />
            <div className='absolute left-12 top-1/2 z-10 h-5 w-[1px] -translate-y-1/2 bg-gray-200 dark:bg-slate-700' />
            <input
              type='text'
              placeholder='Search by name, email or ID...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='form-control border-gray-100 bg-gray-50/50 pl-16 transition-all focus:bg-white dark:border-slate-800 dark:bg-slate-900/50'
            />
          </div>

          <div className='group relative w-56'>
            <DeptIcon
              size={16}
              className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500'
            />
            <div className='absolute left-12 top-1/2 z-10 h-5 w-[1px] -translate-y-1/2 bg-gray-200 dark:bg-slate-700' />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className='form-control appearance-none border-gray-100 bg-gray-50/50 pl-16 dark:border-slate-800 dark:bg-slate-900/50'
            >
              <option value=''>All Departments</option>
              <option value='Computer Science'>Computer Science</option>
              <option value='Information Technology'>
                Information Technology
              </option>
              <option value='Electronics'>Electronics</option>
            </select>
          </div>

          <div className='group relative w-48'>
            <CalendarIcon
              size={16}
              className='pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500'
            />
            <div className='absolute left-12 top-1/2 z-10 h-5 w-[1px] -translate-y-1/2 bg-gray-200 dark:bg-slate-700' />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className='form-control appearance-none border-gray-100 bg-gray-50/50 pl-16 dark:border-slate-800 dark:bg-slate-900/50'
            >
              <option value=''>All Years</option>
              <option value='1'>1st Year</option>
              <option value='2'>2nd Year</option>
              <option value='3'>3rd Year</option>
              <option value='4'>Final Year</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearch('');
              setDepartment('');
              setYear('');
            }}
            className='btn btn-secondary px-6'
          >
            Reset
          </button>
        </div>
      </div>

      {/* Standard Table View */}
      <div className='table-container shadow-sm'>
        <table className='table'>
          <thead>
            <tr className='bg-gray-50/50 dark:bg-slate-900/50'>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Roll No.
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Full Name
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Department
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Semester
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Contact
              </th>
              <th className='px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Status
              </th>
              <th className='px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
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
                  colSpan='7'
                  className='py-20 text-center font-medium italic text-gray-400'
                >
                  {loading ? (
                    'Accessing student archives...'
                  ) : error ? (
                    <span className='text-red-500'>{error}</span>
                  ) : (
                    'No matching records found in the registry.'
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Outlet />
    </div>
  );
});

StudentsList.displayName = 'StudentsList';
export default StudentsList;
