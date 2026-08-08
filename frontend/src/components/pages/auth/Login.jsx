import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { VALIDATION_RULES } from '../../../utils/constants';

/**
 * Login Component
 * Rewritten from scratch with local CSS isolation supporting both Light and Dark mode.
 * Supports hidden Super Admin login via Ctrl + Shift + A or protected route /super-admin/login.
 */
const Login = memo(({ forceAdminMode = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdminLoginMode, setIsAdminLoginMode] = useState(
    forceAdminMode ||
      location.pathname === '/super-admin/login' ||
      location.search.includes('admin=true')
  );

  // Secret keyboard shortcut Ctrl + Shift + A to reveal Super Admin login mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'A' || e.key === 'a')
      ) {
        e.preventDefault();
        setIsAdminLoginMode((prev) => {
          const nextState = !prev;
          if (nextState) {
            toast.success('Super Admin Login Entry Activated');
          } else {
            toast.info('Standard Portal Login View');
          }
          return nextState;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem('sps_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      const trimmedEmail = email.trim();

      if (!trimmedEmail || !password) {
        setError('Please fill in all fields');
        toast.error('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!VALIDATION_RULES.EMAIL.test(trimmedEmail)) {
        setError('Please enter a valid email address');
        toast.error('Please enter a valid email address');
        setLoading(false);
        return;
      }

      try {
        const result = await login(trimmedEmail, password);
        if (result.success) {
          toast.success('Signed in successfully! Redirecting...');
          if (rememberMe) {
            localStorage.setItem('sps_remembered_email', trimmedEmail);
          } else {
            localStorage.removeItem('sps_remembered_email');
          }
          setTimeout(() => navigate('/dashboard'), 500);
        } else {
          setError(result.message || 'Login failed. Please try again.');
          toast.error(result.message || 'Login failed. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Login submit error:', err);
        setError('An unexpected error occurred. Please try again.');
        toast.error('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    },
    [email, password, rememberMe, login, navigate]
  );

  // Entrance spring animations
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 18,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 220, damping: 20 },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial='hidden'
      animate='show'
      className='auth-card relative mx-auto w-full max-w-xl space-y-6 sm:space-y-8 p-4 sm:p-8 md:p-10 lg:max-w-4xl'
    >
      {/* Local CSS Isolation Block supporting Light and Dark modes */}
      <style>{`
        .auth-card {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.06) !important;
          border-radius: 28px !important;
        }

        .dark .auth-card {
          background: rgba(15, 23, 42, 0.45) !important;
          backdrop-filter: blur(16px) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5) !important;
        }
        
        .auth-input {
          width: 100% !important;
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(0, 0, 0, 0.12) !important;
          color: #1e293b !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          border-radius: 16px !important;
          padding-top: 1rem !important;
          padding-bottom: 1rem !important;
          padding-left: 3.5rem !important;
          padding-right: 3.5rem !important;
          outline: none !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .dark .auth-input {
          background: rgba(8, 10, 18, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
        }
        
        .auth-input::placeholder {
          color: #94a3b8 !important;
        }

        .dark .auth-input::placeholder {
          color: #4b5563 !important;
        }
        
        .auth-input:hover {
          border-color: rgba(0, 0, 0, 0.2) !important;
          background: #ffffff !important;
        }

        .dark .auth-input:hover {
          border-color: rgba(255, 255, 255, 0.16) !important;
          background: rgba(8, 10, 18, 0.8) !important;
        }
        
        .auth-input:focus {
          border-color: rgba(99, 102, 241, 0.8) !important;
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.8), 0 0 12px rgba(99, 102, 241, 0.15) !important;
          background: #ffffff !important;
        }

        .dark .auth-input:focus {
          border-color: rgba(99, 102, 241, 0.8) !important;
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.8), 0 0 12px rgba(99, 102, 241, 0.25) !important;
          background: rgba(8, 10, 18, 0.9) !important;
        }
        
        /* Autofill overrides */
        .auth-input:-webkit-autofill,
        .auth-input:-webkit-autofill:hover,
        .auth-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #1e293b !important;
          -webkit-box-shadow: 0 0 0px 1000px rgb(255, 255, 255) inset !important;
          box-shadow: 0 0 0px 1000px rgb(255, 255, 255) inset !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }

        .dark .auth-input:-webkit-autofill,
        .dark .auth-input:-webkit-autofill:hover,
        .dark .auth-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px rgb(8, 10, 18) inset !important;
          box-shadow: 0 0 0px 1000px rgb(8, 10, 18) inset !important;
        }
        
        .auth-label {
          display: block !important;
          font-size: 0.75rem !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.075em !important;
          color: #64748b !important;
          margin-bottom: 0.5rem !important;
        }

        .dark .auth-label {
          color: #94a3b8 !important;
        }
        
        .auth-title {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 1.875rem !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          letter-spacing: -0.02em !important;
          line-height: 1.25 !important;
        }

        .dark .auth-title {
          color: #ffffff !important;
        }
        
        .auth-subtitle {
          font-size: 0.875rem !important;
          color: #64748b !important;
          font-weight: 500 !important;
          margin-top: 0.5rem !important;
        }

        .auth-btn-submit {
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem !important;
          background: #4f46e5 !important;
          color: #ffffff !important;
          font-size: 0.875rem !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          padding: 1rem !important;
          border-radius: 16px !important;
          border: none !important;
          cursor: pointer !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25) !important;
          transition: all 0.2s ease !important;
        }

        .auth-btn-submit:hover {
          background: #4338ca !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35) !important;
        }

        .auth-btn-submit:active {
          transform: scale(0.98) !important;
        }

        .auth-btn-submit:disabled {
          opacity: 0.55 !important;
          cursor: not-allowed !important;
          transform: none !important;
        }
      `}</style>

      <div className='mx-auto max-w-md space-y-8'>
        <motion.div variants={itemVariants} className='text-center'>
          <div className='mb-6 flex justify-center'>
            {isAdminLoginMode ? (
              <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 shadow-md shadow-amber-500/10 dark:border-amber-900/40 dark:bg-amber-950/60 dark:text-amber-400'>
                <Shield className='h-6 w-6' />
              </div>
            ) : (
              <div className='text-indigo-650 flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 shadow-md shadow-indigo-500/5 dark:border-indigo-900/30 dark:bg-indigo-950/60 dark:text-indigo-400 dark:shadow-black/10'>
                <GraduationCap className='h-6 w-6' />
              </div>
            )}
          </div>
          <h2 className='auth-title'>
            {isAdminLoginMode ? 'Super Admin Portal' : 'Welcome Back'}
          </h2>
          <p className='auth-subtitle'>
            {isAdminLoginMode
              ? 'Authorized Administrator Authentication'
              : 'Sign in to your project portal'}
          </p>
        </motion.div>

        {error && (
          <motion.div
            variants={itemVariants}
            className='flex animate-error-shake items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs font-bold text-rose-600 dark:border-rose-900/30 dark:bg-rose-950/15 dark:text-rose-400'
          >
            <AlertCircle className='h-5 w-5 flex-shrink-0 text-rose-500 dark:text-rose-400' />
            <span>{error}</span>
          </motion.div>
        )}

        <form className='space-y-6' onSubmit={handleSubmit} noValidate>
          {/* Email Address Input */}
          <motion.div variants={itemVariants} className='group'>
            <label className='auth-label'>Email Address</label>
            <div className='relative flex items-center'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:text-slate-500 dark:text-slate-400 dark:group-focus-within:text-indigo-400'>
                <Mail className='h-5 w-5 shrink-0' />
              </div>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='auth-input !pl-11'
                placeholder='you@university.edu'
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div variants={itemVariants} className='group'>
            <div className='mb-2 flex items-center justify-between'>
              <label className='auth-label mb-0'>Password</label>
              <Link
                to='/forgot-password'
                className='text-indigo-650 dark:text-indigo-455 dark:hover:text-indigo-350 text-xs font-bold transition-colors hover:text-indigo-500 hover:underline'
              >
                Forgot password?
              </Link>
            </div>
            <div className='relative flex items-center'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-indigo-600 dark:text-slate-500 dark:text-slate-400 dark:group-focus-within:text-indigo-400'>
                <Lock className='h-5 w-5 shrink-0' />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='auth-input !pl-11'
                placeholder='••••••••'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='dark:text-slate-505 dark:hover:text-slate-205 absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-300'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5 shrink-0' />
                ) : (
                  <Eye className='h-5 w-5 shrink-0' />
                )}
              </button>
            </div>
          </motion.div>

          {/* Remember Me Checkbox */}
          <motion.div variants={itemVariants} className='flex items-center'>
            <input
              id='remember-me'
              name='remember-me'
              type='checkbox'
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className='h-4.5 w-4.5 border-slate-350 text-indigo-650 dark:focus:ring-indigo-550/30 rounded bg-white dark:bg-slate-900 focus:ring-indigo-500/30 dark:border-slate-800 /60'
            />
            <label
              htmlFor='remember-me'
              className='ml-2.5 block cursor-pointer select-none text-xs font-bold text-slate-600 dark:text-slate-400'
            >
              Remember Me
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            type='submit'
            disabled={loading}
            className='auth-btn-submit'
          >
            {loading ? (
              <div className='flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span>Signing In...</span>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <span>Sign In</span>
                <ArrowRight className='h-4 w-4' />
              </div>
            )}
          </motion.button>
        </form>

        <motion.div variants={itemVariants} className='pt-2 text-center'>
          <p className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-indigo-650 font-bold hover:text-indigo-500 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300'
            >
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
});

Login.displayName = 'Login';

export default Login;
