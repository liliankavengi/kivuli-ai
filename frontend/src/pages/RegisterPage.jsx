import Register from "../features/auth/Register";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RegisterPage() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Register />;
}
