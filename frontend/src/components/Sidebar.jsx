import { Shield, Home, FileText, TrendingUp, Settings, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard",  icon: Home,       path: "/dashboard" },
    { name: "Ledger",     icon: FileText,   path: "/ledger" },
    { name: "Forecast",   icon: TrendingUp, path: "/forecast" },
    { name: "Settings",   icon: Settings,   path: "#" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-brand-900 min-h-screen text-brand-200 flex flex-col items-center py-8 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12 w-full px-8">
        <div className="bg-white/15 backdrop-blur p-2 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-wide">Kivuli AI</span>
      </div>

      {/* Navigation */}
      <nav className="w-full flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-white/15 text-white"
                  : "hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Dark Mode Toggle */}
      <div className="w-full px-4 mb-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-medium bg-white/10 hover:bg-white/15 text-white cursor-pointer"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Sign Out */}
      <div className="w-full px-4 mt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-medium hover:bg-rose-500/15 hover:text-rose-300 text-brand-300 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
