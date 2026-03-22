import { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowRight,
  Heart,
  Cpu,
  ShieldCheck,
  Globe,
} from 'lucide-react';

/**
 * Premium Footer Component
 *
 * Enhanced version with modern aesthetics, social links,
 * and a cleaner, more interactive layout.
 */
const Footer = memo(() => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      className='relative overflow-hidden border-t border-slate-800/50 bg-slate-950 py-16 text-slate-400'
      role='contentinfo'
    >
      {/* Decorative Gradient Background */}
      <div className='pointer-events-none absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl'></div>
      <div className='pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl'></div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 grid grid-cols-1 gap-12 md:grid-cols-12'>
          {/* Brand and Mission */}
          <div className='md:col-span-4'>
            <Link to='/' className='group mb-6 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-110'>
                <ShieldCheck className='h-6 w-6 text-white' />
              </div>
              <span className='text-xl font-bold tracking-tight text-white'>
                Project
                <span className='text-2xl leading-none text-blue-500'>.</span>
                Point
              </span>
            </Link>
            <p className='mb-8 max-w-sm text-sm leading-relaxed text-slate-400'>
              Empowering the next generation of innovators with a streamlined
              platform for academic excellence and collaborative project
              management.
            </p>
            <div className='flex items-center gap-4'>
              <a
                href='https://github.com'
                target='_blank'
                rel='noopener noreferrer'
                className='group flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white'
              >
                <Github size={18} />
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='group flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white'
              >
                <Linkedin size={18} />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='group flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white'
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='md:col-span-2'>
            <h3 className='mb-6 text-sm font-semibold uppercase tracking-widest text-white'>
              Explore
            </h3>
            <ul className='space-y-4'>
              {['Dashboard', 'Projects', 'Meetings', 'Schedule'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className='group flex items-center gap-2 text-sm transition-colors hover:text-blue-400'
                  >
                    <span className='h-1 w-1 scale-0 rounded-full bg-blue-500 transition-transform group-hover:scale-100'></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className='md:col-span-2'>
            <h3 className='mb-6 text-sm font-semibold uppercase tracking-widest text-white'>
              Support
            </h3>
            <ul className='space-y-4'>
              {[
                { name: 'Help Center', path: '/help' },
                { name: 'Global FAQ', path: '/faq' },
                { name: 'Contact Us', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className='group flex items-center gap-2 text-sm transition-colors hover:text-blue-400'
                  >
                    <span className='h-1 w-1 scale-0 rounded-full bg-blue-500 transition-transform group-hover:scale-100'></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className='md:col-span-4'>
            <h3 className='mb-6 text-sm font-semibold uppercase tracking-widest text-white'>
              Stay Updated
            </h3>
            <p className='mb-6 text-sm text-slate-500'>
              Get the latest platform updates and academic resources delivered.
            </p>
            <form
              className='group relative'
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type='email'
                placeholder='Enter your email'
                className='w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white transition-all placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
              />
              <button
                className='absolute right-2 top-2 rounded-lg bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700 group-hover:translate-x-0'
                aria-label='Subscribe'
              >
                <ArrowRight size={18} />
              </button>
            </form>
            <div className='mt-8 flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <div className='relative'>
                  <span className='block h-2.5 w-2.5 rounded-full bg-emerald-500'></span>
                  <span className='absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-75'></span>
                </div>
                <span className='text-xs font-medium uppercase tracking-wide text-emerald-500/90'>
                  Operational
                </span>
              </div>
              <div className='flex items-center gap-2 text-slate-500'>
                <Cpu size={14} />
                <span className='text-xs font-medium'>v2.1.0-stable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='flex flex-col items-center justify-between gap-6 border-t border-slate-900 pt-8 md:flex-row'>
          <div className='flex items-center gap-2 text-xs text-slate-500'>
            <span>© {currentYear} Student Project Management System.</span>
            <span className='hidden md:inline'>•</span>
            <span className='flex items-center gap-1'>
              Crafted with{' '}
              <Heart size={12} className='fill-rose-500/10 text-rose-500' /> for
              researchers.
            </span>
          </div>

          <div className='flex items-center gap-8'>
            <Link
              to='/privacy'
              className='text-xs transition-colors hover:text-white'
            >
              Privacy Policy
            </Link>
            <Link
              to='/terms'
              className='text-xs transition-colors hover:text-white'
            >
              Terms of Service
            </Link>
            <div className='flex items-center gap-1.5 text-xs text-slate-600'>
              <Globe size={12} />
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
