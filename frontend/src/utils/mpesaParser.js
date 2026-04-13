import Papa from "papaparse";
import { categorize } from "../features/ledger/categoryMap";

/**
 * Parse an M-Pesa CSV export file into structured transactions
 * Pure frontend — no backend needed
 * 🔌 Backend: POST /api/ledger/upload/ for server-side parsing + DB storage
 *
 * M-Pesa CSV columns (MySafaricom export):
 * Receipt No., Completion Time, Details, Transaction Status, Paid In, Withdrawn, Balance
 */
export function parseMpesaCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const rows = results.data
          .filter((row) => row["Transaction Status"] === "Completed")
          .map((row, i) => {
            const paidIn = parseFloat((row["Paid In"] || "0").replace(/,/g, "")) || 0;
            const withdrawn = parseFloat((row["Withdrawn"] || "0").replace(/,/g, "")) || 0;
            const description = row["Details"] || "";

            return {
              id: row["Receipt No."] || `row-${i}`,
              date: row["Completion Time"] || "",
              description,
              amount: paidIn > 0 ? paidIn : -withdrawn,
              type: paidIn > 0 ? "income" : "expense",
              category: categorize(description),
              balance: parseFloat((row["Balance"] || "0").replace(/,/g, "")) || 0,
            };
          });
        resolve(rows);
      },
      error: reject,
    });
  });
}

/**
 * Persist transactions to localStorage
 * 🔌 Backend replaces localStorage with DB persistence
 */
const STORAGE_KEY = "kivuli_ledger";

export function saveLedger(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function loadLedger() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function clearLedger() {
  localStorage.removeItem(STORAGE_KEY);
}
