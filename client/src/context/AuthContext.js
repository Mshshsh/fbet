import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi } from '../api/auth.api';
import { reconnectSocket } from '../socket/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fbet_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('fbet_token');
      if (savedToken) {
        try {
          const res = await getMeApi();
          setUser(res.data.data);
          setToken(savedToken);
        } catch {
          localStorage.removeItem('fbet_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = (tokenVal, userData) => {
    localStorage.setItem('fbet_token', tokenVal);
    setToken(tokenVal);
    setUser(userData);
    reconnectSocket(); // Yeni token ile socket'i yeniden bağla
  };

  const logout = () => {
    localStorage.removeItem('fbet_token');
    setToken(null);
    setUser(null);
    reconnectSocket();
  };

  const updateUser = (updates) => setUser((prev) => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
