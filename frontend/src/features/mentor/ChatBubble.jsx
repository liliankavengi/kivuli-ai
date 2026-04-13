import { useTheme } from "../../context/ThemeContext";

export default function ChatBubble({ message }) {
  const { darkMode } = useTheme();
  const isUser = message.role === "user";

  const time = message.timestamp instanceof Date
    ? message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {/* Kivuli avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-brand-900 flex items-center justify-center flex-shrink-0 mt-1 mr-2 shadow">
          <span className="text-white text-xs font-bold">K</span>
        </div>
      )}

      <div className="max-w-[78%] space-y-1">
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-brand-900 text-white rounded-br-sm"
              : darkMode
                ? "bg-dark-surface text-slate-200 border border-dark-border rounded-bl-sm"
                : "bg-slate-100 text-slate-800 rounded-bl-sm"
          }`}
        >
          {message.text}
        </div>
        <p className={`text-xs px-1 ${isUser ? "text-right" : "text-left"} ${darkMode ? "text-slate-600" : "text-slate-400"}`}>
          {time}
        </p>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0 mt-1 ml-2 shadow">
          <span className="text-white text-xs font-bold">Y</span>
        </div>
      )}
    </div>
  );
}
