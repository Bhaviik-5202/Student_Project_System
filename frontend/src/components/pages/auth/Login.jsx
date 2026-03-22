import { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Login Component
 * Enhanced with premium UI, animations and better UX.
 */
const Login = memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const result = await login(email, password);
      if (result.success) {
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setError(result.message || 'Login failed. Please try again.');
        setLoading(false);
      }
    },
    [email, password, login, navigate]
  );

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-md'>
            <Lock className='h-8 w-8 text-white' />
          </div>
        </div>
        <h2 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
          Welcome Back
        </h2>
        <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
          Sign in to your academic dashboard
        </p>
      </div>

      {error && (
        <div className='flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400'>
          <AlertCircle className='h-5 w-5' />
          <span className='font-medium'>{error}</span>
        </div>
      )}

      <form className='space-y-5' onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <div className='group'>
            <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
              Email Address
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                <Mail className='h-5 w-5' />
              </div>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500'
                placeholder='you@university.edu'
              />
            </div>
          </div>

          <div className='group'>
            <div className='mb-1.5 flex items-center justify-between'>
              <label className='block text-sm font-bold text-slate-700 dark:text-slate-300'>
                Password
              </label>
              <Link
                to='/forgot-password'
                className='text-xs font-bold text-blue-600 hover:underline dark:text-blue-400'
              >
                Forgot password?
              </Link>
            </div>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                <Lock className='h-5 w-5' />
              </div>
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500'
                placeholder='••••••••'
              />
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 font-bold text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Sign In...</span>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <span>Sign In</span>
              <ArrowRight className='h-5 w-5' />
            </div>
          )}
        </button>
      </form>

      <div className='pt-2 text-center'>
        <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
          Don't have an account?{' '}
          <Link
            to='/register'
            className='font-bold text-blue-600 hover:underline dark:text-blue-400'
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
});

Login.displayName = 'Login';

export default Login;
