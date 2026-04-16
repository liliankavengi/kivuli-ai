import { useState, useEffect } from "react";
import { User, Building, Save, Mail, Phone, Briefcase, Loader2, Key } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import DashboardLayout from "../layouts/DashboardLayout";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { darkMode } = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    business_name: "",
    industry: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.profile?.phone_number || user.business?.owner_phone || "",
        business_name: user.business?.name || "",
        industry: user.business?.industry || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const res = await updateProfile(formData);
    
    setLoading(false);
    if (res.success) {
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(res.error || "Failed to update profile.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in">
        <div className="mb-4">
        <h2 className={`text-3xl font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>Settings</h2>
        <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
          Manage your account and business details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          <form 
            onSubmit={handleSave}
            className={`p-8 rounded-3xl shadow-sm border ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? "text-brand-300" : "text-brand-900"}`}>
                Profile Information
              </h3>
            </div>

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-success-500/20 border border-success-500/30 text-success-700 dark:text-success-300 font-medium">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-medium">
                {errorMsg}
              </div>
            )}

            <div className="space-y-6">
              {/* Personal Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    <User className="w-4 h-4" /> First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                      darkMode ? "bg-dark-surface border-dark-border text-white focus:bg-dark-surface/80" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    <User className="w-4 h-4" /> Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                      darkMode ? "bg-dark-surface border-dark-border text-white focus:bg-dark-surface/80" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                      darkMode ? "bg-dark-surface border-dark-border text-white focus:bg-dark-surface/80" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    <Phone className="w-4 h-4" /> Phone Number (M-Pesa)
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                      darkMode ? "bg-dark-surface border-dark-border text-white focus:bg-dark-surface/80" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Security Warning Line */}
              <div className="border-t border-slate-200 dark:border-dark-border my-6"></div>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-brand-300" : "text-brand-900"}`}>
                Business Profile
              </h3>

              {/* Business Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    <Building className="w-4 h-4" /> Business Name
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                      darkMode ? "bg-dark-surface border-dark-border text-white focus:bg-dark-surface/80" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    <Briefcase className="w-4 h-4" /> Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${
                      darkMode ? "bg-dark-surface border-dark-border text-white focus:bg-dark-surface/80" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-brand-900 hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 text-lg"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* Right Column: Security/Password Reset Teaser */}
        <div className="space-y-6">
          <div className={`p-8 rounded-3xl shadow-sm border ${darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-100"}`}>
             <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${darkMode ? "bg-brand-900/40" : "bg-brand-50"}`}>
                  <Key className={`w-6 h-6 ${darkMode ? "text-brand-400" : "text-brand-700"}`} />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Security</h3>
             </div>
             
             <p className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
               Keep your account secure by updating your password regularly. 
               We recommend using a strong password.
             </p>

             <button
               className={`w-full py-3 px-4 rounded-xl font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                 darkMode 
                  ? "border-brand-700 text-brand-300 hover:bg-brand-900/30" 
                  : "border-brand-200 text-brand-700 hover:bg-brand-50"
               }`}
             >
                Change Password
             </button>
             <p className={`text-xs mt-4 text-center ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
               Password reset feature is currently limited to registered email recovery.
             </p>
          </div>
        </div>

      </div>
    </div>
    </DashboardLayout>
  );
}
