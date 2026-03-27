import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppUser } from '../types';
import { authStore, authService } from '../services/authService';

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  provider: string;
  login: (email: string, password: string) => Promise<AppUser>;
  register: (email: string, password: string, displayName: string, firstName?: string, lastName?: string) => Promise<AppUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(authStore.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authStore.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        provider: authService.provider,
        login: authService.login,
        register: (email, password, displayName, firstName?, lastName?) =>
          authService.register(email, password, displayName, firstName, lastName),
        logout: authService.logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
