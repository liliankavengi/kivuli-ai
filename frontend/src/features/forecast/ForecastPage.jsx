import { TrendingUp, Info } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ForecastChart from "./ForecastChart";

export default function ForecastPage() {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-6 animate-in">
      <div className="mb-4">
        <h2 className={`text-3xl font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>Cash Flow Forecast</h2>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>3-month projection based on your M-Pesa transaction history</p>
      </div>

      {/* Info banner */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${darkMode ? "bg-accent-900/20 border-accent-800/40" : "bg-accent-50 border-accent-100"}`}>
        <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${darkMode ? "text-accent-400" : "text-accent-600"}`} />
        <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          This forecast uses <strong>linear trend projection</strong> on your last 6 months of data.
          Once the backend ML model is connected, projections will use ARIMA for higher accuracy.
          {/* Backend: GET /api/forecast/?business_id=BIZ-001 */}
        </p>
      </div>

      {/* Forecast Chart */}
      <div className={`p-8 rounded-3xl border shadow-sm ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className={`w-5 h-5 ${darkMode ? "text-brand-400" : "text-brand-800"}`} />
          <h3 className={`text-lg font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>Income & Expense Projection</h3>
          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${darkMode ? "bg-accent-900/30 text-accent-300" : "bg-accent-100 text-accent-700"}`}>3-Month Outlook</span>
        </div>
        <ForecastChart />
      </div>

      {/* Projection Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Projected Income (Apr)", value: "KES 70,000", trend: "+11%", up: true },
          { label: "Projected Expenses (Apr)", value: "KES 41,000", trend: "+8%", up: false },
          { label: "Projected Net (Apr)", value: "KES 29,000", trend: "+14%", up: true },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl p-5 border shadow-sm ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
            <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{item.value}</p>
            <p className={`text-xs font-semibold mt-0.5 ${item.up ? "text-success-500" : "text-rose-500"}`}>{item.trend} vs last month</p>
            <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
