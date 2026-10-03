"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearDemoAuthenticated,
  isDemoAuthenticated,
  setDemoAuthenticated,
  validateDemoCredentials,
} from "@/lib/auth-demo";

type AuthContextValue = {
  ready: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isDemoAuthenticated());
    setReady(true);
  }, []);

  const login = useCallback((username: string, password: string) => {
    if (!validateDemoCredentials(username, password)) return false;
    setDemoAuthenticated();
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearDemoAuthenticated();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ ready, isAuthenticated, login, logout }),
    [ready, isAuthenticated, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
