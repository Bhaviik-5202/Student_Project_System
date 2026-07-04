import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import authService from '../../../services/authService';

/**
 * VerifyOTP Component
 * Secure 6-digit verification interface with timer-based resending controls,
 * rate limit handling, and automatic focus traversal.
 */
const VerifyOTP = memo(() => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Resend Countdown Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // If email is missing, redirect to register
  useEffect(() => {
    if (!email) {
      toast.error('Email parameter missing. Please sign up again.');
      navigate('/register');
    }
  }, [email, navigate]);

  // Traversal: Handle input digit entry and auto-focus shifting
  const handleChange = useCallback((index, value) => {
    // Only accept numeric digit
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  }, [otp]);

  // Traversal: Handle backspace/delete focus shifting
  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }, [otp]);

  // Paste handler for 6 digits
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error('Please paste a valid 6-digit code.');
      return;
    }

    const digits = pastedData.split('');
    setOtp(digits);
    inputRefs.current[5].focus();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits of the code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTP(email, otpString);
      if (res.success) {
        navigate('/dashboard');
      } else {
        toast.error(res.message || 'OTP verification failed');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  }, [otp, email, verifyOTP, navigate]);

  const handleResend = useCallback(async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      const res = await authService.resendOTP(email);
      if (res.success) {
        toast.success('Verification code resent successfully!');
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      } else {
        toast.error(res.message || 'Failed to resend code');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  }, [canResend, email]);

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl'>
            <ShieldCheck className='h-8 w-8 text-white' />
          </div>
        </div>
        <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
          Verify Email
        </h2>
        <p className='mt-2.5 text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed'>
          We've sent a 6-digit verification code to <span className='font-bold text-slate-900 dark:text-slate-200'>{email}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* OTP Input Grid */}
        <div className='flex justify-between gap-2.5' onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type='text'
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className='w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white transition-all'
            />
          ))}
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-500/15 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all'
        >
          {loading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Verifying Code...</span>
            </div>
          ) : (
            <span>Verify & Create Account</span>
          )}
        </button>

        {/* Resend Logic */}
        <div className='flex flex-col items-center justify-center gap-2 text-sm font-medium'>
          {canResend ? (
            <button
              type='button'
              onClick={handleResend}
              disabled={resendLoading}
              className='flex items-center gap-1.5 text-blue-600 hover:underline dark:text-blue-400 font-bold'
            >
              {resendLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <RotateCcw className='h-4 w-4' />
              )}
              <span>Resend Code</span>
            </button>
          ) : (
            <p className='text-slate-500 dark:text-slate-400'>
              Resend code in <span className='font-bold text-slate-800 dark:text-slate-200'>{timer}s</span>
            </p>
          )}
        </div>

        <div className='text-center pt-2'>
          <Link
            to='/register'
            className='inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Back to Sign Up</span>
          </Link>
        </div>
      </form>
    </div>
  );
});

VerifyOTP.displayName = 'VerifyOTP';

export default VerifyOTP;
