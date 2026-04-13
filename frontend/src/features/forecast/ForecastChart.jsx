import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { buildForecastSeries } from "./forecastUtils";

const HISTORICAL = [
  { month: "Oct", income: 42000, expenses: 28000 },
  { month: "Nov", income: 38000, expenses: 31000 },
  { month: "Dec", income: 55000, expenses: 40000 },
  { month: "Jan", income: 47000, expenses: 29000 },
  { month: "Feb", income: 51000, expenses: 34000 },
  { month: "Mar", income: 63000, expenses: 38000 },
];

const CustomDot = ({ cx, cy, payload }) => {
  if (!payload.projected) return null;
  return <circle cx={cx} cy={cy} r={4} fill="#7c3aed" stroke="white" strokeWidth={2} />;
};

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  const isProjected = payload[0]?.payload?.projected;
  return (
    <div className={`rounded-xl px-4 py-3 shadow-xl border text-sm ${darkMode ? "bg-dark-card border-dark-border text-white" : "bg-white border-slate-200 text-slate-800"}`}>
      <p className="font-bold mb-1">{label}{isProjected ? " (Projected)" : ""}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">KES {(p.value || 0).toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function ForecastChart({ historicalData = HISTORICAL }) {
  const { darkMode } = useTheme();
  const series = buildForecastSeries(historicalData, 3);
  const splitIndex = historicalData.length - 1;

  const axisColor = darkMode ? "#64748b" : "#94a3b8";
  const gridColor = darkMode ? "#1e293b" : "#f1f5f9";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs flex-wrap">
        <span className={`flex items-center gap-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          <span className="w-6 h-0.5 bg-success-500 inline-block rounded"></span> Historical
        </span>
        <span className={`flex items-center gap-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          <span className="w-6 h-0.5 border-t-2 border-dashed border-accent-500 inline-block"></span> Projected
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={series}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          <ReferenceLine x={series[splitIndex]?.month} stroke={darkMode ? "#334155" : "#cbd5e1"} strokeDasharray="4 4" label={{ value: "Today", position: "top", fill: axisColor, fontSize: 11 }} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" dot={<CustomDot />} />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#7c3aed" strokeWidth={2} fill="url(#expenseGrad)" dot={<CustomDot />} strokeDasharray="5 5" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
