import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Trash2, Zap } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import useMentor from "./useMentor";
import ChatBubble from "./ChatBubble";

export default function MentorWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { darkMode } = useTheme();
  const { messages, isTyping, sendMessage, clearMessages } = useMentor();
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-80 md:w-96 flex flex-col rounded-3xl shadow-2xl border overflow-hidden transition-all animate-in ${
            darkMode ? "bg-dark-card border-dark-border" : "bg-white border-slate-200"
          }`}
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="bg-brand-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Kivuli Mentor</p>
                <p className="text-brand-200 text-xs">Powered by Gemini · Always here</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearMessages} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-brand-200 hover:text-white">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-brand-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="w-7 h-7 rounded-full bg-brand-900 flex items-center justify-center flex-shrink-0 mt-1 mr-2 shadow">
                  <span className="text-white text-xs font-bold">K</span>
                </div>
                <div className={`px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center ${darkMode ? "bg-dark-surface border border-dark-border" : "bg-slate-100"}`}>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className={`p-3 border-t flex gap-2 flex-shrink-0 ${darkMode ? "border-dark-border bg-dark-surface" : "border-slate-100 bg-slate-50"}`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Kivuli anything..."
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-brand-400 transition-all ${
                darkMode
                  ? "bg-dark-card border-dark-border text-white placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
              }`}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-brand-900 hover:bg-brand-800 flex items-center justify-center text-white transition-all disabled:opacity-40 cursor-pointer flex-shrink-0 shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-900 hover:bg-brand-800 shadow-2xl shadow-brand-900/40 flex items-center justify-center text-white transition-all hover:scale-110 cursor-pointer"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
