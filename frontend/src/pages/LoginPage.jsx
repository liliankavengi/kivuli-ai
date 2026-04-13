import Login from "../features/auth/Login";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { user } = useAuth();

  // If already authenticated, go to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}
