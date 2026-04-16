import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password });
      const { token, user: userData, business } = response.data.data;
      const userWithBusiness = business ? { ...userData, business } : userData;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithBusiness));

      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Token ${token}`;

      setUser(userWithBusiness);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      const { token, user: newUserData } = response.data.data;

      // For registration with verification flow, we don't log them in immediately
      // or we store them as pending
      setPendingUser(newUserData);
      
      // Store token (needed for verification)
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Token ${token}`;

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const verifyEmail = async (code) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/auth/verify-email/', { token, code });
      
      if (pendingUser) {
        const verifiedUser = { ...pendingUser, is_verified: true };
        localStorage.setItem('user', JSON.stringify(verifiedUser));
        setUser(verifiedUser);
        setPendingUser(null);
      }
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Verification failed'
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/settings/', profileData);
      const { user: updatedUser, profile: updatedProfile } = response.data.data;

      // Update stored user data
      const updatedUserData = { ...updatedUser, profile: updatedProfile };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUser(updatedUserData);

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Update failed'
      };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      pendingUser,
      loading,
      login,
      register,
      verifyEmail,
      logout,
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
