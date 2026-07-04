import { useState, memo, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { VALIDATION_RULES } from '../../../utils/constants';

/**
 * Register Component - Account creation form
 * Enhanced with premium UI, validations, and interactive feedback.
 */
const Register = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const { register, isLoading: loading } = useAuth();
  const navigate = useNavigate();

  // Calculate password check states dynamically
  const passwordChecks = useMemo(() => {
    const pass = formData.password;
    return {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /\d/.test(pass),
      special: /[@$!%*?&]/.test(pass),
    };
  }, [formData.password]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordChecks).every(Boolean);
  }, [passwordChecks]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Client-side validations
      if (formData.name.trim().length < 2) {
        toast.error('Full Name must be at least 2 characters long');
        return;
      }

      if (!VALIDATION_RULES.EMAIL.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      if (!isPasswordValid) {
        toast.error('Password does not meet all security requirements');
        setShowPasswordRequirements(true);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      try {
        const res = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: 'student',
        });
        
        if (res && res.success) {
          toast.success(res.message || 'Registration successful! Verification code sent.');
          navigate(`/verify-otp?email=${encodeURIComponent(formData.email.trim())}`);
        } else {
          toast.error(res?.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    },
    [formData, register, navigate, isPasswordValid]
  );

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <div className='mb-4 flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'>
            <UserPlus className='h-8 w-8 text-white' />
          </div>
        </div>
        <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
          Create Account
        </h2>
        <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
          Join the student project management portal
        </p>
      </div>

      <form className='space-y-5' onSubmit={handleSubmit} noValidate>
        <div className='space-y-4'>
          {/* Full Name Input */}
          <div className='group'>
            <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
              Full Name
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                <User className='h-5 w-5' />
              </div>
              <input
                name='name'
                type='text'
                required
                value={formData.name}
                onChange={handleChange}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500/30 transition-all'
                placeholder='Jane Smith'
              />
            </div>
          </div>

          {/* Email Address Input */}
          <div className='group'>
            <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
              Email Address
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                <Mail className='h-5 w-5' />
              </div>
              <input
                name='email'
                type='email'
                required
                value={formData.email}
                onChange={handleChange}
                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500/30 transition-all'
                placeholder='jane@university.edu'
              />
            </div>
          </div>

          {/* Password Inputs */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='group'>
              <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                  <Lock className='h-5 w-5' />
                </div>
                <input
                  name='password'
                  type='password'
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500/30 transition-all'
                  placeholder='••••••••'
                />
              </div>
            </div>
            <div className='group'>
              <label className='mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300'>
                Confirm Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors'>
                  <ShieldCheck className='h-5 w-5' />
                </div>
                <input
                  name='confirmPassword'
                  type='password'
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500/30 transition-all'
                  placeholder='••••••••'
                />
              </div>
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

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          className='mt-4 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-500/15 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all'
        >
          {loading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <span>Create Account</span>
              <ArrowRight className='h-5 w-5' />
            </div>
          )}
        </button>
      </form>

      <div className='pt-2 text-center'>
        <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-bold text-blue-600 hover:underline dark:text-blue-400'
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
