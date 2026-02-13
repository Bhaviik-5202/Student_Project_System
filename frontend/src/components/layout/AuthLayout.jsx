import { memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-white to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-subtle-float" />
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-subtle-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-subtle-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Left Side - Branding (Hidden on mobile) */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 relative overflow-hidden"
        role="presentation"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-white rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 border-2 border-white rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          {/* Branding Text */}
          <h1 className="text-4xl font-bold mb-4 text-center animate-slide-up">
            Student Project Management System
          </h1>
          <p
            className="text-xl text-primary-100 mb-8 text-center max-w-md animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Streamline your academic journey with our comprehensive project
            management platform
          </p>

          {/* Features List */}
          <div
            className="space-y-4 mt-8 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {[
              {
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                text: "Track project progress",
              },
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                text: "Collaborate with teams",
              },
              {
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                text: "Monitor analytics",
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-blue-50">
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={feature.icon}
                  />
                </svg>
                <span className="text-base">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-12 relative z-10">
        {/* Mobile Logo */}
        <Link
          to="/"
          className="lg:hidden mb-8 flex items-center gap-3 animate-fade-in"
          aria-label="Student Project Management System - Go to homepage"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-800">
            Student Project Management
          </span>
        </Link>

        {/* Auth Card Container */}
        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
            {children}
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} Student Project Management System.
              <span className="mx-2">•</span>
              <Link
                to="/help"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Help
              </Link>
              <span className="mx-2">•</span>
              <Link
                to="/support"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

AuthLayout.displayName = "AuthLayout";

export default memo(AuthLayout);
