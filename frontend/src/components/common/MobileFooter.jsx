import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  GraduationCap,
  Shield,
  FileText,
  HelpCircle,
  Mail,
  Info,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

/**
 * MobileFooter — Ultra-Premium mobile-only footer (< 768px)
 * Matches the glassmorphic style of the new mobile dashboard.
 */
const MobileFooter = memo(() => {
  const { user } = useAuth();
  const year = new Date().getFullYear();
  const dashPath = !user ? '/' : user.role === 'admin' ? '/admin-dashboard' : '/dashboard';

  return (
    <footer className='block md:hidden relative mt-8 pb-[88px]'>
      <div className='absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/80 dark:to-slate-900/80 pointer-events-none' />

      {/* Decorative Blur */}
      <div className='absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-full max-w-sm rounded-t-[100%] bg-blue-500/10 blur-3xl pointer-events-none' />

      <div className='relative z-10 px-5 pt-8 pb-4 space-y-6'>
        {/* Brand row */}
        <Link to={dashPath} className='flex items-center gap-3 w-fit transition-transform active:scale-95'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30'>
            <GraduationCap className='h-5 w-5 text-white' />
          </div>
          <div className='flex flex-col'>
            <p className='text-[14px] font-black tracking-tight text-slate-900 dark:text-white leading-tight'>
              Student Project System
            </p>
            <p className='text-[10px] font-semibold tracking-widest text-slate-500 uppercase mt-0.5'>
              Academic Build v2.5
            </p>
          </div>
        </Link>

        {/* Links Grid */}
        <div className='grid grid-cols-2 gap-3'>
          {[
            { label: 'About Us',    path: '/about',    icon: Info },
            { label: 'Help Center', path: '/help',     icon: HelpCircle },
            { label: 'Contact',     path: '/contact',  icon: Mail },
            { label: 'Feedback',    path: '/feedback', icon: MessageSquare },
            { label: 'Privacy',     path: '/privacy',  icon: Shield },
            { label: 'Terms',       path: '/terms',    icon: FileText },
          ].map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className='flex items-center gap-2 rounded-2xl bg-white/60 p-3 shadow-sm backdrop-blur-md transition-transform active:scale-95 dark:bg-slate-800/60'
            >
              <div className='flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/50'>
                <Icon className='h-3.5 w-3.5 text-slate-600 dark:text-slate-300' />
              </div>
              <span className='text-[12px] font-bold text-slate-700 dark:text-slate-300'>
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom copyright row */}
        <div className='flex flex-col items-center justify-center pt-6 gap-2 border-t border-slate-200/60 dark:border-slate-800'>
          <span className='inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400'>
            <ExternalLink className='h-3 w-3' />
            All rights reserved
          </span>
          <p className='text-[11px] font-semibold text-slate-400 dark:text-slate-500'>
            © {year} SPS Architecture
          </p>
        </div>
      </div>
    </footer>
  );
});

MobileFooter.displayName = 'MobileFooter';
export default MobileFooter;
