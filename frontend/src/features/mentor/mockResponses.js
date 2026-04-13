// Keyword-matched mock responses for Kivuli AI Mentor
// 🔌 Replace useMentor.js API call with POST /api/mentor/chat/ when backend is ready

const RESPONSES = [
  {
    keywords: ["trust score", "score", "rating", "credit"],
    reply: "Your Kivuli Trust Score is calculated from your M-Pesa transaction patterns — consistency, volume, and income diversity all contribute. The higher it is, the more lenders trust you.",
  },
  {
    keywords: ["loan", "borrow", "credit", "finance", "lend"],
    reply: "With a score above 80, you qualify for micro-loans from our partner lenders. Would you like me to show you eligible loan products based on your current score?",
  },
  {
    keywords: ["savings", "save", "emergency fund"],
    reply: "Building a 3-month emergency fund is one of the strongest signals for lenders. Even saving KES 500/week consistently will improve your Trust Score over time.",
  },
  {
    keywords: ["mpesa", "m-pesa", "transaction", "statement"],
    reply: "Upload your M-Pesa CSV statement from MySafaricom App under 'Statement > Download'. I'll auto-categorize your transactions and build your financial profile.",
  },
  {
    keywords: ["receipt", "photo", "scan", "ocr"],
    reply: "You can upload receipt photos directly in the 'Upload Documents' section. I'll read the amount, date, and merchant automatically and add it to your ledger.",
  },
  {
    keywords: ["forecast", "predict", "future", "next month", "cash flow"],
    reply: "The 3-Month Cash Flow Forecast is based on your historical M-Pesa patterns. Check the Forecast tab to see your projected income and expenses.",
  },
  {
    keywords: ["sdg", "sustainable", "un", "goal 8"],
    reply: "Kivuli AI is aligned with UN Sustainable Development Goal 8 — Decent Work and Economic Growth. Your financial health directly contributes to Kenyan economic resilience.",
  },
  {
    keywords: ["hi", "hello", "hey", "start", "help"],
    reply: "Hello! I'm Kivuli, your AI financial mentor. Ask me about your Trust Score, M-Pesa transactions, loans, or savings strategies. I'm here to help your business grow 🌱",
  },
  {
    keywords: ["income", "revenue", "earn", "sales"],
    reply: "Diversify your income streams where possible — businesses with 2+ income sources typically score 8-12 points higher on the Kivuli Trust Score.",
  },
  {
    keywords: ["expense", "spend", "cost", "payment"],
    reply: "Track your expenses in the Ledger tab. Reducing discretionary spend by 10% can improve your net cash flow, which directly impacts your Trust Score.",
  },
];

const DEFAULT_REPLY =
  "That's a great question. As your financial mentor, I can help with Trust Scores, M-Pesa analysis, savings strategies, and business growth. What would you like to explore?";

export function getMockResponse(message) {
  const lower = message.toLowerCase();
  const match = RESPONSES.find((r) =>
    r.keywords.some((kw) => lower.includes(kw))
  );
  return match ? match.reply : DEFAULT_REPLY;
}
