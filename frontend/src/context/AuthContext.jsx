import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginRequest, registerRequest, logoutRequest } from '../api/authApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('worldcup_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser(token);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('worldcup_token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    const nextToken = response.token;
    localStorage.setItem('worldcup_token', nextToken);
    setToken(nextToken);
    const userData = await getCurrentUser(nextToken);
    setUser(userData);
    return response;
  };

  const register = async (data) => {
    return registerRequest(data);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.warn('Logout local sin respuesta');
    }
    localStorage.removeItem('worldcup_token');
    setToken('');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token && user)
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
