import { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Heart,
  Shield,
  Zap,
  Layers,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Users,
} from 'lucide-react';

// ─── Constants ──────────────────────────────────────────────
const SOCIAL_LINKS = [
  { href: 'https://github.com/Bhaviik-5202', icon: Github, label: 'GitHub' },
  {
    href: 'https://linkedin.com/in/bhavik-parmar-51baa1303/',
    icon: Linkedin,
    label: 'LinkedIn',
  },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'mailto:er.bhavik5202@gmail.com', icon: Mail, label: 'Email' },
];

const QUICK_LINKS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Projects Catalog', path: '/projects' },
  { name: 'Teams & Groups', path: '/teams' },
  { name: 'Resource Library', path: '/resources' },
];

const SUPPORT_LINKS = [
  { name: 'Help Center', path: '/help' },
  { name: 'Documentation', path: '/docs' },
  { name: 'FAQ', path: '/faq' },
  { name: 'System Status', path: '/status' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Platform Feedback', path: '/feedback' },
];

const FEATURES = [
  { icon: Zap, text: 'Real-time Updates' },
  { icon: Layers, text: 'Project Management' },
  { icon: Award, text: 'Faculty Evaluation' },
  { icon: Shield, text: 'Secure Platform' },
];

// ─── Sub-components ─────────────────────────────────────────

const SocialLink = memo(({ href, icon: Icon, label }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    aria-label={label}
    className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900/5 text-slate-500 dark:text-slate-400 transition-all duration-300 hover:bg-indigo-500 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900'
  >
    <Icon size={16} aria-hidden='true' />
  </a>
));

SocialLink.displayName = 'SocialLink';
SocialLink.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
};

const FooterLink = memo(({ name, path }) => (
  <li>
    <Link
      to={path}
      className='group inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 transition-all duration-200 hover:text-indigo-600 dark:hover:text-white hover:translate-x-1 focus:text-indigo-600 dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 rounded-md px-1 py-0.5'
    >
      <ArrowRight
        size={12}
        className='opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-indigo-500 dark:text-current'
        aria-hidden='true'
      />
      {name}
    </Link>
  </li>
));

FooterLink.displayName = 'FooterLink';
FooterLink.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

const FeatureBadge = memo(({ icon: Icon, text }) => (
  <div className='flex items-center gap-2 rounded-full bg-slate-100/80 dark:bg-slate-900/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/5 px-3 py-1.5'>
    <Icon
      size={14}
      className='text-indigo-500 dark:text-indigo-400'
      aria-hidden='true'
    />
    <span className='text-xs text-slate-700 dark:text-slate-300'>{text}</span>
  </div>
));

FeatureBadge.displayName = 'FeatureBadge';
FeatureBadge.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
};

// ─── Main Component ─────────────────────────────────────────

const Footer = memo(({ variant = 'minimal' }) => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // ─── Minimal Footer ──────────────────────────────────────
  if (variant === 'minimal') {
    return (
      <footer
        className='border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-4 transition-colors'
        role='contentinfo'
        aria-label='Site footer'
      >
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md shadow-indigo-500/20'>
              <Shield size={16} className='text-white' />
            </div>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              © {currentYear}{' '}
              <span className='font-semibold text-slate-800 dark:text-white'>
                Student Project System
              </span>
            </p>
          </div>

          <div className='flex items-center gap-6'>
            <span className='flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
              <Sparkles
                size={12}
                className='text-indigo-500 dark:text-indigo-400'
                aria-hidden='true'
              />
              <span>Making education better</span>
            </span>
            <div className='flex items-center gap-2'>
              {SOCIAL_LINKS.slice(0, 3).map((link) => (
                <SocialLink key={link.label} {...link} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // ─── Full Footer ────────────────────────────────────────
  return (
    <footer
      className='relative bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-700 dark:text-slate-300 pt-16 pb-6 border-t border-slate-200 dark:border-transparent transition-colors'
      role='contentinfo'
      aria-label='Site footer'
    >
      {/* Decorative Elements - Only visible in dark mode */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none dark:block hidden'>
        <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl' />
        <div className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-3xl' />
      </div>

      {/* Light mode decorative elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none dark:hidden'>
        <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-50 blur-3xl' />
        <div className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-50 blur-3xl' />
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-12 lg:gap-8'>
          {/* Brand Section */}
          <div className='md:col-span-4 space-y-6'>
            <Link
              to='/dashboard'
              className='inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950 rounded-lg'
            >
              <div className='relative'>
                <div className='absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-500/30 transition-all duration-300' />
                <div className='relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25'>
                  <Shield size={22} className='text-white' />
                </div>
              </div>
              <div>
                <h2 className='text-xl font-bold text-slate-900 dark:text-white tracking-tight'>
                  Student
                  <span className='text-indigo-500 dark:text-indigo-400'>
                    .
                  </span>
                  Project
                </h2>
                <p className='text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase'>
                  Academic Platform
                </p>
              </div>
            </Link>

            <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm'>
              Empowering students and faculty with modern tools for academic
              project management, collaboration, and evaluation.
            </p>

            <div className='flex flex-wrap gap-2'>
              {FEATURES.map((feature) => (
                <FeatureBadge key={feature.text} {...feature} />
              ))}
            </div>

            <div className='flex flex-wrap gap-3 pt-2'>
              {SOCIAL_LINKS.map((link) => (
                <SocialLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav className='md:col-span-2' aria-label='Quick links'>
            <h3 className='text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white mb-4'>
              Quick Links
            </h3>
            <ul className='space-y-2.5'>
              {QUICK_LINKS.map((link) => (
                <FooterLink key={link.name} {...link} />
              ))}
            </ul>
          </nav>

          {/* Support */}
          <nav className='md:col-span-2' aria-label='Support links'>
            <h3 className='text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white mb-4'>
              Support
            </h3>
            <ul className='space-y-2.5'>
              {SUPPORT_LINKS.map((link) => (
                <FooterLink key={link.name} {...link} />
              ))}
            </ul>
          </nav>

          {/* Stats & Updates */}
          <div className='md:col-span-4 space-y-4'>
            <h3 className='text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white'>
              Platform Status
            </h3>

            <div className='rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 backdrop-blur-sm p-4 space-y-3 transition-colors'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <span className='block h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400' />
                    <span className='absolute inset-0 animate-ping rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75' />
                  </div>
                  <span className='text-sm font-medium text-emerald-600 dark:text-emerald-400'>
                    All Systems Go
                  </span>
                </div>
                <span className='text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1'>
                  <Clock size={12} aria-hidden='true' />
                  99.9% uptime
                </span>
              </div>

              <div className='flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400'>
                <div className='flex items-center gap-1.5'>
                  <CheckCircle
                    size={12}
                    className='text-indigo-500 dark:text-indigo-400'
                    aria-hidden='true'
                  />
                  <span>Active projects</span>
                  <span className='font-semibold text-slate-800 dark:text-white'>
                    1,247
                  </span>
                </div>
                <div
                  className='w-px h-4 bg-slate-200 dark:bg-white/10'
                  aria-hidden='true'
                />
                <div className='flex items-center gap-1.5'>
                  <Users
                    size={12}
                    className='text-indigo-500 dark:text-indigo-400'
                    aria-hidden='true'
                  />
                  <span>Students</span>
                  <span className='font-semibold text-slate-800 dark:text-white'>
                    3.2k
                  </span>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
              <span className='flex items-center gap-1.5'>
                <Heart
                  size={12}
                  className='text-rose-500 dark:text-rose-400 fill-rose-500 dark:fill-rose-400'
                  aria-hidden='true'
                />
                Made with passion
              </span>
              <span aria-hidden='true'>•</span>
              <span>v2.0.0</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            © {currentYear} Student Project System. All rights reserved.
          </p>
          <div className='flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400'>
            <Link
              to='/about'
              className='hover:text-indigo-600 dark:hover:text-white transition-colors focus:text-indigo-600 dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-1'
            >
              About Us
            </Link>
            <Link
              to='/privacy'
              className='hover:text-indigo-600 dark:hover:text-white transition-colors focus:text-indigo-600 dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-1'
            >
              Privacy Policy
            </Link>
            <Link
              to='/terms'
              className='hover:text-indigo-600 dark:hover:text-white transition-colors focus:text-indigo-600 dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-1'
            >
              Terms of Service
            </Link>
              <span className='text-xs text-slate-500 dark:text-slate-400'>EN</span>
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

Footer.defaultProps = {
  variant: 'minimal',
};

export default Footer;
