import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL, getToken, getUser, saveSession, clearSession, userCan } from './auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  // ready = we know who the user is (cached copy exists, or the server has answered)
  const [ready, setReady] = useState(!getToken() || !!getUser());

  const login = useCallback((token, nextUser) => {
    saveSession(token, nextUser);
    setUser(nextUser);
    setReady(true);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // Used after the profile changes (name, ID image...). Optionally swaps in a fresh token.
  const updateUser = useCallback((nextUser, token) => {
    saveSession(token, nextUser);
    setUser(nextUser);
  }, []);

  // Re-read role & permissions from the server so a role change shows up without a new login
  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) { setReady(true); return; }
    try {
      const res = await fetch(`${API_URL}/api/auth/me`);
      if (res.ok) {
        const data = await res.json();
        saveSession(null, data.user);
        setUser(data.user);
      }
    } catch (e) { /* offline: keep the cached copy */ }
    setReady(true);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo(() => ({
    user,
    ready,
    isLoggedIn: !!getToken() && !!user,
    can: (p) => userCan(user, p),
    canAny: (...ps) => ps.some((p) => userCan(user, p)),
    login, logout, updateUser, refresh,
  }), [user, ready, login, logout, updateUser, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
