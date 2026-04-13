/**
 * Pure JS cash flow forecast utilities
 * No backend needed for trend projection
 *  Backend: GET /api/forecast/?business_id=BIZ-001 for ML-powered forecast (ARIMA/Prophet)
 */

/**
 * Simple linear regression on an array of numbers
 */
function linearRegression(values) {
  const n = values.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  values.forEach((y, x) => {
    num += (x - xMean) * (y - yMean);
    den += (x - xMean) ** 2;
  });
  const slope = den !== 0 ? num / den : 0;
  const intercept = yMean - slope * xMean;
  return { slope, intercept };
}

/**
 * Project n months ahead from historical monthly totals
 * @param {number[]} historicalValues - array of monthly amounts (oldest first)
 * @param {number} monthsAhead - how many months to project
 * @returns {number[]} projected values
 */
export function linearForecast(historicalValues, monthsAhead = 3) {
  const { slope, intercept } = linearRegression(historicalValues);
  const n = historicalValues.length;
  return Array.from({ length: monthsAhead }, (_, i) => {
    const projected = intercept + slope * (n + i);
    return Math.max(0, Math.round(projected));
  });
}

/**
 * Build chart-ready dataset combining historical + forecast
 * @param {Object[]} monthlyData - [{ month: "Jan", income: 50000, expenses: 30000 }]
 * @param {number} monthsAhead
 */
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildForecastSeries(monthlyData, monthsAhead = 3) {
  const incomes = monthlyData.map((d) => d.income);
  const expenses = monthlyData.map((d) => d.expenses);

  const projectedIncome = linearForecast(incomes, monthsAhead);
  const projectedExpenses = linearForecast(expenses, monthsAhead);

  // Work out what month to label next
  const lastMonthName = monthlyData[monthlyData.length - 1]?.month || "Dec";
  const lastMonthIdx = MONTH_NAMES.indexOf(lastMonthName);

  const forecasted = Array.from({ length: monthsAhead }, (_, i) => {
    const monthIdx = (lastMonthIdx + 1 + i) % 12;
    return {
      month: MONTH_NAMES[monthIdx],
      income: projectedIncome[i],
      expenses: projectedExpenses[i],
      net: projectedIncome[i] - projectedExpenses[i],
      projected: true, // flag for chart to use dashed style
    };
  });

  const historical = monthlyData.map((d) => ({
    ...d,
    net: d.income - d.expenses,
    projected: false,
  }));

  return [...historical, ...forecasted];
}
