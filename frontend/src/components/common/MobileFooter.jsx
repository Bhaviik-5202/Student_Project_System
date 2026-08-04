import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GraduationCap, Shield, Heart, Sparkles, HelpCircle } from 'lucide-react';

/**
 * MobileFooter Component
 *
 * Ultra-sleek, modern mobile footer integrated cleanly into the page layout.
 * Features a compact card design, pill navigation links, and dark mode support.
 */
const MobileFooter = memo(() => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  const getDashboardPath = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/admin-dashboard' : '/dashboard';
  };

  return (
    <footer className='block md:hidden w-full px-3 pt-2 pb-24 transition-colors duration-200'>
      <div className='rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-5 shadow-xs dark:border-slate-800/80 dark:from-slate-900 dark:to-slate-950 text-center space-y-4'>
        {/* Brand Badge Header */}
        <div className='flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3.5'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xs'>
              <GraduationCap className='h-4 w-4' />
            </div>
            <div className='text-left'>
              <h3 className='text-xs font-bold text-slate-900 dark:text-white leading-none'>
                Student Project System
              </h3>
              <p className='text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5'>
                v2.4.0 • Enterprise
              </p>
            </div>
          </div>

          <span className='inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40'>
            <Sparkles className='h-3 w-3 text-amber-500' />
            Academic Hub
          </span>
        </div>

        {/* Quick Nav Links Grid / Pills */}
        <div className='flex flex-wrap items-center justify-center gap-2 text-xs font-semibold'>
          <Link
            to={getDashboardPath()}
            className='rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-slate-700 shadow-2xs active:scale-95 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200'
          >
            Dashboard
          </Link>
          <Link
            to='/about'
            className='rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-slate-700 shadow-2xs active:scale-95 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200'
          >
            About
          </Link>
          <Link
            to='/privacy'
            className='rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-slate-700 shadow-2xs active:scale-95 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200'
          >
            Privacy
          </Link>
          <Link
            to='/terms'
            className='rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-slate-700 shadow-2xs active:scale-95 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200'
          >
            Terms
          </Link>
          <Link
            to='/contact'
            className='rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-slate-700 shadow-2xs active:scale-95 transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200'
          >
            Support
          </Link>
        </div>

        {/* Footer Subtext */}
        <div className='pt-1 text-[11px] text-slate-400 dark:text-slate-500 space-y-0.5'>
          <p>© {currentYear} Student Project System. All rights reserved.</p>
          <p className='text-[10px] text-slate-400/80 dark:text-slate-500/80'>
            Crafted for academic excellence & project governance
          </p>
        </div>
      </div>
    </footer>
  );
});

MobileFooter.displayName = 'MobileFooter';

export default MobileFooter;
