import { useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { authAPI } from '../services/api';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const response = await authAPI.getCurrentUser();
      setAuthState({
        user: response.data,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      localStorage.removeItem('auth-token');
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      
      localStorage.setItem('auth-token', token);
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return {
    ...authState,
    login,
    logout,
    updateUser
  };
}