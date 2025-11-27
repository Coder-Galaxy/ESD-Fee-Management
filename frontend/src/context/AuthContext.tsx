import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

type AuthUser = {
  employeeId: number;
  email: string;
  emailVerified: boolean;
  name: string;
};

type AuthStore = {
  user: AuthUser | null;
  token: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "esd-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthStore>({ user: null, token: null });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: AuthStore = JSON.parse(stored);
        setState(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  const login = useCallback((user: AuthUser, token: string) => {
    setState({ user, token });
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, token: null });
  }, []);

  const value = useMemo(() => ({ user: state.user, token: state.token, login, logout }), [state, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

