import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Show form with slight delay for animation
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password, role);

    if (result.success) {
      // Simple success transition
      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } else {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (userType) => {
    if (userType === "admin") {
      setEmail("admin@university.edu");
      setPassword("admin123");
      setRole("admin");
    } else if (userType === "faculty") {
      setEmail("faculty@university.edu");
      setPassword("faculty123");
      setRole("faculty");
    } else if (userType === "student") {
      setEmail("student@university.edu");
      setPassword("student123");
      setRole("student");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div
        className={`max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl ${
          showForm ? "animate-fade-in" : "opacity-0"
        }`}
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center animate-subtle-float">
              <i className="fas fa-graduation-cap text-primary-600 text-2xl"></i>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Project Management System
          </h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Enter your email"
              />
            </div>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Enter your password"
              />
            </div>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors duration-200"
              >
                <option value="">Select your role</option>
                <option value="admin">Administrator</option>
                <option value="faculty">Faculty Member</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>

          <div
            className="flex items-center justify-between animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center">
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
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="spinner-simple mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <i className="fas fa-sign-in-alt"></i>
                  </span>
                  Sign in
                </>
              )}
            </button>
          </div>

          <div
            className="text-center text-sm text-gray-600 animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="mb-2">Quick login with demo credentials:</p>
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin")}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("faculty")}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("student")}
                className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
              >
                Student
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
