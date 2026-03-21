import { useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, ArrowRight, Heart, Cpu, ShieldCheck, Globe } from "lucide-react";

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
      className="bg-slate-950 text-slate-400 border-t border-slate-800/50 py-16 relative overflow-hidden"
      role="contentinfo"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand and Mission */}
          <div className="md:col-span-4">
            <Link 
              to="/" 
              className="flex items-center gap-3 mb-6 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Project<span className="text-blue-500 text-2xl leading-none">.</span>Point
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-8 max-w-sm">
              Empowering the next generation of innovators with a streamlined platform for academic excellence and collaborative project management.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 group">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 group">
                <Linkedin size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 group">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-6">Explore</h3>
            <ul className="space-y-4">
              {['Dashboard', 'Projects', 'Meetings', 'Schedule'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-6">Support</h3>
            <ul className="space-y-4">
              {[
                { name: 'Help Center', path: '/help' },
                { name: 'Global FAQ', path: '/faq' },
                { name: 'Contact Us', path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-6">Stay Updated</h3>
            <p className="text-sm text-slate-500 mb-6">Get the latest platform updates and academic resources delivered.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
              <button
                className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors group-hover:translate-x-0"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="block w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                  <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></span>
                </div>
                <span className="text-xs font-medium text-emerald-500/90 tracking-wide uppercase">Operational</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Cpu size={14} />
                <span className="text-xs font-medium">v2.1.0-stable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>© {currentYear} Student Project Management System.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart size={12} className="text-rose-500 fill-rose-500/10" /> for researchers.
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <Link to="/privacy" className="text-xs hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs hover:text-white transition-colors">Terms of Service</Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Globe size={12} />
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
