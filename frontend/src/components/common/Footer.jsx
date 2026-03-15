import { useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Footer Component
 * 
 * Global application footer containing system status indicators, 
 * versioning info, platform-wide quick links, and legal/privacy resources.
 */
const Footer = memo(() => {
  const { user } = useAuth();
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <i className="fas fa-graduation-cap text-white text-sm"></i>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Student Project System</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">
              A comprehensive platform for managing academic projects, fostering collaboration between students and faculty.
            </p>
            <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                System Operational
              </span>
              <span className="text-xs font-medium">v2.1.0</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/projects" className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors">Projects</Link></li>
              <li><Link to="/meetings" className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors">Meetings</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors">Global FAQ</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {currentYear} Student Project Management System. Built with <i className="fas fa-heart text-red-500 mx-0.5"></i> for Academic Excellence.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
