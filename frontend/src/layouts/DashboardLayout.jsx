import Sidebar from "../components/Sidebar";
import MentorWidget from "../features/mentor/MentorWidget";
import { useTheme } from "../context/ThemeContext";

export default function DashboardLayout({ children }) {
  const { darkMode } = useTheme();

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${darkMode ? "bg-dark-surface" : "bg-surface"}`}>
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      {/* AI Mentor floats over all dashboard pages */}
      <MentorWidget />
    </div>
  );
}
