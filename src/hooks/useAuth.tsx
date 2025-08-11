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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // on first load, try get user
  const refresh = async () => {
    try {
      const { data } = await api.get<AuthUser>("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // when logging in from Login/Register, we can set token immediately
  const loginLocal = (token: string, u?: AuthUser) => {
    localStorage.setItem("token", token);
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
      setLoading(false);
    } else {
      // fallback: fetch /auth/me to populate
      refresh();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    const cached = localStorage.getItem("user");
    if (t && cached) {
      try {
        setUser(JSON.parse(cached) as AuthUser);
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
  !!user && roles.includes(user.role);
