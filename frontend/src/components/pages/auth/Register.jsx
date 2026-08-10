import { useState, memo, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  GraduationCap,
  UserCheck,
  Building,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { VALIDATION_RULES } from '../../../utils/constants';
import api from '../../../utils/api';

/**
 * Register Component - Account creation form
 * Redesigned with clean inputs, sliding Framer Motion tab indicators,
 * and a sleek minimal inline password strength meter. Full Light and Dark theme support.
 */
const Register = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    semester: '',
    academicYear: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [academicOptions, setAcademicOptions] = useState({
    departments: [
      'Computer Engineering',
      'Information Technology',
      'Electronics & Communication',
      'Mechanical Engineering',
      'Civil Engineering',
      'Electrical Engineering',
      'AI & Data Science',
    ],
    semesters: [
      'Semester 1',
      'Semester 2',
      'Semester 3',
      'Semester 4',
      'Semester 5',
      'Semester 6',
      'Semester 7',
      'Semester 8',
    ],
    academicYears: ['2024-25', '2025-26', '2026-27', '2027-28'],
  });
  const [optionsLoading, setOptionsLoading] = useState(false);

  const { register, isLoading: loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);
        const res = await api.get('/auth/academic-options');
        if (isMounted && res && res.data) {
          setAcademicOptions({
            departments: res.data.departments || academicOptions.departments,
            semesters: res.data.semesters || academicOptions.semesters,
            academicYears: res.data.academicYears || academicOptions.academicYears,
          });
        }
      } catch (err) {
        console.warn('Academic options fallback in use:', err.message);
      } finally {
        if (isMounted) setOptionsLoading(false);
      }
    };
    fetchOptions();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (passwordChecks.length) score++;
    if (passwordChecks.uppercase && passwordChecks.lowercase) score++;
    if (passwordChecks.number && passwordChecks.special) score++;
    return score;
  }, [passwordChecks]);

  const strengthColor = useMemo(() => {
    if (passwordStrength === 1) return 'bg-rose-500';
    if (passwordStrength === 2) return 'bg-amber-500';
    if (passwordStrength === 3) return 'bg-emerald-500';
    return 'bg-slate-800';
  }, [passwordStrength]);

  const strengthText = useMemo(() => {
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Strong';
    return 'Very Weak';
  }, [passwordStrength]);

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

      if (formData.role === 'student') {
        if (!formData.department) {
          toast.error('Please select your Department');
          return;
        }
        if (!formData.semester) {
          toast.error('Please select your Semester');
          return;
        }
        if (!formData.academicYear) {
          toast.error('Please select your Academic Year');
          return;
        }
      }

      if (!isPasswordValid) {
        toast.error('Password does not meet all security requirements');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      try {
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: 'student',
          department: formData.department,
          semester: formData.semester,
          academicYear: formData.academicYear,
        };

        const res = await register(payload);

        if (res && res.success) {
          toast.success(
            res.message || 'Registration successful! Verification code sent.'
          );
          navigate(
            `/verify-otp?email=${encodeURIComponent(formData.email.trim())}`
          );
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
        staggerChildren: 0.07,
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
      className='auth-card relative mx-auto w-full max-w-xl space-y-6 sm:space-y-8 p-4 sm:p-8 md:p-10'
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
          padding-top: 1.125rem !important;
          padding-bottom: 1.125rem !important;
          padding-left: 1.25rem !important;
          padding-right: 1.25rem !important;
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
          padding: 1.125rem !important;
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

        .role-select-container {
          display: flex !important;
          gap: 0.5rem !important;
          padding: 0.375rem !important;
          border-radius: 16px !important;
          background: rgba(241, 245, 249, 0.8) !important;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .dark .role-select-container {
          background: rgba(8, 10, 18, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        .role-select-btn {
          flex: 1 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem !important;
          padding: 0.75rem 1rem !important;
          border-radius: 12px !important;
          font-size: 0.8125rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.025em !important;
          border: 1px solid transparent !important;
          background: transparent !important;
          color: #64748b !important;
          cursor: pointer !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .dark .role-select-btn {
          color: #94a3b8 !important;
        }

        .role-select-btn:hover {
          color: #1e293b !important;
          background: rgba(255, 255, 255, 0.6) !important;
        }

        .dark .role-select-btn:hover {
          color: #f8fafc !important;
          background: rgba(255, 255, 255, 0.06) !important;
        }

        .role-select-btn.active {
          background: #ffffff !important;
          color: #4f46e5 !important;
          border: 1px solid rgba(79, 70, 229, 0.3) !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05) !important;
        }

        .dark .role-select-btn.active {
          background: rgba(79, 70, 229, 0.25) !important;
          color: #a5b4fc !important;
          border: 1px solid rgba(129, 140, 248, 0.4) !important;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3) !important;
        }
      `}</style>

      <motion.div variants={itemVariants} className='text-center'>
        <h2 className='auth-title'>Create Account</h2>
        <p className='auth-subtitle'>Join the student project portal</p>
      </motion.div>

      <form className='space-y-6' onSubmit={handleSubmit} noValidate>
        {/* Full Name Input */}
        <motion.div variants={itemVariants} className='group'>
          <label className='auth-label'>Full Name</label>
          <input
            name='name'
            type='text'
            required
            value={formData.name}
            onChange={handleChange}
            className='auth-input'
            placeholder='Jane Smith'
          />
        </motion.div>

        {/* Email Address Input */}
        <motion.div variants={itemVariants} className='group'>
          <label className='auth-label'>Email Address</label>
          <input
            name='email'
            type='email'
            required
            value={formData.email}
            onChange={handleChange}
            className='auth-input'
            placeholder='darshan@university.edu'
          />
        </motion.div>

        {/* Academic Profile Details for Student Signup */}
        {formData.role === 'student' && (
          <motion.div variants={itemVariants} className='space-y-4'>
            {/* Department Selection */}
            <div className='group'>
              <label className='auth-label'>
                Department <span className='text-rose-500'>*</span>
              </label>
              <select
                name='department'
                required
                value={formData.department}
                onChange={handleChange}
                className='auth-input cursor-pointer'
              >
                <option value=''>[ Select Department ]</option>
                {academicOptions.departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester & Academic Year 2-Column Responsive Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Semester Selection */}
              <div className='group'>
                <label className='auth-label'>
                  Semester <span className='text-rose-500'>*</span>
                </label>
                <select
                  name='semester'
                  required
                  value={formData.semester}
                  onChange={handleChange}
                  className='auth-input cursor-pointer'
                >
                  <option value=''>[ Select Semester ]</option>
                  {academicOptions.semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Year Selection */}
              <div className='group'>
                <label className='auth-label'>
                  Academic Year <span className='text-rose-500'>*</span>
                </label>
                <select
                  name='academicYear'
                  required
                  value={formData.academicYear}
                  onChange={handleChange}
                  className='auth-input cursor-pointer'
                >
                  <option value=''>[ Select Year ]</option>
                  {academicOptions.academicYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Password Input - Separate line */}
        <motion.div variants={itemVariants} className='group'>
          <label className='auth-label'>Password</label>
          <div className='relative'>
            <input
              name='password'
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              className='auth-input'
              style={{ paddingRight: '3.5rem' }}
              placeholder='••••••••'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='dark:text-slate-505 dark:hover:text-slate-205 absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-300'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
        </motion.div>

        {/* Confirm Password Input - Separate line */}
        <motion.div variants={itemVariants} className='group'>
          <label className='auth-label'>Confirm Password</label>
          <div className='relative'>
            <input
              name='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className='auth-input'
              style={{ paddingRight: '3.5rem' }}
              placeholder='••••••••'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='dark:text-slate-505 dark:hover:text-slate-205 absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-300'
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
        </motion.div>

        {/* Strength Checker - Sleek Minimal Inline Bar (Expands dynamically when password exists) */}
        <AnimatePresence>
          {formData.password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className='overflow-hidden'
            >
              <div className='space-y-2 pt-1'>
                <div className='flex items-center justify-between'>
                  <span className='text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                    Password Strength:{' '}
                    <span
                      className={
                        passwordStrength === 3
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : passwordStrength === 2
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'dark:text-rose-455 text-rose-600'
                      }
                    >
                      {strengthText}
                    </span>
                  </span>
                </div>

                {/* 3-Segment strength bar */}
                <div className='flex h-1 gap-1.5'>
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                        passwordStrength >= index
                          ? strengthColor
                          : 'bg-slate-200 dark:bg-slate-900/60'
                      }`}
                    />
                  ))}
                </div>

                {/* Checklist items in a single horizontal row */}
                <div className='text-slate-450 flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] font-bold dark:text-slate-500 dark:text-slate-400'>
                  <span
                    className={`transition-colors ${passwordChecks.length ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                  >
                    • 8+ characters
                  </span>
                  <span
                    className={`transition-colors ${passwordChecks.uppercase && passwordChecks.lowercase ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                  >
                    • Mix case (aA)
                  </span>
                  <span
                    className={`transition-colors ${passwordChecks.number && passwordChecks.special ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                  >
                    • Number & Symbol
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <span>Create Account</span>
              <ArrowRight className='h-4 w-4' />
            </div>
          )}
        </motion.button>
      </form>

      <motion.div variants={itemVariants} className='pt-2 text-center'>
        <p className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='text-indigo-650 font-bold hover:text-indigo-500 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300'
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
});

Register.displayName = 'Register';

export default Register;
