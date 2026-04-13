import { useState, useCallback } from "react";
import { getMockResponse } from "./mockResponses";
// 🔌 When backend ready: import API from "../../services/api";

const KIVULI_INTRO = {
  id: "intro",
  role: "assistant",
  text: "Hello! I'm Kivuli, your AI financial mentor. Ask me anything about your Trust Score, M-Pesa transactions, loans, or savings strategies.",
  timestamp: new Date(),
};

export default function useMentor() {
  const [messages, setMessages] = useState([KIVULI_INTRO]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // 🔌 Replace with: const { data } = await API.post("/mentor/chat/", { message: text });
    const reply = await new Promise((resolve) =>
      setTimeout(() => resolve(getMockResponse(text)), 1000 + Math.random() * 800)
    );

    const assistantMsg = {
      id: Date.now() + 1,
      role: "assistant",
      text: reply,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMsg]);
  }, []);

  const clearMessages = () => setMessages([KIVULI_INTRO]);

  return { messages, isTyping, sendMessage, clearMessages };
}
