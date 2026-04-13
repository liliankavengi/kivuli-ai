import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Holds the pending registration before email is verified
  const [pendingUser, setPendingUser] = useState(null);

  const login = (email, password) => {
    setUser({ email, isAuthenticated: true, businessId: null });
  };

  // Called on Register form submit — stores details, triggers "send email"
  const register = (name, email, password) => {
    // In a real app: call POST /api/auth/register/ here
    setPendingUser({ name, email, password });
    return true; // signals success so the page can navigate to /verify-email
  };

  // Called when the user enters the correct OTP
  const verifyEmail = () => {
    if (!pendingUser) return false;
    setUser({ email: pendingUser.email, name: pendingUser.name, isAuthenticated: true, businessId: null });
    setPendingUser(null);
    return true;
  };

  const setBusinessId = (businessId) => {
    setUser((prev) => prev ? { ...prev, businessId: businessId.toUpperCase() } : prev);
  };

  const logout = () => {
    setUser(null);
    setPendingUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, pendingUser, login, register, verifyEmail, logout, setBusinessId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
