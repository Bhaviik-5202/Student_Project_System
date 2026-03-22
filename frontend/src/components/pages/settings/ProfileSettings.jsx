import { useCallback, useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const ProfileSettings = memo(() => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const buildFormData = useCallback((currentUser) => {
    if (!currentUser) {
      return {
        name: '',
        email: '',
        phone: '',
        department: '',
        bio: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
    }

    return {
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      department: currentUser.department || '',
      bio: currentUser.bio || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(buildFormData(user));
    }
  }, [user, buildFormData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (
        formData.newPassword &&
        formData.newPassword !== formData.confirmPassword
      ) {
        toast.error('New passwords do not match');
        return;
      }

      setLoading(true);
      try {
        await updateProfile(formData);
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error('Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
    [formData, updateProfile]
  );

  const inputClass =
    'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => navigate('/profile')}
            className='mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200'
          >
            ← Back to Profile
          </button>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>
            Edit Profile
          </h1>
          <p className='text-slate-600 dark:text-slate-300'>
            Update your personal information and settings
          </p>
        </div>

        <div className='max-w-3xl rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* Personal Information */}
            <div>
              <h2 className='mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100'>
                Personal Information
              </h2>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    required
                    className={inputClass}
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    name='email'
                    required
                    className={inputClass}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    className={inputClass}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Department
                  </label>
                  <input
                    type='text'
                    name='department'
                    className={inputClass}
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className='mt-6'>
                <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                  Bio
                </label>
                <textarea
                  rows='3'
                  name='bio'
                  className={inputClass}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder='Tell us about yourself'
                />
              </div>
            </div>

            {/* Change Password */}
            <div>
              <h2 className='mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100'>
                Change Password
              </h2>
              <div className='space-y-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Current Password
                  </label>
                  <input
                    type='password'
                    name='currentPassword'
                    className={inputClass}
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                      New Password
                    </label>
                    <input
                      type='password'
                      name='newPassword'
                      className={inputClass}
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                      Confirm New Password
                    </label>
                    <input
                      type='password'
                      name='confirmPassword'
                      className={inputClass}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                type='submit'
                disabled={loading}
                className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type='button'
                onClick={() => navigate('/profile')}
                className='rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

ProfileSettings.displayName = 'ProfileSettings';

export default ProfileSettings;
