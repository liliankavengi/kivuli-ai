// M-Pesa transaction category keyword map
// Pure frontend — no backend needed
// To add categories: add keywords to any existing array or add a new entry

export const CATEGORY_MAP = [
  { category: "Food & Groceries",    keywords: ["naivas", "quickmart", "carrefour", "tuskys", "food", "mboga", "supermarket", "groceries", "restaurant", "cafe", "kfc", "java"] },
  { category: "Transport",           keywords: ["uber", "bolt", "little", "taxi", "matatu", "petrol", "fuel", "parking", "ntsa", "bus"] },
  { category: "Utilities",           keywords: ["kenya power", "kplc", "nairobi water", "safaricom home", "zuku", "internet", "airtime", "data"] },
  { category: "Business Income",     keywords: ["received from", "business payment", "till", "paybill", "payment from", "b2c", "salary"] },
  { category: "Transfer In",         keywords: ["deposited by", "received", "sent to you"] },
  { category: "Transfer Out",        keywords: ["sent to", "paid to", "withdraw", "atm"] },
  { category: "Healthcare",          keywords: ["pharmacy", "hospital", "clinic", "dawa", "nhif", "medical"] },
  { category: "Education",           keywords: ["school", "college", "university", "fees", "tuition", "books"] },
  { category: "Entertainment",       keywords: ["showmax", "netflix", "dstv", "multichoice", "cinema", "event"] },
  { category: "Savings & Insurance", keywords: ["m-shwari", "fuliza", "kcb mpesa", "insurance", "pension", "sacco"] },
];

export const DEFAULT_CATEGORY = "Other";

/**
 * Categorize an M-Pesa transaction description
 * @param {string} description - Transaction detail string from M-Pesa CSV
 * @returns {string} category name
 */
export function categorize(description = "") {
  const lower = description.toLowerCase();
  const match = CATEGORY_MAP.find((entry) =>
    entry.keywords.some((kw) => lower.includes(kw))
  );
  return match ? match.category : DEFAULT_CATEGORY;
}
