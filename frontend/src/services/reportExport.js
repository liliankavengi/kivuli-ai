/**
 * Report Export Service
 * Handles generation and download of financial reports in CSV and JSON formats
 */

// CSV Export
export const generateCSVReport = (data, filename = "financial-report") => {
  const { summary, transactions = [] } = data;
  
  // Create summary section
  const summaryRows = [
    ["FINANCIAL SUMMARY REPORT"],
    [`Generated: ${new Date().toLocaleDateString()}`],
    [],
    ["Metric", "Value"],
    ["Total Income", `KES ${summary?.totalIncome?.toLocaleString() || 0}`],
    ["Total Expenses", `KES ${summary?.totalExpenses?.toLocaleString() || 0}`],
    ["Net Balance", `KES ${summary?.netBalance?.toLocaleString() || 0}`],
    ["Transaction Count", summary?.transactionCount || 0],
    [],
    ["DETAILED TRANSACTIONS"],
    ["Date", "Type", "Amount", "Category", "Receipt Number"],
  ];

  // Add transaction rows
  transactions.forEach((tx) => {
    summaryRows.push([
      new Date(tx.timestamp).toLocaleDateString(),
      tx.transaction_type || "N/A",
      `KES ${tx.amount}`,
      tx.ai_category || "Uncategorized",
      tx.mpesa_receipt_number || "N/A",
    ]);
  });

  // Convert to CSV string
  const csv = summaryRows
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma
          const cellStr = String(cell);
          return cellStr.includes(",") || cellStr.includes('"')
            ? `"${cellStr.replace(/"/g, '""')}"`
            : cellStr;
        })
        .join(",")
    )
    .join("\n");

  downloadFile(csv, `${filename}.csv`, "text/csv");
};

// JSON Export
export const generateJSONReport = (data, filename = "financial-report") => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, "application/json");
};

// PDF-like formatted text export
export const generateTextReport = (data, filename = "financial-report") => {
  const { summary, transactions = [], trustScore = {} } = data;
  
  const lines = [
    "═══════════════════════════════════════════════════════════",
    "              FINANCIAL REPORT - KIVULI".padStart(60),
    "═══════════════════════════════════════════════════════════",
    "",
    `Report Generated: ${new Date().toLocaleString()}`,
    "",
    "─── SUMMARY ───────────────────────────────────────────────",
    `Total Income:        KES ${(summary?.totalIncome || 0).toLocaleString()}`,
    `Total Expenses:      KES ${(summary?.totalExpenses || 0).toLocaleString()}`,
    `Net Balance:         KES ${(summary?.netBalance || 0).toLocaleString()}`,
    `Transactions:        ${summary?.transactionCount || 0}`,
    "",
    `Trust Score:         ${trustScore?.score || "N/A"}%`,
    `Status:              ${trustScore?.status || "N/A"}`,
    "",
    "─── TRANSACTIONS ───────────────────────────────────────────",
    `${"Date".padEnd(12)} ${"Type".padEnd(12)} ${"Amount".padEnd(15)} ${"Category".padEnd(20)} Receipt`,
    "─".repeat(70),
  ];

  transactions.forEach((tx) => {
    const date = new Date(tx.timestamp).toLocaleDateString();
    const type = (tx.transaction_type || "N/A").padEnd(12);
    const amount = `KES ${tx.amount}`.padEnd(15);
    const category = (tx.ai_category || "Uncategorized").padEnd(20);
    const receipt = tx.mpesa_receipt_number || "N/A";

    lines.push(`${date.padEnd(12)} ${type} ${amount} ${category} ${receipt}`);
  });

  lines.push("═".repeat(70));
  lines.push("");

  const text = lines.join("\n");
  downloadFile(text, `${filename}.txt`, "text/plain");
};

// Helper function to trigger download
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Get date range string for filename
export const getDateRangeString = (startDate, endDate) => {
  const start = new Date(startDate).toISOString().split("T")[0];
  const end = new Date(endDate).toISOString().split("T")[0];
  return `${start}_to_${end}`;
};
