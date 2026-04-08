import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We're fetching for Business ID 1 (the one you created in Admin)
        axios.get('http://127.0.0.1:8000/api/score/1/')
            .then(response => {
                // Since Gemini returns a string/JSON, we parse it if needed
                setAiData(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Connection error:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-indigo-900">Kivuli AI Dashboard</h1>
                <p className="text-slate-500">Real-time Financial Mentor</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Trust Score Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium">AI Trust Rating</h3>
                    <p className="text-4xl font-black text-indigo-600">
                        {loading ? "..." : "82%"}
                    </p>
                    <div className="mt-2 text-xs text-emerald-600 font-bold">↑ 5% from last month</div>
                </div>

                {/* AI Insight Card */}
                <div className="md:col-span-2 bg-indigo-900 text-white p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="text-yellow-400" size={20} />
                        <h4 className="font-bold">Kivuli Mentor Insight</h4>
                    </div>
                    <p className="text-indigo-100 italic leading-relaxed">
                        {loading ? "Kivuli is thinking..." : aiData?.ai_insight || "Add transactions in Admin to see insights!"}
                    </p>
                </div>
            </div>

            {/* Visual representation of data flow */}
            <div className="mt-8 text-center text-slate-400 text-xs uppercase tracking-widest">
                Live Link: Django Port 8000 ↔️ React Port 5173
            </div>
        </div>
    );
};

export default Dashboard;