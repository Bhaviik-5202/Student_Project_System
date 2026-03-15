import { useState, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

/**
 * ForgotPassword Component - Password recovery form
 */
const ForgotPassword = memo(() => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Password reset link sent to your email");
    } catch (error) {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <i className="fas fa-key text-white text-2xl"></i>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Enter your email to receive a recovery link</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
          <div className="relative">
            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
              placeholder="you@university.edu"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Sending link..." : "Send Reset Link"}
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

ForgotPassword.displayName = "ForgotPassword";

export default ForgotPassword;
