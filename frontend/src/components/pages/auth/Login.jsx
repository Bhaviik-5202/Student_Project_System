import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthContext";

const Login = memo(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      if (!email || !password || !role) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const result = await login(email, password);

      if (result.success) {
        // Success animation before navigation
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setError(result.message || "Login failed. Please try again.");
        setLoading(false);
      }
    },
    [email, password, role, login, navigate],
  );

  const fillDemoCredentials = useCallback((userType) => {
    const credentials = {
      admin: {
        email: "admin@university.edu",
        password: "admin123",
        role: "admin",
      },
      faculty: {
        email: "faculty@university.edu",
        password: "faculty123",
        role: "faculty",
      },
      student: {
        email: "student@university.edu",
        password: "student123",
        role: "student",
      },
    };

    const {
      email: demoEmail,
      password: demoPassword,
      role: demoRole,
    } = credentials[userType];
    setEmail(demoEmail);
    setPassword(demoPassword);
    setRole(demoRole);

    // Add subtle feedback animation
    const demoBtn = document.querySelector(`[data-user="${userType}"]`);
    if (demoBtn) {
      demoBtn.classList.add("active-pulse");
      setTimeout(() => demoBtn.classList.remove("active-pulse"), 500);
    }
  }, []);

  const features = useMemo(
    () => [
      { icon: "users", text: "Role-based access control" },
      { icon: "chart-line", text: "Real-time progress tracking" },
      { icon: "comments", text: "Integrated collaboration tools" },
      { icon: "calendar-check", text: "Deadline management" },
      { icon: "file-alt", text: "Document repository" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Project Intro */}
        <div
          className={`hidden lg:flex w-full lg:w-1/2 flex-col justify-between p-8 lg:p-12 xl:p-16 relative overflow-hidden ${
            showContent
              ? "animate-slide-in-left"
              : "-translate-x-full opacity-0"
          }`}
        >
          {/* Background decorative elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 dark:bg-blue-900/30 rounded-full -translate-x-32 -translate-y-32 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-10 right-0 w-72 h-72 bg-indigo-200 dark:bg-indigo-900/30 rounded-full translate-x-32 translate-y-32 opacity-20 blur-3xl"></div>

          {/* Main Content */}
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 dark:bg-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <i
                  className="fas fa-graduation-cap text-white text-lg lg:text-xl"
                  aria-hidden="true"
                ></i>
              </div>
              <span className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">
                UniProject
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6 leading-tight">
              Academic Project
              <br />
              <span className="text-blue-600 dark:text-blue-400">
                Management System
              </span>
            </h1>

            <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-6 lg:mb-8">
              Streamline your academic projects with our comprehensive
              management platform. Collaborate seamlessly, track progress, and
              achieve academic excellence together.
            </p>

            {/* Features List */}
            <div className="space-y-3 lg:space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 animate-fade-in"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i
                      className={`fas fa-${feature.icon} text-blue-600 dark:text-blue-400 text-sm`}
                      aria-hidden="true"
                    ></i>
                  </div>
                  <span className="text-sm lg:text-base text-slate-700 dark:text-slate-300">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Footer */}
          <div className="relative z-10 mt-8">
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  500+
                </div>
                <div className="text-xs lg:text-sm text-slate-500 dark:text-slate-400">
                  Active Projects
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  2.5K+
                </div>
                <div className="text-xs lg:text-sm text-slate-500 dark:text-slate-400">
                  Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  98%
                </div>
                <div className="text-xs lg:text-sm text-slate-500 dark:text-slate-400">
                  Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative overflow-hidden min-h-screen lg:min-h-0">
          {/* Background decorative elements */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-200 dark:bg-indigo-900/30 rounded-full translate-x-32 -translate-y-32 opacity-15 blur-3xl"></div>
          <div className="absolute bottom-10 left-0 w-64 h-64 bg-blue-200 dark:bg-blue-900/30 rounded-full -translate-x-32 translate-y-32 opacity-15 blur-3xl"></div>

          <div
            className={`w-full max-w-md lg:max-w-lg relative z-10 space-y-5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl lg:rounded-3xl shadow-2xl border border-white/40 dark:border-slate-700/40 ${
              showContent
                ? "animate-slide-in-right"
                : "translate-x-full opacity-0"
            }`}
          >
            {/* Form Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl dark:shadow-lg animate-subtle-float">
                  <i
                    className="fas fa-lock text-white text-2xl"
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-4 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium animate-slide-down"
                role="alert"
              >
                <div className="flex items-start gap-3">
                  <i
                    className="fas fa-exclamation-circle mt-0.5 text-lg flex-shrink-0"
                    aria-hidden="true"
                  ></i>
                  <span className="flex-1">{error}</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email Field */}
                <div
                  className={`animate-slide-up ${
                    showContent ? "visible" : "invisible"
                  }`}
                  style={{ animationDelay: "0.1s" }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <i
                      className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"
                      aria-hidden="true"
                    ></i>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 appearance-none relative block w-full px-4 py-3 border border-slate-200 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white dark:bg-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:focus:border-transparent sm:text-sm transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
                      placeholder="you@university.edu"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div
                  className={`animate-slide-up ${
                    showContent ? "visible" : "invisible"
                  }`}
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <i
                      className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm"
                      aria-hidden="true"
                    ></i>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 appearance-none relative block w-full px-4 py-3 border border-slate-200 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white dark:bg-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:focus:border-transparent sm:text-sm transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div
                  className={`animate-slide-up ${
                    showContent ? "visible" : "invisible"
                  }`}
                  style={{ animationDelay: "0.3s" }}
                >
                  <label
                    htmlFor="role"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Select Your Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-user-tag text-slate-400 dark:text-slate-500 text-sm"></i>
                    </div>
                    <select
                      id="role"
                      name="role"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="pl-11 appearance-none relative block w-full px-4 py-3 border border-slate-200 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white dark:bg-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:focus:border-transparent sm:text-sm transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-700 cursor-pointer"
                    >
                      <option value="">Choose your role...</option>
                      <option value="admin">Administrator</option>
                      <option value="faculty">Faculty Member</option>
                      <option value="student">Student</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <i className="fas fa-chevron-down text-slate-400 dark:text-slate-500 text-xs"></i>
                    </div>
                  </div>
                </div>

                {/* Remember Me */}
                <div
                  className={`flex items-center gap-3 animate-slide-up ${
                    showContent ? "visible" : "invisible"
                  }`}
                  style={{ animationDelay: "0.4s" }}
                >
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg transition-colors duration-200 cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                  >
                    Keep me signed in
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div
                className={`animate-slide-up ${
                  showContent ? "visible" : "invisible"
                }`}
                style={{ animationDelay: "0.5s" }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:via-blue-800 dark:hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="spinner-light"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span className="flex items-center gap-2">
                        <i
                          className="fas fa-sign-in-alt group-hover:translate-x-1 transition-transform duration-200"
                          aria-hidden="true"
                        ></i>
                        Sign In
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Demo Credentials */}
              <div
                className={`animate-slide-up ${
                  showContent ? "visible" : "invisible"
                }`}
                style={{ animationDelay: "0.6s" }}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-xs uppercase tracking-wide">
                      Demo Accounts
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    {
                      type: "admin",
                      icon: "user-shield",
                      bgColor: "bg-blue-50 dark:bg-blue-900/30",
                      hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-900/50",
                      borderColor: "border-blue-200 dark:border-blue-700/50",
                      iconBg: "bg-blue-100 dark:bg-blue-900/40",
                      hoverIconBg:
                        "group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60",
                      iconColor: "text-blue-600 dark:text-blue-400",
                      textColor: "text-blue-700 dark:text-blue-300",
                    },
                    {
                      type: "faculty",
                      icon: "chalkboard-teacher",
                      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
                      hoverBg:
                        "hover:bg-emerald-100 dark:hover:bg-emerald-900/50",
                      borderColor:
                        "border-emerald-200 dark:border-emerald-700/50",
                      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
                      hoverIconBg:
                        "group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60",
                      iconColor: "text-emerald-600 dark:text-emerald-400",
                      textColor: "text-emerald-700 dark:text-emerald-300",
                    },
                    {
                      type: "student",
                      icon: "user-graduate",
                      bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
                      hoverBg:
                        "hover:bg-indigo-100 dark:hover:bg-indigo-900/50",
                      borderColor:
                        "border-indigo-200 dark:border-indigo-700/50",
                      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
                      hoverIconBg:
                        "group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/60",
                      iconColor: "text-indigo-600 dark:text-indigo-400",
                      textColor: "text-indigo-700 dark:text-indigo-300",
                    },
                  ].map((user) => (
                    <button
                      key={user.type}
                      type="button"
                      data-user={user.type}
                      onClick={() => fillDemoCredentials(user.type)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 group transform hover:scale-105 ${user.bgColor} ${user.hoverBg} border ${user.borderColor} hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-slate-950/50`}
                    >
                      <div
                        className={`w-10 h-10 ${user.iconBg} rounded-lg flex items-center justify-center mb-2 ${user.hoverIconBg} transition-all duration-200`}
                      >
                        <i
                          className={`fas fa-${user.icon} ${user.iconColor}`}
                          aria-hidden="true"
                        ></i>
                      </div>
                      <span
                        className={`text-xs font-semibold ${user.textColor} capitalize`}
                      >
                        {user.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Footer */}
            <div
              className={`text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 animate-fade-in ${
                showContent ? "visible" : "invisible"
              }`}
              style={{ animationDelay: "0.7s" }}
            >
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                By signing in, you agree to our{" "}
                <button
                  type="button"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 underline decoration-blue-200 dark:decoration-blue-700 underline-offset-2"
                >
                  Terms
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 underline decoration-blue-200 dark:decoration-blue-700 underline-offset-2"
                >
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Login.displayName = "Login";

Login.propTypes = {};

export default Login;
