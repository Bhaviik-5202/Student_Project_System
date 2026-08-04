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

  // Auto-focus first input box on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

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
  const handleChange = useCallback(
    (index, value) => {
      // Only accept numeric digit
      if (value && !/^\d$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input if value entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  // Traversal: Handle backspace/delete & arrow key focus shifting
  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace') {
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  // Paste handler for 6 digits (supports formatted input like 123-456 or 123 456)
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digitsOnly = pastedData.replace(/\D/g, '');
    if (digitsOnly.length !== 6) {
      toast.error('Please paste a valid 6-digit code.');
      return;
    }

    const digits = digitsOnly.slice(0, 6).split('');
    setOtp(digits);
    inputRefs.current[5]?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
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
    },
    [otp, email, verifyOTP, navigate]
  );

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
        inputRefs.current[0]?.focus();
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
    <div className='w-full space-y-6'>
      {/* Header Container */}
      <div className='text-center space-y-3'>
        <div className='flex justify-center mb-2'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20'>
            <ShieldCheck className='h-8 w-8 text-white' />
          </div>
        </div>
        <h2 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
          Verify Email
        </h2>
        <p className='mx-auto max-w-sm text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300'>
          We&apos;ve sent a 6-digit verification code to{' '}
          <span className='font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/60 inline-block mt-0.5 break-all'>
            {email}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* OTP Input Grid */}
        <div
          className='grid grid-cols-6 gap-1 sm:gap-2.5 md:gap-3 py-2 px-0.5'
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => {
            const isFilled = Boolean(digit);
            return (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                maxLength={1}
                value={digit}
                placeholder='•'
                aria-label={`Digit ${index + 1}`}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  h-11 sm:h-14 md:h-16 w-full max-w-[44px] sm:max-w-[56px] mx-auto rounded-lg sm:rounded-2xl
                  text-center text-lg sm:text-2xl font-extrabold
                  transition-all duration-200 outline-none
                  
                  /* LIGHT MODE STYLING */
                  bg-white text-slate-900 placeholder:text-slate-300
                  ${
                    isFilled
                      ? 'border-2 border-indigo-600 bg-indigo-50/20 shadow-sm'
                      : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                  }
                  focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/25 focus:-translate-y-0.5 focus:shadow-md
                  
                  /* DARK MODE STYLING */
                  dark:text-white dark:placeholder:text-slate-600
                  ${
                    isFilled
                      ? 'dark:border-indigo-400 dark:bg-indigo-950/30'
                      : 'dark:border-slate-700 dark:bg-slate-900/90 dark:hover:border-slate-600'
                  }
                  dark:focus:border-indigo-400 dark:focus:bg-slate-900 dark:focus:ring-indigo-400/30
                `}
              />
            );
          })}
        </div>

        <button
          type='submit'
          disabled={loading || otp.join('').length !== 6}
          className='flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3.5 px-4 font-extrabold text-white shadow-lg shadow-indigo-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
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
              className='flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors'
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
              Resend code in{' '}
              <span className='font-bold text-slate-900 dark:text-slate-100'>
                {timer}s
              </span>
            </p>
          )}
        </div>

        <div className='pt-2 text-center'>
          <Link
            to='/register'
            className='inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors'
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
