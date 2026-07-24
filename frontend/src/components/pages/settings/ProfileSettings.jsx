import { useCallback, useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog } from 'lucide-react';
import PageHeader from '../../common/PageHeader';
import { useAuth } from '../../../hooks/useAuth';
import authService from '../../../services/authService';
import { toast } from 'react-hot-toast';

const ProfileSettings = memo(() => {
  const { user, updateProfile, changePassword } = useAuth();
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

      const { currentPassword, newPassword, confirmPassword, ...profileData } =
        formData;

      if (newPassword && newPassword !== confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      setLoading(true);
      try {
        // Update profile
        const profileRes = await updateProfile(profileData);

        // Handle password change if requested
        if (newPassword) {
          if (!currentPassword) {
            toast.error('Current password is required to change password');
            setLoading(false);
            return;
          }
          const passwordRes = await changePassword(
            currentPassword,
            newPassword
          );
          if (!passwordRes.success) {
            // Error already handled by toast in AuthContext potentially,
            // but we'll check just in case.
          }
        }

        if (profileRes.success) {
          toast.success('Profile updated successfully');
        }
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
    <div className='space-y-6 animate-fade-in pt-0 pb-6'>
      <PageHeader
        title='Edit Profile'
        subtitle='Update your personal details, contact info, and authentication credentials'
        icon={UserCog}
      />

      <div className='max-w-3xl rounded-lg border border-slate-200 bg-white dark:bg-slate-900 p-6 dark:border-slate-700 dark:bg-slate-800'>
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
              className='rounded-lg border border-slate-300 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 dark:border-slate-600  '
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ProfileSettings.displayName = 'ProfileSettings';

export default ProfileSettings;
