import { useState, useEffect } from "react";
import { getTrustScore } from "../features/dashboard/dashboardService";

export default function useTrustScore(businessId) {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!businessId) return;

    setLoading(true);
    setError(null);

    // Artificial delay to show loading state animations
    setTimeout(() => {
      getTrustScore(businessId)
        .then((data) => {
          setScoreData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to fetch trust score');
          setLoading(false);
        });
    }, 1500);

  }, [businessId]);

  return { scoreData, loading, error };
}
