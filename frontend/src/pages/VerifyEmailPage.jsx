import VerifyEmail from "../features/auth/VerifyEmail";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function VerifyEmailPage() {
  const { user, pendingUser } = useAuth();
  // Already verified → dashboard
  if (user) return <Navigate to="/dashboard" replace />;
  // No pending registration → go register
  if (!pendingUser) return <Navigate to="/register" replace />;
  return <VerifyEmail />;
}
