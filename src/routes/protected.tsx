import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth.tsx";

type ProtectedProps = {
  children: ReactNode;
  roles?: string[]; // optional: allowed roles (e.g., ["super_admin", "admin"])
  redirectTo?: string; // optional: path to redirect if role not allowed
  fallback?: ReactNode; // optional: loading UI
};

export default function Protected({
  children,
  roles,
  redirectTo = "/dashboard", // default redirect for unauthorized users
  fallback,
}: ProtectedProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <>{fallback ?? null}</>;

  // 🔹 Not authenticated → go to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🔹 Optional role restriction
  if (roles && roles.length > 0) {
    const normalize = (s: string) =>
      (s || "").toLowerCase().replace(/[_\s-]/g, "");
    const userRole = normalize(user?.role || user?.data?.type || "");
    const allowed = roles.map(normalize);

    if (!allowed.includes(userRole)) {
      // Authenticated but role not allowed → redirect
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
}
