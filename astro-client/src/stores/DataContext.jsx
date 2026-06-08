import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (err) {
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const showToast = useCallback((message, severity = 'info') => {
    setToast({ open: true, message, severity });
  }, []);

  const closeToast = useCallback(() => {
    setToast({ open: false, message: '', severity: 'info' });
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
      }
      setUser(response.data.user);
      showToast('Login successful!', 'success');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', { username, email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
      }
      setUser(response.data.user);
      showToast('Registration successful!', 'success');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      showToast(message, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    showToast('Logged out successfully', 'info');
  }, [showToast]);

  const updateProfile = async (data) => {
    try {
      const response = await api.put('/users/profile', data);
      setUser(response.data);
      showToast('Profile updated!', 'success');
      return response.data;
    } catch (err) {
      showToast('Failed to update profile', 'error');
      throw err;
    }
  };

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    toast,
    showToast,
    closeToast,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};