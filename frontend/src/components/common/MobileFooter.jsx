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
 * MobileFooter — Premium mobile-only footer (< 768px)
 * Minimal, elegant, perfectly spaced above the floating BottomNav.
 */
const MobileFooter = memo(() => {
  const { user } = useAuth();
  const year = new Date().getFullYear();
  const dashPath = !user ? '/' : user.role === 'admin' ? '/admin-dashboard' : '/dashboard';

  return (
    <footer className='block md:hidden'>
      {/* Gradient divider */}
      <div className='mx-5 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700' />

      <div className='px-5 py-6 pb-28 space-y-5'>

        {/* Brand row */}
        <Link to={dashPath} className='flex items-center gap-2.5 w-fit active:opacity-75 transition-opacity'>
          <div className='h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm'>
            <GraduationCap className='h-4 w-4 text-white' />
          </div>
          <div>
            <p className='text-xs font-bold text-slate-900 dark:text-white leading-none'>Student Project System</p>
            <p className='text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5'>v2.4.0 · Academic Build</p>
          </div>
        </Link>

        {/* Links — two rows */}
        <div className='flex flex-wrap gap-x-5 gap-y-2'>
          {[
            { label: 'About',    path: '/about',    icon: Info },
            { label: 'Help',     path: '/help',     icon: HelpCircle },
            { label: 'Contact',  path: '/contact',  icon: Mail },
            { label: 'Feedback', path: '/feedback', icon: MessageSquare },
            { label: 'Privacy',  path: '/privacy',  icon: Shield },
            { label: 'Terms',    path: '/terms',    icon: FileText },
          ].map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className='flex items-center gap-1 text-[12px] font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 active:opacity-70 transition-colors'
            >
              <Icon className='h-3 w-3' />
              {label}
            </Link>
          ))}
        </div>

        {/* Bottom copyright row */}
        <div className='flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800'>
          <p className='text-[11px] text-slate-400 dark:text-slate-600'>
            © {year} Student Project System
          </p>
          <span className='inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-600'>
            <ExternalLink className='h-2.5 w-2.5' />
            All rights reserved
          </span>
        </div>

      </div>
    </footer>
  );
});

MobileFooter.displayName = 'MobileFooter';
export default MobileFooter;
