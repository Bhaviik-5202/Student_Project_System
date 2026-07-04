import { useState, memo, useCallback, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  LockOpen,
  Lock,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import authService from '../../../services/authService';
import { VALIDATION_RULES } from '../../../utils/constants';

/**
 * ResetPassword Component - New password entry form
 * Enhanced with consistent Lucide icons, password validation indicators and toasts.
 */
const ResetPassword = memo(() => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Calculate password checks dynamically
  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
  }, [password]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordChecks).every(Boolean);
  }, [passwordChecks]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isPasswordValid) {
        toast.error('Password does not meet all security requirements');
        setShowPasswordRequirements(true);
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      setLoading(true);

      try {
        const result = await authService.resetPassword(token, password);
        if (result.success) {
          toast.success(
            result.message || 'Password has been reset successfully'
          );
          navigate('/login');
        } else {
          toast.error(result.message || 'Failed to reset password');
        }
      } catch (error) {
        toast.error('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [token, password, confirmPassword, navigate, isPasswordValid]
  );

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'>
            <LockOpen className='h-8 w-8 text-white' />
          </div>
        </div>
        <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
          New Password
        </h2>
        <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
          Please enter your new password below
        </p>
      </div>

      <form className='space-y-5' onSubmit={handleSubmit} noValidate>
        <div className='space-y-4'>
          {/* New Password input */}
          <div className='group'>
            <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
              New Password
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                <Lock className='h-5 w-5' />
              </div>
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordRequirements(true)}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500/30 transition-all'
                placeholder='••••••••'
              />
            </div>
          </div>

          {/* Confirm Password input */}
          <div className='group'>
            <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
              Confirm Password
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                <ShieldCheck className='h-5 w-5' />
              </div>
              <input
                type='password'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500/30 transition-all'
                placeholder='••••••••'
              />
            </div>
          </div>

          {/* Interactive Password Requirements Panel */}
          {showPasswordRequirements && (
            <div className='rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-900/30 transition-all duration-300'>
              <p className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1'>
                Password Requirements
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium'>
                <div className='flex items-center space-x-2'>
                  {passwordChecks.length ? (
                    <CheckCircle2 className='h-4 w-4 text-emerald-500 flex-shrink-0' />
                  ) : (
                    <XCircle className='h-4 w-4 text-slate-300 dark:text-slate-700 flex-shrink-0' />
                  )}
                  <span className={passwordChecks.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>
                    At least 8 characters
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  {passwordChecks.uppercase ? (
                    <CheckCircle2 className='h-4 w-4 text-emerald-500 flex-shrink-0' />
                  ) : (
                    <XCircle className='h-4 w-4 text-slate-300 dark:text-slate-700 flex-shrink-0' />
                  )}
                  <span className={passwordChecks.uppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>
                    One uppercase letter (A-Z)
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  {passwordChecks.lowercase ? (
                    <CheckCircle2 className='h-4 w-4 text-emerald-500 flex-shrink-0' />
                  ) : (
                    <XCircle className='h-4 w-4 text-slate-300 dark:text-slate-700 flex-shrink-0' />
                  )}
                  <span className={passwordChecks.lowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>
                    One lowercase letter (a-z)
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  {passwordChecks.number ? (
                    <CheckCircle2 className='h-4 w-4 text-emerald-500 flex-shrink-0' />
                  ) : (
                    <XCircle className='h-4 w-4 text-slate-300 dark:text-slate-700 flex-shrink-0' />
                  )}
                  <span className={passwordChecks.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>
                    One number (0-9)
                  </span>
                </div>
                <div className='flex items-center space-x-2 sm:col-span-2'>
                  {passwordChecks.special ? (
                    <CheckCircle2 className='h-4 w-4 text-emerald-500 flex-shrink-0' />
                  ) : (
                    <XCircle className='h-4 w-4 text-slate-300 dark:text-slate-700 flex-shrink-0' />
                  )}
                  <span className={passwordChecks.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>
                    One special character (@$!%*?&)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-500/15 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all'
        >
          {loading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Resetting password...</span>
            </div>
          ) : (
            <span>Reset Password</span>
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

ResetPassword.displayName = 'ResetPassword';

export default ResetPassword;
