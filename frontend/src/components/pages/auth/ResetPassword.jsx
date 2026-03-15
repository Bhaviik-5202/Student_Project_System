import { useState, memo, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import authService from "../../../services/authService";

/**
 * ResetPassword Component - New password entry form
 */
const ResetPassword = memo(() => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    setLoading(true);

    try {
      const result = await authService.resetPassword(token, password);
      if (result.success) {
        toast.success(result.message || "Password has been reset successfully");
        navigate("/login");
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, password, confirmPassword, navigate]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <i className="fas fa-lock-open text-white text-2xl"></i>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">New Password</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Please enter your new password below</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
            <div className="relative">
              <i className="fas fa-check-circle absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Resetting password..." : "Reset Password"}
        </button>

        <div className="text-center">
          <Link to="/login" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-2">
            <i className="fas fa-arrow-left text-xs"></i>
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
});

ResetPassword.displayName = "ResetPassword";

export default ResetPassword;
