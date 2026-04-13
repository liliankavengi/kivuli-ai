import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Zap, Mail, Lock, LogIn, AlertCircle, Sun, Moon, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim()) {
      setLocalError("Please enter your email address");
      return;
    }
    if (!password.trim()) {
      setLocalError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setLocalError("");

    // Simulate auth delay
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "bg-dark-surface text-slate-200" : "bg-surface"}`}>
      {/* Background Orbs — static, no pulse */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      {/* Header */}
      <header className={`relative backdrop-blur-md border-b shadow-sm sticky top-0 z-10 transition-colors duration-300 ${darkMode ? "bg-dark-card/80 border-dark-border" : "bg-white/80 border-brand-100"}`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-brand-900 p-2.5 rounded-xl shadow-lg shadow-brand-900/25">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>
                  Kivuli AI
                </h1>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Trust Score Engine for Kenyan SMEs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${darkMode ? "bg-slate-700 border-slate-600 text-yellow-300 hover:bg-slate-600" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${darkMode ? "bg-accent-900/30 border-accent-700" : "bg-accent-50 border-accent-200"}`}>
                <Zap className={`w-4 h-4 ${darkMode ? "text-accent-400" : "text-accent-600"}`} />
                <span className={`text-sm font-semibold ${darkMode ? "text-accent-300" : "text-accent-700"}`}>Powered by Gemini 3 Flash</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form — centered */}
      <main className="relative flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className={`rounded-3xl shadow-2xl border p-8 transition-colors duration-300 ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-200"}`}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-900 shadow-lg shadow-brand-900/25 mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>Welcome Back</h2>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Sign in to access your dashboard</p>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all ${darkMode ? "bg-dark-surface border-dark-border text-white" : "bg-surface border-slate-200 text-slate-800 focus:bg-white"}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all ${darkMode ? "bg-dark-surface border-dark-border text-white" : "bg-surface border-slate-200 text-slate-800 focus:bg-white"}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer ${darkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {localError && (
              <div className={`mb-4 p-3 rounded-xl flex items-start gap-3 border ${darkMode ? "bg-rose-900/20 border-rose-800" : "bg-rose-50 border-rose-200"}`}>
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? "text-rose-400" : "text-rose-600"}`} />
                <span className={`text-sm ${darkMode ? "text-rose-300" : "text-rose-800"}`}>{localError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3.5 bg-brand-900 hover:bg-brand-800 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl hover:shadow-brand-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Zap className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Footer links */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className={`font-semibold ${darkMode ? "text-accent-400 hover:text-accent-300" : "text-accent-600 hover:text-accent-500"}`}
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
