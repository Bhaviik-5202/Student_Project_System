import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password, role);

    if (result.success) {
      // Success animation before navigation
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (userType) => {
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

    const { email, password, role } = credentials[userType];
    setEmail(email);
    setPassword(password);
    setRole(role);

    // Add subtle feedback animation
    const demoBtn = document.querySelector(`[data-user="${userType}"]`);
    if (demoBtn) {
      demoBtn.classList.add("active-pulse");
      setTimeout(() => demoBtn.classList.remove("active-pulse"), 500);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Left Side - Project Intro */}
      <div
        className={`hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden ${
          showContent ? "animate-slide-in-left" : "-translate-x-full opacity-0"
        }`}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100 rounded-full -translate-x-32 -translate-y-32 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-100 rounded-full translate-x-48 translate-y-48 opacity-30"></div>

        {/* Main Content */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-gray-800">UniProject</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Academic Project
            <br />
            <span className="text-primary-600">Management System</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Streamline your academic projects with our comprehensive management
            platform. Collaborate seamlessly, track progress, and achieve
            academic excellence together.
          </p>

          {/* Features List */}
          <div className="space-y-4 mb-12">
            {[
              { icon: "users", text: "Role-based access control" },
              { icon: "chart-line", text: "Real-time progress tracking" },
              { icon: "comments", text: "Integrated collaboration tools" },
              { icon: "calendar-check", text: "Deadline management" },
              { icon: "file-alt", text: "Document repository" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <i
                    className={`fas fa-${feature.icon} text-primary-600 text-sm`}
                  ></i>
                </div>
                <span className="text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-6 max-w-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">500+</div>
              <div className="text-sm text-gray-500">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">2.5K+</div>
              <div className="text-sm text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">98%</div>
              <div className="text-sm text-gray-500">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div
          className={`w-full max-w-md lg:max-w-lg space-y-8 bg-white/90 backdrop-blur-sm p-8 lg:p-10 rounded-2xl shadow-xl lg:shadow-2xl ${
            showContent
              ? "animate-slide-in-right"
              : "translate-x-full opacity-0"
          }`}
        >
          {/* Form Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg animate-subtle-float">
                <i className="fas fa-lock text-white text-2xl"></i>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div
                className={`animate-slide-up ${
                  showContent ? "visible" : "invisible"
                }`}
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <span className="text-xs text-gray-500">Required</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <i className="fas fa-envelope text-gray-400"></i> */}
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-5 appearance-none relative block w-full px-4 py-2 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 hover:border-primary-300"
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
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-primary-600 hover:text-primary-500 transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div>
                    {/* <i className="fas fa-lock text-gray-400"></i> */}
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-5 appearance-none relative block w-full px-4 py-2 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 hover:border-primary-300"
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
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Your Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user-tag text-gray-400"></i>
                  </div>
                  <select
                    id="role"
                    name="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="pl-5 appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 hover:border-primary-300"
                  >
                    <option value="">Choose your role...</option>
                    <option value="admin">Administrator</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>

              {/* Remember Me */}
              <div
                className={`flex items-center animate-slide-up ${
                  showContent ? "visible" : "invisible"
                }`}
                style={{ animationDelay: "0.4s" }}
              >
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
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
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="spinner-light mr-3"></div>
                    Authenticating...
                  </div>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                      <i className="fas fa-sign-in-alt group-hover:translate-x-1 transition-transform duration-200"></i>
                    </span>
                    Sign In
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
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Quick Login With Demo Accounts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { type: "admin", color: "blue", icon: "user-shield" },
                  {
                    type: "faculty",
                    color: "green",
                    icon: "chalkboard-teacher",
                  },
                  { type: "student", color: "purple", icon: "user-graduate" },
                ].map((user, index) => (
                  <button
                    key={user.type}
                    type="button"
                    data-user={user.type}
                    onClick={() => fillDemoCredentials(user.type)}
                    className={`flex flex-col items-center p-3 rounded-xl bg-${user.color}-50 hover:bg-${user.color}-100 border border-transparent hover:border-${user.color}-200 transition-all duration-200 group`}
                  >
                    <div
                      className={`w-10 h-10 bg-${user.color}-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-${user.color}-200 transition-colors duration-200`}
                    >
                      <i
                        className={`fas fa-${user.icon} text-${user.color}-600`}
                      ></i>
                    </div>
                    <span
                      className={`text-sm font-medium text-${user.color}-700 capitalize`}
                    >
                      {user.type}
                    </span>
                    {/* <span className="text-xs text-gray-500 mt-1">
                      Click to fill
                    </span> */}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div
            className={`text-center text-sm text-gray-500 animate-fade-in ${
              showContent ? "visible" : "invisible"
            }`}
            style={{ animationDelay: "0.7s" }}
          >
            <p>
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
