import { useState, memo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Register Component - Account creation form
 * Enhanced with premium UI, animations and better UX.
 */
const Register = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { register, isLoading: loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      try {
        const res = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'student',
        });
        if (res.success) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Registration error:', error);
      }
    },
    [formData, register, navigate]
  );

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-md'>
            <UserPlus className='h-8 w-8 text-white' />
          </div>
        </div>
        <h2 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
          Create Account
        </h2>
        <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
          Join the student project management portal
        </p>
      </div>

      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <div className='group'>
            <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
              Full Name
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                <User className='h-5 w-5' />
              </div>
              <input
                name='name'
                type='text'
                required
                value={formData.name}
                onChange={handleChange}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500'
                placeholder='Jane Smith'
              />
            </div>
          </div>

          <div className='group'>
            <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
              Email Address
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                <Mail className='h-5 w-5' />
              </div>
              <input
                name='email'
                type='email'
                required
                value={formData.email}
                onChange={handleChange}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500'
                placeholder='jane@university.edu'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='group'>
              <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                  <Lock className='h-5 w-5' />
                </div>
                <input
                  name='password'
                  type='password'
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500'
                  placeholder='••••••••'
                />
              </div>
            </div>
            <div className='group'>
              <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
                Confirm
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                  <ShieldCheck className='h-5 w-5' />
                </div>
                <input
                  name='confirmPassword'
                  type='password'
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500'
                  placeholder='••••••••'
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='mt-2 flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 font-bold text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <span>Create Account</span>
              <ArrowRight className='h-5 w-5' />
            </div>
          )}
        </button>
      </form>

      <div className='pt-2 text-center'>
        <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-bold text-blue-600 hover:underline dark:text-blue-400'
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
});

Register.displayName = 'Register';

export default Register;
