import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import DashboardPage from "../pages/DashboardPage";
import LedgerPage from "../pages/LedgerPage";
import ForecastPage from "../pages/ForecastPage";
import InventoryPage from "../pages/InventoryPage";
import SettingsPage from "../pages/SettingsPage";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

// Public Route Component (redirects to dashboard if already authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/verify-email" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/ledger" element={<ProtectedRoute><LedgerPage /></ProtectedRoute>} />
        <Route path="/forecast" element={<ProtectedRoute><ForecastPage /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
