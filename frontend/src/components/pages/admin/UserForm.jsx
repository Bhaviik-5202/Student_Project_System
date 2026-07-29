import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Users,
  ArrowLeft,
  Save,
  Loader2,
  UserPlus,
  Shield,
  Building,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  User as UserIcon,
  Mail as MailIcon,
  Lock,
} from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import Input from '../../ui/Input';
import api from '../../../utils/api';
import { notifyDataChanged } from '../../../utils/eventBus';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: 'Computer Engineering',
    status: 'active',
    phone: '',
    avatar: '',
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      let userData = null;
      try {
        const res = await api.get(`/users/${id}`);
        userData = res.data || res.user || res;
      } catch (err) {
        // Fallback: search in list
        const resList = await api.get('/users');
        let list = [];
        if (Array.isArray(resList)) list = resList;
        else if (Array.isArray(resList?.data)) list = resList.data;
        else if (Array.isArray(resList?.data?.data)) list = resList.data.data;
        else if (Array.isArray(resList?.users)) list = resList.users;

        userData = list.find((u) => (u._id || u.id) === id);
      }

      if (userData) {
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          confirmPassword: '',
          role: userData.role || 'student',
          department: userData.department || 'Computer Engineering',
          status: (userData.status || 'active').toLowerCase(),
          phone: userData.phone || '',
          avatar: userData.avatar || '',
        });
      } else {
        toast.error('User not found');
        navigate('/user-management');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      toast.error('Failed to load user details');
      navigate('/user-management');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [isEditMode, fetchUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields (Full Name, Email)');
      return;
    }

    if (!isEditMode && !formData.password) {
      toast.error('Password is required for new users');
      return;
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        department: formData.department,
        status: formData.status,
        phone: formData.phone.trim(),
        avatar: formData.avatar.trim() || null,
      };

      if (formData.password && formData.password.trim() !== '') {
        payload.password = formData.password;
      }

      if (isEditMode) {
        await api.put(`/users/${id}`, payload);
        toast.success('User updated successfully');
      } else {
        await api.post('/users', payload);
        toast.success('User created successfully');
      }

      // Broadcast so AdminDashboard, UserManagement, etc. auto-refresh
      notifyDataChanged({ type: 'user_changed', action: isEditMode ? 'updated' : 'created' });
      navigate('/user-management', { state: { refresh: true } });
    } catch (err) {
      console.error('Failed to save user:', err);
      const msg =
        err.response?.data?.message ||
        'Failed to save user. Please verify input details.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='animate-fade-in space-y-6 pt-0 pb-6 max-w-4xl mx-auto'>
      <PageHeader
        title={isEditMode ? 'Edit User Profile' : 'Add New User'}
        subtitle={
          isEditMode
            ? 'Update user account credentials, email, and system roles'
            : 'Enroll a new user account into the system directory'
        }
        icon={isEditMode ? Users : UserPlus}
        actions={
          <button
            type='button'
            onClick={() => navigate('/user-management')}
            className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-700   transition-all'
          >
            <ArrowLeft size={16} />
            <span>Back to User Management</span>
          </button>
        }
      />

      {loading ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
          <p className='mt-3 text-sm font-medium text-slate-500 dark:text-slate-400'>
            Loading user profile details...
          </p>
        </div>
      ) : (
        <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Primary Details */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                label='Full Name'
                name='name'
                type='text'
                icon={UserIcon}
                placeholder='e.g. John Doe'
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label='Email Address'
                name='email'
                type='email'
                icon={MailIcon}
                placeholder='e.g. john@university.edu'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Section with Eye Icon Toggle */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                label='Password'
                name='password'
                type='password'
                icon={Lock}
                placeholder={
                  isEditMode
                    ? '•••••••• (Leave blank to keep unchanged)'
                    : 'At least 6 characters'
                }
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
                helperText={
                  isEditMode
                    ? 'Leave blank to keep password unchanged'
                    : undefined
                }
              />

              <Input
                label='Confirm Password'
                name='confirmPassword'
                type='password'
                icon={Lock}
                placeholder={isEditMode ? '••••••••' : 'Re-enter password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required={Boolean(formData.password)}
              />
            </div>

            {/* Role, Department, Status */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                  System Role <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <Shield
                    size={16}
                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                  />
                  <select
                    name='role'
                    className='w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value='student'>Student</option>
                    <option value='faculty'>Faculty</option>
                    <option value='admin'>Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                  Department
                </label>
                <div className='relative'>
                  <Building
                    size={16}
                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                  />
                  <select
                    name='department'
                    className='w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value='Computer Engineering'>
                      Computer Engineering
                    </option>
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
              </div>

              <div>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                  Account Status
                </label>
                <div className='relative'>
                  <CheckCircle2
                    size={16}
                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                  />
                  <select
                    name='status'
                    className='w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value='active'>Active</option>
                    <option value='inactive'>Inactive</option>
                    <option value='pending'>Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact & Avatar */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                label='Contact Number'
                name='phone'
                type='text'
                icon={Phone}
                placeholder='e.g. +91 98765 43210'
                value={formData.phone}
                onChange={handleChange}
              />

              <Input
                label='Profile Photo (URL - Optional)'
                name='avatar'
                type='text'
                icon={ImageIcon}
                placeholder='e.g. https://images.unsplash.com/...'
                value={formData.avatar}
                onChange={handleChange}
              />
            </div>

            {/* Form Actions */}
            <div className='flex items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700'>
              <button
                type='button'
                onClick={() => navigate('/user-management')}
                className='rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:bg-slate-700  transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting}
                className='flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 dark:shadow-none disabled:opacity-50'
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className='animate-spin' />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>{isEditMode ? 'Update User' : 'Create User'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserForm;
