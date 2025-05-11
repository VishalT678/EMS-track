import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await fetchCurrentUser(storedToken);
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      console.log('Current user response:', response.data);
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setError('Failed to fetch user data');
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login for:', email);
      const response = await authAPI.login({ email, password });
      console.log('Login response:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register({ email, password, name, role });
      console.log('Registration response:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed');
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 