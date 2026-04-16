import { useState, useEffect } from "react";
import { getTrustScore } from "../features/dashboard/dashboardService";

export default function useTrustScore() {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Artificial delay to show loading state animations
    setTimeout(() => {
      getTrustScore()
        .then((data) => {
          setScoreData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to fetch trust score');
          setLoading(false);
        });
    }, 1500);

  }, []);

  return { scoreData, loading, error };
}
