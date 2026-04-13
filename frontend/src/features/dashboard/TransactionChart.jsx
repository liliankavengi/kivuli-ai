import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

// Mock monthly data — replace with real ledger data when backend is ready
const MOCK_DATA = [
  { month: "Oct", income: 42000, expenses: 28000 },
  { month: "Nov", income: 38000, expenses: 31000 },
  { month: "Dec", income: 55000, expenses: 40000 },
  { month: "Jan", income: 47000, expenses: 29000 },
  { month: "Feb", income: 51000, expenses: 34000 },
  { month: "Mar", income: 63000, expenses: 38000 },
];

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl px-4 py-3 shadow-xl border text-sm ${darkMode ? "bg-dark-card border-dark-border text-white" : "bg-white border-slate-200 text-slate-800"}`}>
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">KES {p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function TransactionChart({ transactions = MOCK_DATA }) {
  const { darkMode } = useTheme();

  const axisColor = darkMode ? "#64748b" : "#94a3b8";
  const gridColor = darkMode ? "#1e293b" : "#f1f5f9";

  return (
    <div className="w-full space-y-6">
      {/* Bar Chart — Income vs Expenses */}
      <div>
        <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Monthly Income vs Expenses (KES)
        </h4>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={transactions} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={{ fill: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
            <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }} />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart — Net Cash Flow */}
      <div>
        <h4 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Net Cash Flow Trend
        </h4>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={transactions.map(d => ({ ...d, net: d.income - d.expenses }))}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            <Line type="monotone" dataKey="net" name="Net" stroke="#004d40" strokeWidth={2.5} dot={{ fill: "#004d40", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
