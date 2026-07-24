import React, { useState, memo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  User as UserIcon,
  Mail as MailIcon,
  Hash as HashIcon,
  Phone as PhoneIcon,
  Building as DeptIcon,
  Calendar as CalendarIcon,
  X as XIcon,
  Save as SaveIcon,
  ArrowLeft as BackIcon,
  GraduationCap as AcademicIcon,
  ShieldCheck as VerifiedIcon,
} from 'lucide-react';
import studentService from '../../../services/studentService';
import PageHeader from '../../common/PageHeader';

const StudentForm = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: '',
    customDepartment: '',
    year: '',
    phone: '',
  });
  const [showCustomDept, setShowCustomDept] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        try {
          const res = await studentService.getStudentById(id);
          if (res.success && res.data) {
            setFormData({
              name: res.data.name || '',
              email: res.data.email || '',
              rollNumber: res.data.rollNumber || '',
              department: [
                'Computer Science',
                'Information Technology',
                'Electronics',
              ].includes(res.data.department)
                ? res.data.department
                : 'Other',
              customDepartment: ![
                'Computer Science',
                'Information Technology',
                'Electronics',
              ].includes(res.data.department)
                ? res.data.department
                : '',
              year: res.data.year || '',
              phone: res.data.phone || '',
            });
            setShowCustomDept(
              ![
                'Computer Science',
                'Information Technology',
                'Electronics',
              ].includes(res.data.department)
            );
          } else {
            toast.error('Failed to fetch student details');
            navigate('/students');
          }
        } catch (error) {
          toast.error('Error fetching student details');
          navigate('/students');
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'department') {
      setShowCustomDept(value === 'Other');
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const toastId = toast.loading('Updating profile...');

      try {
        const payload = {
          ...formData,
          department: showCustomDept
            ? formData.customDepartment
            : formData.department,
        };
        delete payload.customDepartment;

        const res = await studentService.updateStudent(id, payload);

        if (res.success) {
          toast.success('Student profile updated successfully!', {
            id: toastId,
          });
          navigate('/students');
        } else {
          toast.error(res.message || 'Failed to save record', { id: toastId });
        }
      } catch (error) {
        toast.error('Network error occurred', { id: toastId });
      }
    },
    [formData, id, navigate, showCustomDept]
  );

  if (loading) {
    return (
      <div className='flex min-h-[400px] flex-col items-center justify-center space-y-4 p-12'>
        <div className='h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400' />
        <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
          Retrieving student profile details...
        </p>
      </div>
    );
  }

  return (
    <div className='mb-20 animate-fade-in space-y-6 pt-0 pb-6'>
      <div className='mx-auto w-full max-w-3xl space-y-6'>
        <PageHeader
          title='Update Student Profile'
          subtitle={`Modifying academic profile for ${formData.name || 'Student'}`}
          icon={UserIcon}
          badge='Editing Mode'
          badgeVariant='warning'
          actions={
            <button
              onClick={() => navigate('/students')}
              className='inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-700   dark:hover:bg-slate-700'
            >
              <BackIcon size={16} />
              <span>Back to Directory</span>
            </button>
          }
        />

        {/* Upgraded Form Card */}
        <div className='overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 shadow-sm backdrop-blur-md dark:border-slate-800 '>
          {/* Top Form Banner Accent */}
          <div className='h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600' />

          <form onSubmit={handleSubmit} className='space-y-8 p-6 sm:p-10'>
            {/* Section 1: Personal Details */}
            <div className='space-y-5'>
              <div className='flex items-center gap-2.5 border-b border-slate-100 pb-3 dark:border-slate-800'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'>
                  <UserIcon size={16} />
                </div>
                <div>
                  <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                    Personal Identity
                  </h3>
                  <p className='text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400'>
                    Basic demographic & contact information
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Full Name */}
                <div className='md:col-span-2 space-y-1.5'>
                  <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    Full Name <span className='text-rose-500'>*</span>
                  </label>
                  <div className='group relative flex items-center'>
                    <UserIcon
                      size={18}
                      className='pointer-events-none absolute left-4 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'
                    />
                    <div className='absolute left-11 h-5 w-[1px] bg-slate-200 dark:bg-slate-700' />
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      placeholder='Full Name (e.g. Alex Johnson)'
                      className='w-full rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/50 py-3 pl-14 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:placeholder-slate-500 dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className='space-y-1.5'>
                  <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    Email Address <span className='text-rose-500'>*</span>
                  </label>
                  <div className='group relative flex items-center'>
                    <MailIcon
                      size={18}
                      className='pointer-events-none absolute left-4 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'
                    />
                    <div className='absolute left-11 h-5 w-[1px] bg-slate-200 dark:bg-slate-700' />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='Email (e.g. student@university.edu)'
                      className='w-full rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/50 py-3 pl-14 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:placeholder-slate-500 dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className='space-y-1.5'>
                  <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    Phone Contact
                  </label>
                  <div className='group relative flex items-center'>
                    <PhoneIcon
                      size={18}
                      className='pointer-events-none absolute left-4 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'
                    />
                    <div className='absolute left-11 h-5 w-[1px] bg-slate-200 dark:bg-slate-700' />
                    <input
                      type='text'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder='Phone (e.g. +91 98765 43210)'
                      className='w-full rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/50 py-3 pl-14 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:placeholder-slate-500 dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Academic Details */}
            <div className='space-y-5 pt-2'>
              <div className='flex items-center gap-2.5 border-b border-slate-100 pb-3 dark:border-slate-800'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'>
                  <AcademicIcon size={16} />
                </div>
                <div>
                  <h3 className='text-sm font-bold text-slate-900 dark:text-white'>
                    Academic Classification
                  </h3>
                  <p className='text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400'>
                    Institutional roll number, department, and year of study
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Roll Number */}
                <div className='space-y-1.5'>
                  <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    Roll Number <span className='text-rose-500'>*</span>
                  </label>
                  <div className='group relative flex items-center'>
                    <HashIcon
                      size={18}
                      className='pointer-events-none absolute left-4 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'
                    />
                    <div className='absolute left-11 h-5 w-[1px] bg-slate-200 dark:bg-slate-700' />
                    <input
                      type='text'
                      name='rollNumber'
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder='Roll No (e.g. 2026CS01)'
                      className='w-full rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/50 py-3 pl-14 pr-4 font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:placeholder-slate-500 dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
                      required
                    />
                  </div>
                </div>

                {/* Academic Year */}
                <div className='space-y-1.5'>
                  <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    Academic Year <span className='text-rose-500'>*</span>
                  </label>
                  <div className='group relative flex items-center'>
                    <CalendarIcon
                      size={18}
                      className='pointer-events-none absolute left-4 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'
                    />
                    <div className='absolute left-11 h-5 w-[1px] bg-slate-200 dark:bg-slate-700' />
                    <select
                      name='year'
                      value={formData.year}
                      onChange={handleChange}
                      className='w-full cursor-pointer appearance-none rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/50 py-3 pl-14 pr-10 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
                      required
                    >
                      <option value=''>Select Academic Year</option>
                      <option value='1'>1st Year</option>
                      <option value='2'>2nd Year</option>
                      <option value='3'>3rd Year</option>
                      <option value='4'>Final Year</option>
                    </select>
                  </div>
                </div>

                {/* Department */}
                <div className='md:col-span-2 space-y-1.5'>
                  <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    Department <span className='text-rose-500'>*</span>
                  </label>
                  <div className='group relative flex items-center'>
                    <DeptIcon
                      size={18}
                      className='pointer-events-none absolute left-4 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'
                    />
                    <div className='absolute left-11 h-5 w-[1px] bg-slate-200 dark:bg-slate-700' />
                    <select
                      name='department'
                      value={formData.department}
                      onChange={handleChange}
                      className='w-full cursor-pointer appearance-none rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/50 py-3 pl-14 pr-10 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
                      required
                    >
                      <option value=''>Select Department</option>
                      <option value='Computer Science'>Computer Science</option>
                      <option value='Information Technology'>
                        Information Technology
                      </option>
                      <option value='Electronics'>Electronics</option>
                      <option value='Other'>
                        Other (Specify Custom Department)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Custom Department Specification */}
                {showCustomDept && (
                  <div className='animate-in fade-in md:col-span-2 space-y-1.5'>
                    <label className='block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                      Custom Department Name{' '}
                      <span className='text-rose-500'>*</span>
                    </label>
                    <div className='group relative flex items-center'>
                      <DeptIcon
                        size={18}
                        className='pointer-events-none absolute left-4 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'
                      />
                      <div className='absolute left-11 h-5 w-[1px] bg-slate-200 dark:bg-slate-700' />
                      <input
                        type='text'
                        name='customDepartment'
                        value={formData.customDepartment}
                        onChange={handleChange}
                        placeholder='Enter custom department title'
                        className='w-full rounded-xl border border-slate-200/80 bg-slate-50 dark:bg-slate-800/50 py-3 pl-14 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:placeholder-slate-500 dark:focus:border-indigo-500/40 dark:focus:bg-slate-950'
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className='flex flex-col gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-end'>
              <button
                type='button'
                onClick={() => navigate('/students')}
                className='inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-6 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-700   dark:hover:bg-slate-700/80'
              >
                <BackIcon size={16} />
                <span>Cancel</span>
              </button>
              <button
                type='submit'
                className='inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 text-xs font-bold text-white shadow-md shadow-indigo-100 transition-all duration-200 hover:bg-indigo-700 dark:shadow-none'
              >
                <SaveIcon size={16} />
                <span>Update Student Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

StudentForm.displayName = 'StudentForm';
export default StudentForm;
