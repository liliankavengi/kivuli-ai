import ForecastFeature from "../features/forecast/ForecastPage";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

export default function ForecastPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return (
    <DashboardLayout>
      <ForecastFeature />
    </DashboardLayout>
  );
}
