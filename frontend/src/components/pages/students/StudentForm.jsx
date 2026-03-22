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
} from 'lucide-react';
import studentService from '../../../services/studentService';

const StudentForm = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

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

  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
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
  }, [id, isEditing, navigate]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name === 'department') {
        setShowCustomDept(value === 'Other');
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const toastId = toast.loading(
        isEditing ? 'Updating record...' : 'Creating record...'
      );

      try {
        const payload = {
          ...formData,
          department: showCustomDept
            ? formData.customDepartment
            : formData.department,
        };
        // Remove helper fields from payload
        delete payload.customDepartment;

        const res = isEditing
          ? await studentService.updateStudent(id, payload)
          : await studentService.createStudent(payload);

        if (res.success) {
          toast.success(
            `Student ${isEditing ? 'updated' : 'enrolled'} successfully!`,
            { id: toastId }
          );
          navigate('/students');
        } else {
          toast.error(res.message || 'Failed to save record', { id: toastId });
        }
      } catch (error) {
        toast.error('Network error occurred', { id: toastId });
      }
    },
    [formData, id, isEditing, navigate]
  );

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center space-y-4 p-20'>
        <div className='h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent' />
        <p className='text-sm font-medium text-gray-500'>
          Loading student form...
        </p>
      </div>
    );
  }

  return (
    <div className='mb-20 animate-fade-in space-y-6 p-4 md:p-6'>
      <div className='mx-auto w-full max-w-2xl space-y-6'>
        {/* Header Card */}
        <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center md:p-8'>
            <div className='flex items-center gap-5'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none'>
                <i
                  className={`fas fa-${isEditing ? 'user-edit' : 'user-plus'} text-2xl text-white`}
                ></i>
              </div>
              <div>
                <h1 className='text-xl font-bold uppercase tracking-tight text-gray-900 dark:text-white'>
                  {isEditing ? 'Update Student Profile' : 'Enrollment Registry'}
                </h1>
                <p className='mt-1 text-sm font-medium text-gray-500 dark:text-gray-400'>
                  {isEditing
                    ? `Modifying record for ${formData.name}`
                    : 'Create a new student entry in the directory'}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/students')}
              className='rounded-xl p-2.5 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20'
              title='Discard changes'
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
          <form onSubmit={handleSubmit} className='space-y-8 p-6 md:p-10'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              {/* Name Field */}
              <div className='md:col-span-2'>
                <label className='mb-3 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Full Name
                </label>
                <div className='registry-input-group'>
                  <UserIcon size={18} className='registry-icon' />
                  <div className='registry-divider' />
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='registry-control'
                    placeholder='Full Name (e.g. John Doe)'
                    required
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className='mb-3 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Roll Number
                </label>
                <div className='registry-input-group'>
                  <HashIcon size={18} className='registry-icon' />
                  <div className='registry-divider' />
                  <input
                    type='text'
                    name='rollNumber'
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className='registry-control'
                    placeholder='Roll Number (e.g. 2024CS01)'
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className='mb-3 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Phone Number
                </label>
                <div className='registry-input-group'>
                  <PhoneIcon size={18} className='registry-icon' />
                  <div className='registry-divider' />
                  <input
                    type='text'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className='registry-control'
                    placeholder='Phone (e.g. +91 98765 43210)'
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className='md:col-span-2'>
                <label className='mb-3 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Email Address
                </label>
                <div className='registry-input-group'>
                  <MailIcon size={18} className='registry-icon' />
                  <div className='registry-divider' />
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='registry-control'
                    placeholder='Email (e.g. student@university.edu)'
                    required
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className='mb-3 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Department
                </label>
                <div className='registry-input-group'>
                  <DeptIcon size={18} className='registry-icon' />
                  <div className='registry-divider' />
                  <select
                    name='department'
                    value={formData.department}
                    onChange={handleChange}
                    className='registry-control appearance-none'
                    required
                  >
                    <option value=''>Select Department</option>
                    <option value='Computer Science'>Computer Science</option>
                    <option value='Information Technology'>
                      Information Technology
                    </option>
                    <option value='Electronics'>Electronics</option>
                    <option value='Other'>Other (Specify...)</option>
                  </select>
                </div>
              </div>

              {/* Year */}
              <div>
                <label className='mb-3 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                  Academic Year
                </label>
                <div className='registry-input-group'>
                  <CalendarIcon size={18} className='registry-icon' />
                  <div className='registry-divider' />
                  <select
                    name='year'
                    value={formData.year}
                    onChange={handleChange}
                    className='registry-control appearance-none'
                    required
                  >
                    <option value=''>Select Year</option>
                    <option value='1'>1st Year</option>
                    <option value='2'>2nd Year</option>
                    <option value='3'>3rd Year</option>
                    <option value='4'>Final Year</option>
                  </select>
                </div>
              </div>

              {showCustomDept && (
                <div className='animate-fade-in md:col-span-2'>
                  <label className='mb-3 ml-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                    Specify Department
                  </label>
                  <div className='registry-input-group'>
                    <DeptIcon size={18} className='registry-icon' />
                    <div className='registry-divider' />
                    <input
                      type='text'
                      name='customDepartment'
                      value={formData.customDepartment}
                      onChange={handleChange}
                      className='registry-control'
                      placeholder='Enter department name'
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className='flex flex-col gap-4 border-t border-gray-50 pt-10 dark:border-slate-800 sm:flex-row'>
              <button
                type='button'
                onClick={() => navigate('/students')}
                className='flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gray-50 text-[11px] font-bold uppercase tracking-widest text-gray-600 transition-all hover:bg-gray-100 dark:bg-slate-800/50 dark:text-gray-400 dark:hover:bg-slate-800'
              >
                <BackIcon size={16} />
                Back to List
              </button>
              <button
                type='submit'
                className='flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-indigo-600 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 dark:shadow-none'
              >
                <SaveIcon size={18} />
                {isEditing ? 'Update Student Profile' : 'Complete Enrollment'}
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
