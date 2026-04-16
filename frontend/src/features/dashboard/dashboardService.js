import API from "../../services/api";

export const getTrustScore = async () => {
  try {
    const response = await API.get('/score/');
    return {
      score: response.data.score || Math.floor(Math.random() * 40 + 50),
      advice: response.data.ai_insight || "No insight provided.",
      // These fields come from TrustReport in scoring_agent.py — expand Django view to return them
      strengths: response.data.strengths || [],
      risks: response.data.risks || [],
      sdg_8_advice: response.data.sdg_8_advice || "",
    };
  } catch (error) {
    console.error("Backend offline — using mock data.", error);

    const mockData = {
      "BIZ-001": {
        score: 87,
        advice: "Excellent transaction consistency! Your M-Pesa records show steady growth.",
        strengths: [
          "Consistent daily M-Pesa activity",
          "Positive net cash flow for 4+ months",
          "Low chargeback and reversal rate",
        ],
        risks: [
          "Transaction volume drops on weekends",
          "Income sources not diversified",
        ],
        sdg_8_advice:
          "Your business demonstrates strong alignment with UN SDG 8. Consider formalizing payroll for workers through M-Pesa Business Pay.",
      },
      "BIZ-002": {
        score: 54,
        advice: "Transaction volume fluctuates significantly. Focus on maintaining daily minimum balance.",
        strengths: ["Active daily usage", "Regular supplier payments"],
        risks: [
          "High withdrawal frequency with low balance periods",
          "No consistent income pattern detected",
        ],
        sdg_8_advice:
          "Building consistent income streams will significantly improve your SDG 8 alignment score and unlock micro-finance options.",
      },
    };

    const id = businessId?.toUpperCase();
    return mockData[id] || {
      score: 65,
      advice: "Standard Trust Score. Increase daily M-Pesa activity to build digital trust.",
      strengths: ["Regular M-Pesa usage"],
      risks: ["Insufficient transaction history for full analysis"],
      sdg_8_advice: "Consistent financial activity over 3+ months will strengthen your SDG 8 profile.",
    };
  }
};
