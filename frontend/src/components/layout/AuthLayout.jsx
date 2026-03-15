import { memo, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * AuthLayout - Main layout for authentication pages (Login, Register, Forgot Password)
 * Features premium branding, animations, and feature highlights.
 */
const AuthLayout = ({ children }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = useMemo(() => [
    { icon: "users", text: "Role-based access control" },
    { icon: "chart-line", text: "Real-time progress tracking" },
    { icon: "comments", text: "Integrated collaboration tools" },
    { icon: "calendar-check", text: "Deadline management" },
  ], []);

  const stats = useMemo(() => [
    { label: "Active Projects", value: "500+" },
    { label: "Users", value: "2.5K+" },
    { label: "Satisfaction", value: "98%" },
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className={`hidden lg:flex w-1/2 flex-col justify-between p-12 xl:p-16 relative overflow-hidden transition-all duration-700 ${showContent ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 dark:bg-blue-900/30 rounded-full -translate-x-32 -translate-y-32 opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-0 w-72 h-72 bg-indigo-200 dark:bg-indigo-900/30 rounded-full translate-x-32 translate-y-32 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-3 mb-8 group">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-white">UniProject</span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Academic Project<br />
            <span className="text-blue-600 dark:text-blue-400">Management System</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-md">
            Streamline your academic journey with our comprehensive project management platform. Collaborate, track, and achieve excellence.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className={`fas fa-${feature.icon}`}></i>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-8 mt-auto pt-10 border-t border-slate-200 dark:border-slate-800">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Content Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30" />
        </div>

        <div className={`w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/40 dark:border-slate-700/40 relative z-10 transition-all duration-700 ${showContent ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default memo(AuthLayout);
