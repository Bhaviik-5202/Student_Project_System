import { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Login Component
 *
 * The primary entry point for user authentication. Features a
 * responsive, secure credential acquisition form with integrated
 * error handling, loading states, and direct links to registration
 * and recovery workflows.
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
          <div className='animate-bounce-slow flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl'>
            <i className='fas fa-lock text-2xl text-white'></i>
          </div>
        </div>
        <h2 className='text-3xl font-bold text-slate-900 dark:text-white'>
          Welcome Back
        </h2>
        <p className='mt-2 text-slate-600 dark:text-slate-400'>
          Sign in to your account
        </p>
      </div>

      {error && (
        <div className='animate-shake flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400'>
          <i className='fas fa-exclamation-circle mt-0.5'></i>
          <span>{error}</span>
        </div>
      )}

      <form className='space-y-5' onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300'>
              Email Address
            </label>
            <div className='relative'>
              <i className='fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'></i>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white'
                placeholder='you@university.edu'
              />
            </div>
          </div>

          <div>
            <div className='mb-1.5 flex items-center justify-between'>
              <Link
                to='/forgot-password'
                size='text-xs'
                className='text-xs font-medium text-blue-600 dark:text-blue-400'
              >
                Forgot password?
              </Link>
            </div>
            <div className='relative'>
              <i className='fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'></i>
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white'
                placeholder='••••••••'
              />
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50'
        >
          {loading ? (
            <span className='flex items-center justify-center gap-2'>
              <i className='fas fa-circle-notch fa-spin'></i> Authenticating...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className='pt-2 text-center'>
        <p className='text-sm text-slate-600 dark:text-slate-400'>
          <Link
            to='/register'
            className='font-bold text-blue-600 dark:text-blue-400'
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
