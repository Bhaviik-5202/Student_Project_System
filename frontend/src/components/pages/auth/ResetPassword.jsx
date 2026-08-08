import { useState, memo, useCallback, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Check,
  X,
  ArrowRight,
  LogIn,
  AlertTriangle,
} from 'lucide-react';
import authService from '../../../services/authService';

/* ─── Password strength helpers ─────────────────────────────────────────── */

function calcStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&#^()_\-+={}\[\]|\\:;<>,./~`]/.test(password)) score++;
  if (score <= 1)
    return {
      label: 'Very Weak',
      color: 'bg-red-500',
      width: 'w-1/6',
      textColor: 'text-red-500',
    };
  if (score <= 2)
    return {
      label: 'Weak',
      color: 'bg-orange-500',
      width: 'w-2/6',
      textColor: 'text-orange-500',
    };
  if (score <= 3)
    return {
      label: 'Fair',
      color: 'bg-yellow-500',
      width: 'w-3/6',
      textColor: 'text-yellow-500',
    };
  if (score <= 4)
    return {
      label: 'Good',
      color: 'bg-lime-500',
      width: 'w-4/6',
      textColor: 'text-lime-500',
    };
  if (score <= 5)
    return {
      label: 'Strong',
      color: 'bg-emerald-500',
      width: 'w-5/6',
      textColor: 'text-emerald-500',
    };
  return {
    label: 'Very Strong',
    color: 'bg-emerald-600',
    width: 'w-full',
    textColor: 'text-emerald-600',
  };
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function RequirementRow({ met, label }) {
  return (
    <div className='flex items-center gap-2'>
      {met ? (
        <CheckCircle2 className='h-4 w-4 shrink-0 text-emerald-500' />
      ) : (
        <XCircle className='h-4 w-4 shrink-0 text-slate-300 dark:text-slate-700 dark:text-slate-200' />
      )}
      <span
        className={
          met
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-500 dark:text-slate-400'
        }
      >
        {label}
      </span>
    </div>
  );
}

/**
 * ResetPassword Component
 *
 * Phase 1: Token invalid / missing → show error with link to Forgot Password
 * Phase 2: Form to set new password (strength bar, requirements, show/hide)
 * Phase 3: Success screen before redirecting to login
 */
const ResetPassword = memo(() => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);

  /* ── Validation ── */
  const checks = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&#^()_\-+={}|\\:;<>,./~`]/.test(password),
    }),
    [password]
  );
  const isPasswordValid = Object.values(checks).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';
  const strength = useMemo(
    () => (password ? calcStrength(password) : null),
    [password]
  );

  /* ── Submit ── */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setServerError('');

      if (!token) {
        setServerError(
          'Reset token is missing. Please use the link from your email.'
        );
        return;
      }
      if (!isPasswordValid) {
        toast.error('Password does not meet all security requirements');
        setShowRequirements(true);
        return;
      }
      if (!passwordsMatch) {
        toast.error('Passwords do not match');
        return;
      }

      setLoading(true);
      try {
        const result = await authService.resetPassword(token, password);
        if (result.success) {
          setDone(true);
          // Auto-redirect after 3 s
          setTimeout(() => navigate('/login'), 3000);
        } else {
          const msg =
            result.message || 'Failed to reset password. Please try again.';
          setServerError(msg);
          toast.error(msg);
        }
      } catch {
        const msg = 'An unexpected error occurred. Please try again.';
        setServerError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [
      token,
      password,
      confirmPassword,
      navigate,
      isPasswordValid,
      passwordsMatch,
    ]
  );

  /* ─── Phase 3: Success ───────────────────────────────────────────────── */
  if (done) {
    return (
      <div className='space-y-6'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <div className='relative flex h-20 w-20 items-center justify-center'>
            <span className='absolute inset-0 animate-ping rounded-full bg-emerald-400/30' />
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30'>
              <ShieldCheck className='h-10 w-10 text-white' />
            </div>
          </div>

          <div>
            <h2 className='text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
              Password Updated!
            </h2>
            <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
              Your password has been reset successfully. Redirecting you to
              login…
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className='h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800'>
          <div className='h-full animate-[progressFill_3s_linear_forwards] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500' />
        </div>

        <Link
          to='/login'
          id='reset-success-login'
          className='flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 font-bold text-white shadow-lg shadow-emerald-500/15 transition-all hover:brightness-110 active:scale-[0.98]'
        >
          <LogIn className='h-5 w-5' />
          Continue to Login
        </Link>
      </div>
    );
  }

  /* ─── Phase 1: Invalid / Missing Token ──────────────────────────────── */
  if (!token) {
    return (
      <div className='space-y-6 text-center'>
        <div className='flex flex-col items-center gap-3'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-500 to-rose-500 shadow-lg shadow-red-500/20'>
            <AlertTriangle className='h-8 w-8 text-white' />
          </div>
          <h2 className='text-2xl font-extrabold text-slate-900 dark:text-white'>
            Invalid Link
          </h2>
          <p className='max-w-sm text-sm text-slate-500 dark:text-slate-400'>
            This password reset link is invalid or has already been used.
          </p>
        </div>
        <Link
          to='/forgot-password'
          className='flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg transition-all hover:brightness-110'
        >
          Request New Reset Link
        </Link>
        <Link
          to='/login'
          className='inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700  dark:hover:text-slate-200'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Sign In
        </Link>
      </div>
    );
  }

  /* ─── Phase 2: Password Entry Form ──────────────────────────────────── */
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'>
            <Lock className='h-8 w-8 text-white' />
          </div>
        </div>
        <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
          Set New Password
        </h2>
        <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
          Create a strong password for your account.
        </p>
      </div>

      {/* Server error banner */}
      {serverError && (
        <div className='flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 dark:border-red-900/50 dark:bg-red-900/20'>
          <AlertTriangle className='mt-0.5 h-5 w-5 shrink-0 text-red-500' />
          <div>
            <p className='text-sm font-semibold text-red-700 dark:text-red-400'>
              {serverError}
            </p>
            {(serverError.toLowerCase().includes('expired') ||
              serverError.toLowerCase().includes('invalid')) && (
              <Link
                to='/forgot-password'
                className='mt-1 block text-xs font-bold text-red-600 underline hover:text-red-700 dark:text-red-400'
              >
                Request a new reset link <ArrowRight className="inline ml-1" size={16} />
              </Link>
            )}
          </div>
        </div>
      )}

      <form className='space-y-5' onSubmit={handleSubmit} noValidate>
        {/* New Password */}
        <div className='group'>
          <label
            htmlFor='new-password'
            className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'
          >
            New Password
          </label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-blue-500'>
              <Lock className='h-5 w-5' />
            </div>
            <input
              id='new-password'
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowRequirements(true)}
              autoComplete='new-password'
              className='w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 transition-all hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 py-3.5 !pl-14 pr-14 text-sm dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-400/20'
              placeholder='••••••••'
            />
            <button
              type='button'
              id='toggle-new-password'
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className='absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-300'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>

          {/* Password strength bar */}
          {password && strength && (
            <div className='mt-2 space-y-1'>
              <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800'>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`}
                />
              </div>
              <p
                className={`text-right text-xs font-semibold ${strength.textColor}`}
              >
                {strength.label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className='group'>
          <label
            htmlFor='confirm-password'
            className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'
          >
            Confirm Password
          </label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-blue-500'>
              <ShieldCheck className='h-5 w-5' />
            </div>
            <input
              id='confirm-password'
              type={showConfirm ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete='new-password'
              className={`w-full rounded-xl border py-3.5 !pl-14 pr-14 text-sm transition-all focus:outline-none focus:ring-4 placeholder-slate-400 dark:placeholder-slate-500 ${
                confirmPassword
                  ? passwordsMatch
                    ? 'border-emerald-400 bg-emerald-50/50 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500/10 dark:border-emerald-700 dark:bg-emerald-950/20 dark:text-slate-100'
                    : 'border-rose-400 bg-rose-50/50 text-slate-900 focus:border-rose-500 focus:ring-rose-500/10 dark:border-rose-700 dark:bg-rose-950/20 dark:text-slate-100'
                  : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-400/20'
              }`}
              placeholder='••••••••'
            />
            <button
              type='button'
              id='toggle-confirm-password'
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
              className='absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-300'
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
          {/* Match indicator */}
          {confirmPassword && (
            <p
              className={`mt-1 text-xs font-medium ${
                passwordsMatch
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400'
              }`}
            >
              {passwordsMatch
                ? <><Check size={12} className="inline mr-1" /> Passwords match</>
                : <><X size={12} className="inline mr-1" /> Passwords do not match</>}
            </p>
          )}
        </div>

        {/* Requirements panel */}
        {showRequirements && (
          <div className='space-y-2 rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800/50 p-4 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/30'>
            <p className='mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
              Password Requirements
            </p>
            <div className='grid grid-cols-1 gap-2 text-xs font-medium sm:grid-cols-2'>
              <RequirementRow
                met={checks.length}
                label='At least 8 characters'
              />
              <RequirementRow
                met={checks.uppercase}
                label='One uppercase letter (A-Z)'
              />
              <RequirementRow
                met={checks.lowercase}
                label='One lowercase letter (a-z)'
              />
              <RequirementRow met={checks.number} label='One number (0-9)' />
              <RequirementRow
                met={checks.special}
                label='One special character (!@#$…)'
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type='submit'
          id='reset-password-submit'
          disabled={loading}
          className='flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-500/15 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60'
        >
          {loading ? (
            <>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Resetting Password…</span>
            </>
          ) : (
            <>
              <ShieldCheck className='h-5 w-5' />
              <span>Reset Password</span>
            </>
          )}
        </button>

        <div className='pt-1 text-center'>
          <Link
            to='/login'
            className='inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 dark:text-slate-400 dark:hover:text-slate-200'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
});

ResetPassword.displayName = 'ResetPassword';

export default ResetPassword;
