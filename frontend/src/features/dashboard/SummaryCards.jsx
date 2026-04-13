import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const MOCK_SUMMARY = {
  totalIncome: 296000,
  totalExpenses: 200000,
  netBalance: 96000,
  transactionCount: 148,
};

export default function SummaryCards({ summary = MOCK_SUMMARY }) {
  const { darkMode } = useTheme();
  const { totalIncome, totalExpenses, netBalance, transactionCount } = summary;
  const isNet = netBalance >= 0;

  const cards = [
    {
      label: "Total Income",
      value: `KES ${totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      iconBg: darkMode ? "bg-success-900/30" : "bg-success-50",
      iconColor: "text-success-500",
      accent: "border-l-4 border-success-500",
    },
    {
      label: "Total Expenses",
      value: `KES ${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      iconBg: darkMode ? "bg-rose-900/30" : "bg-rose-50",
      iconColor: "text-rose-500",
      accent: "border-l-4 border-rose-500",
    },
    {
      label: "Net Balance",
      value: `KES ${Math.abs(netBalance).toLocaleString()}`,
      sub: isNet ? "Positive" : "Deficit",
      icon: DollarSign,
      iconBg: isNet ? (darkMode ? "bg-brand-900/30" : "bg-brand-50") : (darkMode ? "bg-red-900/30" : "bg-red-50"),
      iconColor: isNet ? "text-brand-600" : "text-red-500",
      accent: isNet ? "border-l-4 border-brand-600" : "border-l-4 border-red-500",
    },
    {
      label: "Transactions",
      value: transactionCount.toLocaleString(),
      sub: "This period",
      icon: Wallet,
      iconBg: darkMode ? "bg-accent-900/30" : "bg-accent-50",
      iconColor: "text-accent-600",
      accent: "border-l-4 border-accent-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl p-5 shadow-sm border transition-all hover:-translate-y-0.5 hover:shadow-md ${card.accent} ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.iconBg}`}>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <p className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>{card.value}</p>
          {card.sub && <p className={`text-xs font-medium mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{card.sub}</p>}
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{card.label}</p>
        </div>
      ))}
    </div>
  );
}
