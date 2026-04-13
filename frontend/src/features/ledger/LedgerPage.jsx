import { useState, useEffect } from "react";
import { FileText, Upload, ArrowUpDown, Filter } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { loadLedger } from "../../utils/mpesaParser";
import MpesaUploader from "./MpesaUploader";

const CATEGORY_COLORS = {
  "Business Income": "bg-success-100 text-success-700",
  "Transfer In":     "bg-brand-100 text-brand-800",
  "Transfer Out":    "bg-slate-100 text-slate-700",
  "Food & Groceries":"bg-orange-100 text-orange-700",
  "Transport":       "bg-blue-100 text-blue-700",
  "Utilities":       "bg-yellow-100 text-yellow-700",
  "Healthcare":      "bg-pink-100 text-pink-700",
  "Education":       "bg-indigo-100 text-indigo-700",
  "Entertainment":   "bg-purple-100 text-purple-700",
  "Savings & Insurance": "bg-teal-100 text-teal-700",
  "Other":           "bg-slate-100 text-slate-600",
};

export default function LedgerPage() {
  const { darkMode } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all"); // all | income | expense

  useEffect(() => {
    setTransactions(loadLedger());
  }, []);

  const handleImported = (txns) => setTransactions(txns);

  const filtered = transactions.filter((t) => {
    if (filter === "income") return t.type === "income";
    if (filter === "expense") return t.type === "expense";
    return true;
  });

  const totalIn = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6 animate-in">
      <div className="mb-4">
        <h2 className={`text-3xl font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>M-Pesa Ledger</h2>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Import and auto-categorize your M-Pesa transactions</p>
      </div>

      {/* Summary */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total In", value: `KES ${totalIn.toLocaleString()}`, color: "text-success-500" },
            { label: "Total Out", value: `KES ${totalOut.toLocaleString()}`, color: "text-rose-500" },
            { label: "Transactions", value: transactions.length, color: darkMode ? "text-brand-300" : "text-brand-800" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 border shadow-sm ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Uploader */}
      <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
        <div className="flex items-center gap-2 mb-4">
          <Upload className={`w-5 h-5 ${darkMode ? "text-brand-400" : "text-brand-800"}`} />
          <h3 className={`text-lg font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>Import M-Pesa Statement</h3>
        </div>
        <MpesaUploader onImported={handleImported} />
      </div>

      {/* Transaction Table */}
      {transactions.length > 0 && (
        <div className={`rounded-3xl border shadow-sm overflow-hidden ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
          {/* Table Controls */}
          <div className={`px-6 py-4 border-b flex items-center justify-between flex-wrap gap-3 ${darkMode ? "border-dark-border" : "border-slate-100"}`}>
            <div className="flex items-center gap-2">
              <Filter className={`w-4 h-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
              {["all", "income", "expense"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer capitalize ${
                    filter === f
                      ? "bg-brand-900 text-white"
                      : darkMode ? "bg-dark-surface text-slate-300 hover:bg-dark-border" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{filtered.length} records</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`${darkMode ? "bg-dark-surface" : "bg-slate-50"}`}>
                  {["Date", "Description", "Category", "Amount", "Balance"].map((h) => (
                    <th key={h} className={`px-5 py-3 text-left font-semibold text-xs uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map((tx, i) => (
                  <tr key={tx.id} className={`border-t transition-colors hover:${darkMode ? "bg-dark-surface/50" : "bg-slate-50/50"} ${darkMode ? "border-dark-border" : "border-slate-50"}`}>
                    <td className={`px-5 py-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{tx.date}</td>
                    <td className={`px-5 py-3 max-w-[200px] truncate ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{tx.description}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[tx.category] || CATEGORY_COLORS["Other"]}`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className={`px-5 py-3 font-semibold ${tx.amount > 0 ? "text-success-600" : "text-rose-500"}`}>
                      {tx.amount > 0 ? "+" : ""}KES {Math.abs(tx.amount).toLocaleString()}
                    </td>
                    <td className={`px-5 py-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      KES {tx.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 50 && (
              <p className={`text-center py-4 text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                Showing 50 of {filtered.length} transactions
              </p>
            )}
          </div>
        </div>
      )}

      {transactions.length === 0 && (
        <div className={`text-center py-16 rounded-3xl border-2 border-dashed ${darkMode ? "border-dark-border text-slate-500" : "border-slate-200 text-slate-400"}`}>
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No transactions yet</p>
          <p className="text-sm mt-1">Upload your M-Pesa CSV above to get started</p>
        </div>
      )}
    </div>
  );
}
