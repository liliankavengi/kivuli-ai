import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import DashboardPage from "../pages/DashboardPage";
import LedgerPage from "../pages/LedgerPage";
import ForecastPage from "../pages/ForecastPage";
import InventoryPage from "../pages/InventoryPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ledger" element={<LedgerPage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/inventory" element={<InventoryPage />} />

        {/* Fallback */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
