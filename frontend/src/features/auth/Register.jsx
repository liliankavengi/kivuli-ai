import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Zap, Mail, Lock, User, UserPlus, AlertCircle, Sun, Moon, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const passwordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (pwd.length < 10) return { label: "Fair", color: "bg-yellow-500", width: "w-2/4" };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: "Good", color: "bg-brand-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-success-500", width: "w-full" };
  };

  const strength = passwordStrength(password);

  const handleRegister = () => {
    setLocalError("");

    if (!name.trim()) { setLocalError("Please enter your full name"); return; }
    if (!email.trim() || !email.includes("@")) { setLocalError("Please enter a valid email address"); return; }
    if (password.length < 6) { setLocalError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setLocalError("Passwords do not match"); return; }

    setIsLoading(true);
    setTimeout(() => {
      register(name, email, password);
      setIsLoading(false);
      navigate("/verify-email");
    }, 800);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "bg-dark-surface text-slate-200" : "bg-surface"}`}>
      {/* Static background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
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
                <h1 className={`text-3xl font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>Kivuli AI</h1>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Trust Score Engine for Kenyan SMEs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleDarkMode} className={`p-2.5 rounded-full border transition-all cursor-pointer ${darkMode ? "bg-slate-700 border-slate-600 text-yellow-300 hover:bg-slate-600" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"}`}>
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

      {/* Register Form */}
      <main className="relative flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className={`rounded-3xl shadow-2xl border p-8 transition-colors duration-300 ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-200"}`}>
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-600 shadow-lg shadow-accent-600/25 mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>Create Account</h2>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Join Kivuli AI to access your Trust Score</p>
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Full Name</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lilian Kavengi"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all ${darkMode ? "bg-dark-surface border-dark-border text-white" : "bg-surface border-slate-200 text-slate-800 focus:bg-white"}`}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </div>
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
                  placeholder="royalfarm42@gmail.com"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all ${darkMode ? "bg-dark-surface border-dark-border text-white" : "bg-surface border-slate-200 text-slate-800 focus:bg-white"}`}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all ${darkMode ? "bg-dark-surface border-dark-border text-white" : "bg-surface border-slate-200 text-slate-800 focus:bg-white"}`}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer ${darkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Strength Bar */}
              {strength && (
                <div className="mt-2 space-y-1">
                  <div className={`h-1.5 rounded-full transition-all ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${strength.color} ${strength.width}`}></div>
                  </div>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Strength: <span className="font-semibold">{strength.label}</span></p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Confirm Password</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all ${confirmPassword && confirmPassword !== password
                      ? "border-rose-400"
                      : confirmPassword && confirmPassword === password
                        ? "border-success-400"
                        : darkMode ? "bg-dark-surface border-dark-border text-white" : "bg-surface border-slate-200 text-slate-800"
                    } ${darkMode ? "bg-dark-surface text-white" : "bg-surface text-slate-800 focus:bg-white"}`}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className={`absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer ${darkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}>
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {confirmPassword && confirmPassword === password && (
                  <CheckCircle className="absolute right-11 top-1/2 -translate-y-1/2 w-4 h-4 text-success-500" />
                )}
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
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full py-3.5 bg-brand-900 hover:bg-brand-800 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl hover:shadow-brand-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Zap className="w-5 h-5 animate-spin" />
              ) : (
                <UserPlus className="w-5 h-5" />
              )}
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                Already have an account?{" "}
                <Link to="/" className={`font-semibold ${darkMode ? "text-accent-400 hover:text-accent-300" : "text-accent-600 hover:text-accent-500"}`}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
