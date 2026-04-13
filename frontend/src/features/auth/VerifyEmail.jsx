import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, Mail, ArrowRight, RefreshCw, CheckCircle2, Sun, Moon } from "lucide-react";

const CODE_LENGTH = 6;

export default function VerifyEmail() {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  // Countdown for resend button
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef([]);
  const { pendingUser, verifyEmail } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  // If someone lands here without a pending registration, send them back
  useEffect(() => {
    if (!pendingUser) navigate("/register");
  }, [pendingUser, navigate]);

  // Resend countdown
  useEffect(() => {
    if (countdown === 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleInput = (i, val) => {
    // Accept only digits
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    setError("");
    // Auto-advance focus
    if (val && i < CODE_LENGTH - 1) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = [...Array(CODE_LENGTH).fill("")];
    pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
    setCode(next);
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleVerify = () => {
    const entered = code.join("");
    if (entered.length < CODE_LENGTH) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    // Demo: accept "123456" as the valid OTP
    // In production, call POST /api/auth/verify-email/ with the code
    if (entered !== "123456") {
      setError("Incorrect code. Please try again.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      verifyEmail();
      navigate("/dashboard");
    }, 800);
  };

  const handleResend = () => {
    setResent(true);
    setCountdown(60);
    setCode(Array(CODE_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    setTimeout(() => setResent(false), 3000);
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

      {/* Verify Form */}
      <main className="relative flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className={`rounded-3xl shadow-2xl border p-8 transition-colors duration-300 ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-200"}`}>

            {/* Icon + Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-900 shadow-lg shadow-brand-900/25 mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Check your inbox</h2>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                We sent a 6-digit verification code to{" "}
                <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-700"}`}>{pendingUser?.email}</span>
              </p>
              {/* Demo hint */}
              <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${darkMode ? "bg-accent-900/30 text-accent-300 border border-accent-800" : "bg-accent-50 text-accent-700 border border-accent-200"}`}>
                <Zap className="w-3 h-3" />
                Demo: use code <strong className="ml-1">1 2 3 4 5 6</strong>
              </div>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-brand-100 ${
                    digit
                      ? darkMode ? "border-brand-400 bg-brand-900/20 text-white" : "border-brand-600 bg-brand-50 text-brand-900"
                      : darkMode ? "border-dark-border bg-dark-surface text-white" : "border-slate-200 bg-surface text-slate-800"
                  } focus:border-brand-400`}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className={`mb-4 p-3 rounded-xl flex items-center gap-3 border ${darkMode ? "bg-rose-900/20 border-rose-800" : "bg-rose-50 border-rose-200"}`}>
                <span className={`text-sm ${darkMode ? "text-rose-300" : "text-rose-800"}`}>{error}</span>
              </div>
            )}

            {/* Resent confirmation */}
            {resent && (
              <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 border ${darkMode ? "bg-success-900/20 border-success-800" : "bg-success-50 border-success-200"}`}>
                <CheckCircle2 className={`w-4 h-4 ${darkMode ? "text-success-400" : "text-success-600"}`} />
                <span className={`text-sm font-medium ${darkMode ? "text-success-300" : "text-success-700"}`}>Code resent successfully!</span>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isVerifying || code.join("").length < CODE_LENGTH}
              className="w-full py-3.5 bg-brand-900 hover:bg-brand-800 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl hover:shadow-brand-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isVerifying ? <Zap className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {isVerifying ? "Verifying..." : "Verify Email"}
            </button>

            {/* Resend */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Resend code in <span className="font-semibold tabular-nums">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className={`text-sm font-semibold flex items-center gap-1.5 mx-auto cursor-pointer ${darkMode ? "text-accent-400 hover:text-accent-300" : "text-accent-600 hover:text-accent-500"}`}
                >
                  <RefreshCw className="w-4 h-4" />
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
