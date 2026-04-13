import LedgerFeature from "../features/ledger/LedgerPage";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

export default function LedgerPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return (
    <DashboardLayout>
      <LedgerFeature />
    </DashboardLayout>
  );
}
