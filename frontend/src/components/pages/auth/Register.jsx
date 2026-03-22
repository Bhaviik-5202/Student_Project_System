import { useState, memo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../../../services/authService';

/**
 * Register Component - Account creation form
 */
const Register = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      setLoading(true);
      try {
        const res = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        if (res.success) {
          toast.success('Account created! Please sign in.');
          navigate('/login');
        } else {
          toast.error(res.message || 'Registration failed');
        }
      } catch (error) {
        toast.error(error.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate]
  );

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl'>
            <i className='fas fa-user-plus text-2xl text-white'></i>
          </div>
        </div>
        <h2 className='text-3xl font-bold text-slate-900 dark:text-white'>
          Join Us
        </h2>
        <p className='mt-2 text-slate-600 dark:text-slate-400'>
          Create your academic account
        </p>
      </div>

      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label className='mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
            Full Name
          </label>
          <input
            name='name'
            type='text'
            required
            value={formData.name}
            onChange={handleChange}
            className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white'
            placeholder='John Doe'
          />
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
            Email Address
          </label>
          <input
            name='email'
            type='email'
            required
            value={formData.email}
            onChange={handleChange}
            className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white'
            placeholder='john@university.edu'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
              Password
            </label>
            <input
              name='password'
              type='password'
              required
              value={formData.password}
              onChange={handleChange}
              className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white'
              placeholder='••••••••'
            />
          </div>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
              Confirm
            </label>
            <input
              name='confirmPassword'
              type='password'
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white'
              placeholder='••••••••'
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] disabled:opacity-50'
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className='pt-2 text-center'>
        <p className='text-sm text-slate-600 dark:text-slate-400'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-bold text-blue-600 dark:text-blue-400'
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
