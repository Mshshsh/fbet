import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi } from '../api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fbet_admin_token');
    if (token) {
      getMeApi()
        .then((res) => {
          const u = res.data.data;
          if (u.role === 'admin' || u.role === 'moderator') {
            setUser(u);
          } else {
            localStorage.removeItem('fbet_admin_token');
          }
        })
        .catch(() => localStorage.removeItem('fbet_admin_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('fbet_admin_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('fbet_admin_token');
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
