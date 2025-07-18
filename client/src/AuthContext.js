import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setUser({ email: localStorage.getItem('email'), avatar: localStorage.getItem('avatar') });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setToken(data.token);
      setUser({ email: data.email, avatar: data.avatar });
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('avatar', data.avatar || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setToken(data.token);
      setUser({ email: data.email, avatar: data.avatar });
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('avatar', data.avatar || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('avatar');
  };

  // Helper: fetch with auto-refresh
  const fetchWithAuth = async (url, options = {}) => {
    let res = await fetch(`${process.env.REACT_APP_API_URL || ''}${url.startsWith('/') ? url : '/' + url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    if (res.status === 401 || res.status === 403) {
      // Try to refresh token
      const refreshRes = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/auth/refresh-token`, { method: 'POST', credentials: 'include' });
      const refreshData = await refreshRes.json();
      if (refreshRes.ok && refreshData.token) {
        setToken(refreshData.token);
        localStorage.setItem('token', refreshData.token);
        // Retry original request with new token
        res = await fetch(`${process.env.REACT_APP_API_URL || ''}${url.startsWith('/') ? url : '/' + url}`, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${refreshData.token}`,
          },
        });
      } else {
        logout();
        throw new Error('Session expired. Please log in again.');
      }
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 