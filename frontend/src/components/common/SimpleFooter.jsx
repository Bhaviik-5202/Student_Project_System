/**
 * SimpleFooter.jsx
 * A lightweight footer component displayed on all pages except Dashboard.
 * The full Footer is only shown on the Dashboard page.
 */

import { memo, useMemo } from "react";

const SimpleFooter = memo(() => {
  // Memoize the current year to avoid recalculation
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 mt-8"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Copyright */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Student Project System. All rights reserved.
          </p>

          {/* Quick Links */}
          <div className="flex items-center space-x-4">
            <a
              href="/help"
              className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              Help
            </a>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <a
              href="/settings"
              className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              Settings
            </a>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <a
              href="/contact"
              className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

SimpleFooter.displayName = "SimpleFooter";

export default SimpleFooter;
