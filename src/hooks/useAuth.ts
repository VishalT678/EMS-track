import { useState, useEffect } from 'react';
import { authAPI } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'hospital' | 'ambulance';
  name: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await authAPI.getCurrentUser();
          setAuthState({
            user: response.data,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: 'Failed to authenticate',
        });
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setAuthState({
        user,
        loading: false,
        error: null,
      });
      return true;
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: 'Login failed. Please check your credentials.',
      });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'hospital' | 'ambulance') => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await authAPI.register({ email, password, name, role });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setAuthState({
        user,
        loading: false,
        error: null,
      });
      return true;
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: 'Registration failed. Please try again.',
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
    navigate('/login');
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
  };
}; 