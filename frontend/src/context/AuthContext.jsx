import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    authService.logout();
  }, []);

  const updateProfile = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(userData);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    setUser,
    token,
    setToken,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
