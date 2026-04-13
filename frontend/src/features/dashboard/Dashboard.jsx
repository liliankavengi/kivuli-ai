import { useState, useRef } from "react";
import {
  Loader2, Zap, Upload, X, ImagePlus,
  Building2, Sparkles, ArrowRight,
  Users, Wallet, Clock, BarChart3
} from "lucide-react";
import useTrustScore from "../../hooks/useTrustScore";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import SummaryCards from "./SummaryCards";
import TransactionChart from "./TransactionChart";
import TrustBreakdown from "./TrustBreakdown";

export default function Dashboard() {
  const { user, setBusinessId } = useAuth();
  const { darkMode } = useTheme();
  const { scoreData, loading, error } = useTrustScore(user?.businessId);

  const [inputBizId, setInputBizId] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleCheckScore = () => {
    if (inputBizId.trim()) setBusinessId(inputBizId);
  };

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const imgs = valid.map((file) => ({
      file, name: file.name,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));
    setUploadedImages((prev) => [...prev, ...imgs]);
  };

  const removeImage = (id) => {
    setUploadedImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="mb-4">
        <h2 className={`text-3xl font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>Dashboard</h2>
        <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
          Welcome back,{" "}
          <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-700"}`}>{user?.email}</span>
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Business ID Input */}
      <div className="bg-brand-900 rounded-3xl p-[3px] shadow-2xl shadow-brand-900/20">
        <div className={`rounded-[22px] p-8 ${darkMode ? "bg-dark-card" : "bg-white"}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-brand-900 p-2 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Check Your Trust Score</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={inputBizId}
              onChange={(e) => setInputBizId(e.target.value)}
              placeholder="Enter Business ID (e.g., BIZ-001)"
              className={`flex-1 px-6 py-4 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-lg ${darkMode ? "bg-dark-surface border-dark-border text-white" : "bg-surface border-slate-200 text-slate-800 focus:bg-white"}`}
              onKeyDown={(e) => e.key === "Enter" && handleCheckScore()}
            />
            <button
              onClick={handleCheckScore}
              disabled={loading}
              className="px-10 py-4 bg-brand-900 hover:bg-brand-800 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? "Analyzing..." : "Generate Trust Score"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-32 gap-4">
          <Loader2 className={`w-10 h-10 animate-spin ${darkMode ? "text-brand-400" : "text-brand-700"}`} />
          <p className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Analyzing M-Pesa Data...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className={`p-6 rounded-2xl border-2 ${darkMode ? "bg-rose-900/20 border-rose-800 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
          <h3 className="font-bold mb-1">Error Loading Data</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Score Results */}
      {scoreData && !loading && (
        <>
          {/* AI Mentor Insight */}
          <div className={`rounded-3xl shadow-lg border overflow-hidden ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
            <div className={`px-8 py-5 border-b ${darkMode ? "bg-accent-900/20 border-accent-800/30" : "bg-gradient-to-r from-accent-50 to-accent-100/50 border-accent-100"}`}>
              <div className="flex items-center gap-3">
                <div className="bg-accent-600 p-2 rounded-xl shadow-lg shadow-accent-600/25">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h4 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Kivuli AI Mentor Insight</h4>
                <span className={`text-xs px-3 py-1 rounded-full ml-auto font-semibold ${darkMode ? "bg-accent-900/40 text-accent-300" : "bg-accent-100 text-accent-700"}`}>Gemini 3 Flash</span>
              </div>
            </div>
            <div className="p-8 animate-shimmer">
              <p className={`text-lg leading-relaxed italic ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                "{scoreData.advice}"
              </p>
            </div>
          </div>

          {/* Trust Score Breakdown */}
          <TrustBreakdown
            score={scoreData.score}
            breakdown={{
              strengths: scoreData.strengths,
              risks: scoreData.risks,
              sdg_8_advice: scoreData.sdg_8_advice,
            }}
          />
        </>
      )}

      {/* Income/Expense Chart */}
      <div className={`p-8 rounded-3xl shadow-sm border ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
        <h3 className={`text-xl font-bold mb-6 ${darkMode ? "text-brand-300" : "text-brand-900"}`}>Transaction Activity</h3>
        <TransactionChart />
      </div>

      {/* Document Upload */}
      <div className={`p-8 rounded-3xl shadow-sm border ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
        <div className="flex items-center gap-3 mb-2">
          <Upload className={`w-5 h-5 ${darkMode ? "text-brand-400" : "text-brand-800"}`} />
          <h3 className={`text-xl font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>Upload Documents</h3>
        </div>
        <p className={`text-sm mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Upload M-Pesa statements, business receipts, or ID documents for verification.</p>

        <div
          onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`h-44 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            dragActive ? "border-accent-500 bg-accent-50/50" :
            darkMode ? "border-dark-border bg-dark-surface hover:border-brand-600" : "border-slate-200 bg-surface hover:border-brand-400"
          }`}
        >
          <ImagePlus className={`w-10 h-10 mb-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
          <p className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            {dragActive ? "Drop files here..." : "Drag & drop images here, or click to browse"}
          </p>
          <p className={`text-xs mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>PNG, JPG, WEBP up to 10MB</p>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => handleFiles(e.target.files)} />
        </div>

        {uploadedImages.length > 0 && (
          <div className="mt-6">
            <p className={`text-sm font-semibold mb-3 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              {uploadedImages.length} file{uploadedImages.length > 1 ? "s" : ""} uploaded
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={img.url} alt={img.name}
                    className={`w-full h-32 object-cover rounded-xl border ${darkMode ? "border-dark-border" : "border-slate-200"}`} />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className={`text-xs mt-1 truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{img.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
