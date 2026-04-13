import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../features/dashboard/Dashboard";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useAuth();

  // Basic route protection
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
