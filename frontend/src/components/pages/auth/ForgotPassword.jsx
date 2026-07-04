import { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Key, ArrowLeft, Loader2 } from 'lucide-react';
import authService from '../../../services/authService';
import { VALIDATION_RULES } from '../../../utils/constants';

/**
 * ForgotPassword Component - Password recovery form
 * Enhanced with consistent Lucide icons, validations and loading state.
 */
const ForgotPassword = memo(() => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        toast.error('Please enter your email address');
        return;
      }

      if (!VALIDATION_RULES.EMAIL.test(trimmedEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }

      setLoading(true);

      try {
        const result = await authService.requestPasswordReset(trimmedEmail);
        if (result.success) {
          toast.success(
            result.message || 'Password reset link sent to your email'
          );
        } else {
          toast.error(result.message || 'Failed to send reset link');
        }
      } catch (error) {
        toast.error('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [email]
  );

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'>
            <Key className='h-8 w-8 text-white' />
          </div>
        </div>
        <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
          Reset Password
        </h2>
        <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
          Enter your email to receive a recovery link
        </p>
      </div>

      <form className='space-y-5' onSubmit={handleSubmit} noValidate>
        <div className='group'>
          <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
            Email Address
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors'>
              <Mail className='h-5 w-5' />
            </div>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500/30 transition-all'
              placeholder='you@university.edu'
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-500/15 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all'
        >
          {loading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Sending link...</span>
            </div>
          ) : (
            <span>Send Reset Link</span>
          )}
        </button>

        <div className='text-center pt-2'>
          <Link
            to='/login'
            className='inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </div>
  );
});

ForgotPassword.displayName = 'ForgotPassword';

export default ForgotPassword;
