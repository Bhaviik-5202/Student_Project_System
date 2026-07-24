import { useState, memo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Mail,
  Key,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Send,
} from 'lucide-react';
import authService from '../../../services/authService';
import { VALIDATION_RULES } from '../../../utils/constants';

/** Mask an email for display: e.g. bh***202@gmail.com */
function maskEmail(email) {
  const [local, domain] = email.split('@');
  if (local.length <= 4) return `${local[0]}***@${domain}`;
  return `${local.slice(0, 2)}***${local.slice(-2)}@${domain}`;
}

/**
 * ForgotPassword Component
 *
 * Phase 1: User enters email → submit triggers API call
 * Phase 2: Success confirmation with masked email + resend button
 */
const ForgotPassword = memo(() => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Resend cooldown (60 s)
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const submitRequest = useCallback(async (emailToSend) => {
    setLoading(true);
    try {
      const result = await authService.requestPasswordReset(emailToSend);
      // Always show success regardless of whether the email exists
      // (prevents user enumeration)
      if (result.success || !result.error) {
        setSent(true);
        setCooldown(60);
      } else {
        toast.error(
          result.message || 'Failed to send reset link. Please try again.'
        );
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

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

      await submitRequest(trimmedEmail);
    },
    [email, submitRequest]
  );

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return;
    await submitRequest(email.trim());
  }, [cooldown, email, submitRequest]);

  /* ─── Phase 2: Email Sent Confirmation ─────────────────────────────── */
  if (sent) {
    return (
      <div className='space-y-6'>
        {/* Animated success icon */}
        <div className='flex flex-col items-center gap-3 text-center'>
          <div className='relative flex h-20 w-20 items-center justify-center'>
            {/* Pulsing ring */}
            <span className='absolute inset-0 animate-ping rounded-full bg-emerald-400/30' />
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30'>
              <CheckCircle2 className='h-10 w-10 text-white' />
            </div>
          </div>

          <h2 className='text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
            Check Your Inbox!
          </h2>
          <p className='max-w-sm text-sm text-slate-500 dark:text-slate-400'>
            If an account exists for{' '}
            <span className='font-semibold text-slate-700 dark:text-slate-200'>
              {maskEmail(email)}
            </span>
            , a password reset link has been sent. It expires in{' '}
            <strong>30 minutes</strong>.
          </p>
        </div>

        {/* Instructions card */}
        <div className='rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-800/80 p-4 dark:border-slate-800 dark:bg-slate-900/40'>
          <p className='mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 dark:text-slate-400'>
            What to do next
          </p>
          <ol className='space-y-1.5 text-sm text-slate-600 dark:text-slate-400'>
            <li className='flex items-start gap-2'>
              <span className='mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'>
                1
              </span>
              Open your email client and look for an email from{' '}
              <strong className='text-slate-700 dark:text-slate-300'>
                Student Project System
              </strong>
              .
            </li>
            <li className='flex items-start gap-2'>
              <span className='mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'>
                2
              </span>
              Click the{' '}
              <strong className='text-slate-700 dark:text-slate-300'>
                Reset My Password
              </strong>{' '}
              button inside the email.
            </li>
            <li className='flex items-start gap-2'>
              <span className='mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'>
                3
              </span>
              Create a new strong password and log in.
            </li>
          </ol>
        </div>

        {/* Spam notice */}
        <p className='text-center text-xs text-slate-400 dark:text-slate-600 dark:text-slate-300'>
          Can&apos;t find the email? Check your{' '}
          <span className='font-medium text-slate-500 dark:text-slate-500 dark:text-slate-400'>
            Spam / Junk
          </span>{' '}
          folder.
        </p>

        {/* Resend button */}
        <button
          type='button'
          onClick={handleResend}
          disabled={cooldown > 0 || loading}
          className='flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700   dark:hover:bg-slate-700'
        >
          {loading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>Sending…</span>
            </>
          ) : cooldown > 0 ? (
            <>
              <RotateCcw className='h-4 w-4' />
              <span>Resend in {cooldown}s</span>
            </>
          ) : (
            <>
              <Send className='h-4 w-4' />
              <span>Resend Email</span>
            </>
          )}
        </button>

        {/* Back to login */}
        <div className='text-center'>
          <Link
            to='/login'
            className='inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 dark:text-slate-400 dark:hover:text-slate-200'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Phase 1: Email Entry Form ─────────────────────────────────────── */
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'>
            <Key className='h-8 w-8 text-white' />
          </div>
        </div>
        <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
          Forgot Password?
        </h2>
        <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
          Enter your email and we&apos;ll send you a secure reset link.
        </p>
      </div>

      {/* Form */}
      <form className='space-y-5' onSubmit={handleSubmit} noValidate>
        <div className='group'>
          <label
            htmlFor='forgot-email'
            className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'
          >
            Email Address
          </label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-blue-500'>
              <Mail className='h-5 w-5' />
            </div>
            <input
              id='forgot-email'
              type='email'
              autoComplete='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className='w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 py-3.5 pl-11 pr-4 text-sm transition-all focus:border-blue-500 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 dark:border-slate-700  dark:text-white dark:focus:border-blue-500/30'
              placeholder='you@university.edu'
            />
          </div>
        </div>

        <button
          type='submit'
          id='forgot-password-submit'
          disabled={loading}
          className='flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-500/15 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60'
        >
          {loading ? (
            <>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Sending Reset Link…</span>
            </>
          ) : (
            <>
              <Send className='h-5 w-5' />
              <span>Send Reset Link</span>
            </>
          )}
        </button>

        <div className='pt-1 text-center'>
          <Link
            to='/login'
            className='inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 dark:text-slate-400 dark:hover:text-slate-200'
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
