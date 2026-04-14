import { useState } from "react";
import { Download, ChevronDown, FileText, FileJson, Table2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  generateCSVReport,
  generateJSONReport,
  generateTextReport,
  getDateRangeString,
} from "../services/reportExport";

export default function ExportMenu({ summary, transactions = [], trustScore = {} }) {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const reportData = {
    summary,
    transactions,
    trustScore,
    exportedAt: new Date().toISOString(),
  };

  const handleExport = async (format) => {
    setIsLoading(true);
    try {
      const dateRange = getDateRangeString(
        transactions[transactions.length - 1]?.timestamp || new Date(),
        transactions[0]?.timestamp || new Date()
      );
      const filename = `kivuli-report-${dateRange}`;

      if (format === "csv") {
        generateCSVReport(reportData, filename);
      } else if (format === "json") {
        generateJSONReport(reportData, filename);
      } else if (format === "txt") {
        generateTextReport(reportData, filename);
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportOptions = [
    {
      id: "csv",
      label: "CSV (Excel)",
      icon: Table2,
      desc: "Spreadsheet format",
    },
    {
      id: "txt",
      label: "Text Report",
      icon: FileText,
      desc: "Formatted text file",
    },
    {
      id: "json",
      label: "JSON Data",
      icon: FileJson,
      desc: "Raw data format",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          darkMode
            ? "bg-brand-600 hover:bg-brand-700 text-white hover:shadow-lg hover:shadow-brand-600/20"
            : "bg-brand-600 hover:bg-brand-700 text-white hover:shadow-lg hover:shadow-brand-600/20"
        } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl border z-50 ${
            darkMode
              ? "bg-dark-card border-dark-border shadow-lg shadow-black/30"
              : "bg-white border-slate-200 shadow-lg shadow-slate-400/10"
          }`}
        >
          <div className={`p-3 border-b ${darkMode ? "border-dark-border" : "border-slate-100"}`}>
            <p
              className={`text-sm font-semibold ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Choose Format
            </p>
          </div>

          <div className="p-2">
            {exportOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleExport(option.id)}
                disabled={isLoading}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all ${
                  darkMode
                    ? "hover:bg-slate-700/50 text-slate-300"
                    : "hover:bg-slate-50 text-slate-700"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <option.icon className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{option.label}</p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {option.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
