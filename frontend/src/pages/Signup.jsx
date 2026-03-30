// ============================
// Signup Page
// ============================
// Allows new users to create an account with name, email, and password.
// On success, saves user data + token to localStorage and redirects to dashboard.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Backend auth URL
const API_URL = "http://localhost:5000/api/auth";

function Signup() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Save user data and token to localStorage
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#6366f1]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#06b6d4]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] shadow-lg shadow-indigo-500/30 mb-4">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#818cf8] to-[#06b6d4] bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-[#94a3b8] mt-2">Join Hira and start managing your work</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-8 shadow-xl shadow-black/20">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 animate-fade-in">
              <p className="text-[#ef4444] text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#475569] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#475569] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#475569] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94a3b8] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="signup-confirm" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Confirm Password
              </label>
              <input
                id="signup-confirm"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-[#334155] text-white placeholder-[#475569] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#818cf8] hover:to-[#6366f1] text-white font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Link to Login */}
        <p className="text-center mt-6 text-[#94a3b8]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#818cf8] hover:text-[#6366f1] font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;