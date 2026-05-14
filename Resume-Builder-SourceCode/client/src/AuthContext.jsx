import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from './api';
import { clearAuth as clearStoredAuth, getStoredToken, getStoredUser, saveAuth as saveStoredAuth } from './auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [authReady, setAuthReady] = useState(() => !getStoredToken());

  useEffect(() => {
    async function restoreSession() {
      const token = getStoredToken();

      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        clearStoredAuth();
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    }

    restoreSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      authReady,
      signIn(token, nextUser, rememberMe) {
        saveStoredAuth(token, nextUser, rememberMe);
        setUser(nextUser);
      },
      signOut() {
        clearStoredAuth();
        setUser(null);
      }
    }),
    [authReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return value;
}
