import { CheckCircle, AlertTriangle, Leaf, TrendingUp, Star } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// Mock breakdown — dashboardService.js will provide real data when backend returns full TrustReport
const MOCK_BREAKDOWN = {
  strengths: [
    "Consistent daily M-Pesa activity",
    "Positive net cash flow for 4+ months",
    "Low chargeback and reversal rate",
  ],
  risks: [
    "Transaction volume drops on weekends",
    "Income sources not diversified",
  ],
  sdg_8_advice:
    "Your business demonstrates strong alignment with UN SDG 8. To deepen impact, consider formalizing payroll for any workers through M-Pesa Business Pay.",
};

// Circular score gauge using SVG
function ScoreGauge({ score, darkMode }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#004d40" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" className="-rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke={darkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="12" />
        <circle
          cx="80" cy="80" r={radius} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="-mt-24 flex flex-col items-center">
        <span className={`text-5xl font-black ${darkMode ? "text-white" : "text-slate-800"}`}>{score}</span>
        <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>/ 100</span>
      </div>
    </div>
  );
}

export default function TrustBreakdown({ score, breakdown = MOCK_BREAKDOWN }) {
  const { darkMode } = useTheme();
  const { strengths, risks, sdg_8_advice } = breakdown;

  return (
    <div className={`rounded-3xl border shadow-sm p-8 space-y-6 ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${darkMode ? "bg-brand-900/30" : "bg-brand-50"}`}>
          <TrendingUp className={`w-5 h-5 ${darkMode ? "text-brand-400" : "text-brand-800"}`} />
        </div>
        <h3 className={`text-xl font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>Trust Score Breakdown</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Gauge */}
        <div className="flex flex-col items-center gap-2">
          <ScoreGauge score={score} darkMode={darkMode} />
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {score >= 80 ? "Excellent Credit" : score >= 60 ? "Good Standing" : score >= 40 ? "Moderate Risk" : "High Risk"}
            </span>
          </div>
        </div>

        {/* Strengths + Risks */}
        <div className="md:col-span-2 space-y-5">
          {/* Strengths */}
          <div>
            <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-success-400" : "text-success-700"}`}>Strengths</p>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          {risks.length > 0 && (
            <div>
              <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-rose-400" : "text-rose-700"}`}>Risk Factors</p>
              <ul className="space-y-2">
                {risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SDG 8 Callout */}
      <div className={`rounded-2xl p-5 border flex items-start gap-3 ${darkMode ? "bg-accent-900/20 border-accent-800/40" : "bg-accent-50 border-accent-100"}`}>
        <Leaf className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? "text-accent-400" : "text-accent-600"}`} />
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? "text-accent-400" : "text-accent-700"}`}>UN SDG 8 — Decent Work & Economic Growth</p>
          <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{sdg_8_advice}</p>
        </div>
      </div>
    </div>
  );
}
