import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../common/PageHeader';
import toast from 'react-hot-toast';
import {
  Loader2,
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  FileText,
  Camera,
  X,
  Save,
  Settings,
  Shield,
  Bell,
  Key,
  Activity,
  Github,
  Globe,
  Linkedin,
  Eye,
  EyeOff,
  Edit2,
} from 'lucide-react';

/**
 * Profile Component
 * Allows users to view and update their profile information and account security.
 */
const Profile = memo(() => {
  const { user, updateProfile, changePassword, logout, fetchProfile } =
    useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

  useEffect(() => {
    if (fetchProfile) {
      fetchProfile();
    }
  }, [fetchProfile]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    bio: '',
    avatar: null,
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const buildFormData = useCallback((currentUser) => {
    if (!currentUser) {
      return {
        name: '',
        email: '',
        phone: '',
        department: '',
        year: '',
        bio: '',
        avatar: null,
      };
    }

    return {
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      department: currentUser.department || '',
      semester: currentUser.semester || '',
      academicYear: currentUser.academicYear || '',
      year: currentUser.year || '',
      bio: currentUser.bio || '',
      avatar: currentUser.avatar || null,
    };
  }, []);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData(buildFormData(user));
    }
  }, [user, buildFormData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSecurityChange = useCallback((e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar: imageUrl, avatarFile: file }));
    }
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'avatarFile') {
        if (formData[key]) data.append('avatar', formData[key]);
      } else if (key !== 'avatar') {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await updateProfile(data);
      if (res.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setSecurityLoading(true);
      const res = await changePassword(
        securityData.currentPassword,
        securityData.newPassword
      );
      if (res.success) {
        setSecurityData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        toast.success('Password updated successfully!');
      }
    } catch (error) {
      console.error('Security update failed:', error);
      toast.error('Failed to change password. Please try again.');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    if (user) {
      setFormData(buildFormData(user));
    }
    setIsEditing(false);
  }, [user, buildFormData]);

  const roleLabels = {
    admin: 'Administrator',
    faculty: 'Faculty Member',
    student: 'Student',
  };

  const roleBadgeClasses = {
    admin:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
    faculty: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    student:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  };

  const inputBase =
    'w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-200';
  const inputEnabled =
    'border border-slate-200/80 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-indigo-500 focus:bg-white dark:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/50  dark:focus:border-indigo-500/40 dark:focus:bg-slate-950';
  const inputDisabled =
    'border border-slate-200/60 bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 dark:border-slate-800/60 dark:bg-slate-800/40  cursor-not-allowed';

  if (!user) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Profile Settings'
        subtitle='Manage your account information, security credentials, and preferences'
        icon={User}
        badge={user?.role?.toUpperCase()}
      />

      <div className='grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3'>
        {/* Profile Card */}
        <div className='lg:col-span-1'>
          <div className='overflow-hidden rounded-xl border border-slate-200 bg-white dark:bg-slate-900 shadow-sm dark:border-slate-800 '>
            <div className='h-24 bg-gradient-to-r from-blue-500 to-indigo-600'></div>
            <div className='px-6 pb-6'>
              <div className='relative -mt-12 mb-4'>
                <div className='h-24 w-24 overflow-hidden rounded-xl border-4 border-white bg-slate-100 dark:bg-slate-800 shadow-md dark:border-slate-900 '>
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.name}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center bg-blue-100 dark:bg-blue-900/30'>
                      <User className='h-10 w-10 text-blue-600 dark:text-blue-400' />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className='absolute bottom-0 right-[-10px] cursor-pointer rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-2 shadow-md transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-700  dark:hover:bg-slate-700'>
                    <Camera className='h-4 w-4 text-slate-600 dark:text-slate-400' />
                    <input
                      type='file'
                      className='hidden'
                      accept='image/*'
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
              <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
                {user.name}
              </h2>
              <p className='mb-4 text-slate-500 dark:text-slate-400'>
                {user.email}
              </p>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeClasses[user.role]}`}
              >
                {roleLabels[user.role]}
              </span>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className='mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/50 shadow-sm'
                >
                  <Edit2 className='h-4 w-4' />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className='mt-8 space-y-4'>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white'>
              Account Actions
            </h3>
            <button
              onClick={() => navigate('/dashboard')}
              className='flex w-full items-center rounded-lg px-4 py-2 text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => logout()}
              className='flex w-full items-center rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20'
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <div className='space-y-8 lg:col-span-2'>
          <div className='rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-800 '>
            <h3 className='mb-6 text-lg font-bold text-slate-900 dark:text-white'>
              Personal Information
            </h3>
            <form onSubmit={handleProfileSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                    className={`${inputBase} ${isEditing ? inputEnabled : inputDisabled}`}
                    required
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                    className={`${inputBase} ${isEditing ? inputEnabled : inputDisabled}`}
                    required
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                    className={`${inputBase} ${isEditing ? inputEnabled : inputDisabled}`}
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Department
                  </label>
                  <input
                    type='text'
                    name='department'
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                    className={`${inputBase} ${isEditing ? inputEnabled : inputDisabled}`}
                  />
                </div>
                {user.role === 'student' && (
                  <>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                        Semester
                      </label>
                      <input
                        type='text'
                        name='semester'
                        value={formData.semester}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                        className={`${inputBase} ${isEditing ? inputEnabled : inputDisabled}`}
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                        Academic Year
                      </label>
                      <input
                        type='text'
                        name='academicYear'
                        value={formData.academicYear}
                        onChange={handleChange}
                        disabled={!isEditing || isLoading}
                        className={`${inputBase} ${isEditing ? inputEnabled : inputDisabled}`}
                      />
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Bio
                </label>
                <textarea
                  name='bio'
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  rows={4}
                  className={`${inputBase} ${isEditing ? inputEnabled : inputDisabled}`}
                />
              </div>

              {isEditing && (
                <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4'>
                  <button
                    type='button'
                    onClick={handleCancel}
                    disabled={isLoading}
                    className='w-full sm:w-auto rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 '
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full sm:w-auto flex justify-center items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
                  >
                    {isLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Save className='mr-2 h-4 w-4' />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {user?.role?.toLowerCase() !== 'admin' && (
            <div className='rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-800 '>
              <h3 className='mb-6 text-lg font-bold text-slate-900 dark:text-white'>
                Security
              </h3>
              <form onSubmit={handleSecuritySubmit} className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                      Current Password
                    </label>
                    <div className='relative'>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name='currentPassword'
                        value={securityData.currentPassword}
                        onChange={handleSecurityChange}
                        disabled={securityLoading}
                        className={`${inputBase} ${inputEnabled} pr-10`}
                        required
                      />
                      <button
                        type='button'
                        onClick={() => setShowCurrentPassword((v) => !v)}
                        className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none'
                        aria-label={
                          showCurrentPassword
                            ? 'Hide current password'
                            : 'Show current password'
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='hidden md:block'></div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                      New Password
                    </label>
                    <div className='relative'>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name='newPassword'
                        value={securityData.newPassword}
                        onChange={handleSecurityChange}
                        disabled={securityLoading}
                        className={`${inputBase} ${inputEnabled} pr-10`}
                        required
                      />
                      <button
                        type='button'
                        onClick={() => setShowNewPassword((v) => !v)}
                        className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none'
                        aria-label={
                          showNewPassword
                            ? 'Hide new password'
                            : 'Show new password'
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                      Confirm New Password
                    </label>
                    <div className='relative'>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name='confirmPassword'
                        value={securityData.confirmPassword}
                        onChange={handleSecurityChange}
                        disabled={securityLoading}
                        className={`${inputBase} ${inputEnabled} pr-10`}
                        required
                      />
                      <button
                        type='button'
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none'
                        aria-label={
                          showConfirmPassword
                            ? 'Hide confirm password'
                            : 'Show confirm password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className='flex justify-end pt-4'>
                  <button
                    type='submit'
                    disabled={securityLoading}
                    className='w-full sm:w-auto flex justify-center items-center rounded-lg bg-slate-900 px-4 py-2 text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:bg-slate-800 dark:text-slate-900 dark:text-white dark:hover:bg-slate-200 dark:hover:bg-slate-600 dark:bg-slate-700'
                  >
                    {securityLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Shield className='mr-2 h-4 w-4' />
                    )}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Profile;
