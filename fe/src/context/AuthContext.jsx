import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginApi, logoutApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken]   = useState(() => localStorage.getItem('access_token') || null);
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token') || null);

  const isAuthenticated = !!accessToken;

  const login = useCallback(async (username, password) => {
    const data = await loginApi(username, password); // throws on error
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (refreshToken) await logoutApi(refreshToken);
    } catch {
      // blacklist thất bại vẫn clear local state
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setAccessToken(null);
      setRefreshToken(null);
    }
  }, [refreshToken]);

  const getAccessToken = useCallback(() => accessToken, [accessToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
