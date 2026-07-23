import { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Heart,
  Cpu,
  ShieldCheck,
  Globe,
  MapPin,
  Phone,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

/**
 * Footer Component
 * variant='full'    → Rich multi-column footer (Dashboard only)
 * variant='minimal' → Single-line copyright bar (all other pages)
 */
const Footer = memo(({ variant = 'minimal' }) => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  /* ─── Minimal footer ─────────────────────────────────────────── */
  if (variant === 'minimal') {
    return (
      <footer
        className='border-t border-slate-200 bg-white py-3 dark:border-slate-800 dark:bg-slate-950'
        role='contentinfo'
      >
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-4 sm:flex-row sm:px-6 lg:px-8'>
          <p className='text-[11px] text-slate-400 dark:text-slate-500'>
            © {currentYear} Student Project System. All rights reserved.
          </p>
          <p className='flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500'>
            Built with <Heart size={10} className='fill-rose-400 text-rose-400' /> for academic excellence
          </p>
        </div>
      </footer>
    );
  }

  /* ─── Full footer (dashboard only) ──────────────────────────── */
  return (
    <footer
      className='relative overflow-hidden border-t border-slate-800/80 bg-slate-950 py-16 text-slate-400 select-none'
      role='contentinfo'
    >
      {/* Background SVG Grid Pattern */}
      <div className='pointer-events-none absolute inset-0 opacity-15'>
        <svg className='h-full w-full' xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
          <defs>
            <pattern id='footer-grid' width='40' height='40' patternUnits='userSpaceOnUse'>
              <path d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255, 255, 255, 0.15)' strokeWidth='1' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#footer-grid)' />
        </svg>
      </div>

      {/* Decorative Blur Glows */}
      <div className='pointer-events-none absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl' />
      <div className='pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 grid grid-cols-1 gap-12 md:grid-cols-12'>

          {/* Brand & Platform Tagline */}
          <div className='md:col-span-4'>
            <Link to='/' className='group mb-6 flex w-fit items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105'>
                <ShieldCheck className='h-6 w-6 text-white' />
              </div>
              <div className='flex flex-col'>
                <span className='text-xl font-bold tracking-tight text-white'>
                  Student<span className='text-blue-500'>.</span>Project<span className='text-indigo-400'>.</span>System
                </span>
                <span className='text-[10px] uppercase font-semibold tracking-widest text-slate-500'>
                  Academic Excellence Portal
                </span>
              </div>
            </Link>

            <p className='mb-6 max-w-sm text-sm leading-relaxed text-slate-400'>
              Streamlining academic project lifecycles, milestone tracking, and faculty evaluations into a unified, secure platform.
            </p>

            <div className='flex items-center gap-3'>
              {[
                { href: 'https://github.com/Bhaviik-5202', icon: Github, label: 'GitHub' },
                { href: 'https://linkedin.com/in/bhavik-parmar-51baa1303/', icon: Linkedin, label: 'LinkedIn' },
                { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
                { href: 'mailto:er.bhavik5202@gmail.com', icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 transition-all duration-200 hover:border-blue-500 hover:bg-blue-600 hover:text-white'
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className='md:col-span-3'>
            <h3 className='mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200'>
              <BookOpen size={14} className='text-blue-400' /> Navigation & Tools
            </h3>
            <ul className='space-y-3 text-sm'>
              {[
                { name: 'Overview Dashboard', path: '/dashboard' },
                { name: 'Project Repository', path: '/projects' },
                { name: 'Faculty Meetings', path: '/meetings' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className='group flex items-center gap-2 transition-colors hover:text-blue-400'
                  >
                    <span className='h-1.5 w-1.5 rounded-full bg-slate-700 transition-colors group-hover:bg-blue-500' />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support Info */}
          <div className='md:col-span-3'>
            <h3 className='mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200'>
              <HelpCircle size={14} className='text-indigo-400' /> Campus & Contact
            </h3>
            <ul className='space-y-3 text-sm'>
              <li className='flex items-start gap-2.5 text-slate-400'>
                <MapPin size={16} className='mt-0.5 shrink-0 text-slate-500' />
                <span>Department of Computer Science & Engineering</span>
              </li>
              <li className='flex items-center gap-2.5 text-slate-400'>
                <Mail size={16} className='shrink-0 text-slate-500' />
                <a href='mailto:er.bhavik5202@gmail.com' className='transition-colors hover:text-blue-400'>
                  er.bhavik5202@gmail.com
                </a>
              </li>
              <li className='flex items-center gap-2.5 text-slate-400'>
                <Phone size={16} className='shrink-0 text-slate-500' />
                <span>+91 (0288) 2211401</span>
              </li>
            </ul>
          </div>

          {/* Platform Status */}
          <div className='md:col-span-2'>
            <h3 className='mb-5 text-xs font-bold uppercase tracking-wider text-slate-200'>
              System Status
            </h3>
            <div className='rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 backdrop-blur-sm'>
              <div className='mb-3 flex items-center gap-2'>
                <div className='relative'>
                  <span className='block h-2.5 w-2.5 rounded-full bg-emerald-500' />
                  <span className='absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-75' />
                </div>
                <span className='text-xs font-semibold text-emerald-400'>Operational</span>
              </div>
              <p className='mb-3 text-[11px] leading-snug text-slate-400'>
                All backend APIs & real-time sync active.
              </p>
              <div className='flex items-center gap-1.5 border-t border-slate-800 pt-2.5 text-[11px] text-slate-500'>
                <Cpu size={12} />
                <span>v2.0.0 • Beta Release</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar / Copyright */}
        <div className='flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 md:flex-row'>
          <p className='text-xs text-slate-500'>
            © {currentYear} Student Project System. All rights reserved.
          </p>
          <div className='flex items-center gap-6 text-xs text-slate-500'>
            <span className='flex items-center gap-1'>
              Built with <Heart size={12} className='fill-rose-500 text-rose-500' /> for academic excellence
            </span>
            <div className='flex items-center gap-1 text-slate-600'>
              <Globe size={13} />
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

Footer.propTypes = {
  variant: PropTypes.oneOf(['full', 'minimal']),
};

export default Footer;
