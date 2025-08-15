import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/api";
import type { AuthUser, Role } from "../types/auth";

type Ctx = {
  user: AuthUser | null;
  loading: boolean;
  loginLocal: (token: string, user?: AuthUser) => void;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({
  user: null,
  loading: true,
  loginLocal: () => {},
  logout: () => {},
  refresh: async () => {},
});

// ✅ helper to ensure role is always set
const normalizeUser = (u: AuthUser): AuthUser => ({
  ...u,
  role: u.data?.type, // copy role from backend into top-level field
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch latest user from backend
  const refresh = async () => {
    try {
      const { data } = await api.get<AuthUser>("/api/auth/me");
      setUser(normalizeUser(data));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // when logging in
  const loginLocal = (token: string, u?: AuthUser) => {
    localStorage.setItem("token", token);
    if (u) {
      const normalized = normalizeUser(u);
      localStorage.setItem("user", JSON.stringify(normalized));
      setUser(normalized);
      setLoading(false);
    } else {
      refresh();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // load from storage on startup
  useEffect(() => {
    const t = localStorage.getItem("token");
    const cached = localStorage.getItem("user");
    if (t && cached) {
      try {
        const parsed = JSON.parse(cached) as AuthUser;
        setUser(normalizeUser(parsed));
        setLoading(false);
      } catch {
        refresh();
      }
    } else if (t) {
      refresh();
    } else {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, loginLocal, logout, refresh }),
    [user, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => useContext(AuthCtx);
export const hasRole = (user: AuthUser | null, roles: Role[]) =>
  !!user && roles.includes(user.role as Role);
