import { useState, useRef } from "react";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { parseMpesaCSV, saveLedger } from "../../utils/mpesaParser";

export default function MpesaUploader({ onImported }) {
  const { darkMode } = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file exported from MySafaricom App.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const transactions = await parseMpesaCSV(file);
      saveLedger(transactions);
      onImported?.(transactions);
    } catch (e) {
      setError("Failed to parse CSV. Ensure it's an M-Pesa statement export.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`h-40 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
          dragActive ? "border-brand-400 bg-brand-50/50" :
          darkMode ? "border-dark-border bg-dark-surface hover:border-brand-600" : "border-slate-200 bg-surface hover:border-brand-400"
        }`}
      >
        {loading ? (
          <Loader2 className={`w-8 h-8 animate-spin ${darkMode ? "text-brand-400" : "text-brand-700"}`} />
        ) : (
          <>
            <FileText className={`w-10 h-10 mb-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
            <p className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {dragActive ? "Drop CSV here..." : "Drop M-Pesa CSV or click to browse"}
            </p>
            <p className={`text-xs mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              Export from MySafaricom App → Statement → Download CSV
            </p>
          </>
        )}
        <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      {error && (
        <div className={`p-3 rounded-xl flex items-center gap-2 border ${darkMode ? "bg-rose-900/20 border-rose-800" : "bg-rose-50 border-rose-200"}`}>
          <AlertCircle className={`w-4 h-4 flex-shrink-0 ${darkMode ? "text-rose-400" : "text-rose-600"}`} />
          <span className={`text-sm ${darkMode ? "text-rose-300" : "text-rose-800"}`}>{error}</span>
        </div>
      )}
    </div>
  );
}
