import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth.tsx";

type ProtectedProps = {
  children: ReactNode;
  roles?: string[]; // optional: allowed roles (e.g., ["super_admin", "admin"])
  fallback?: ReactNode; // optional: loading UI
};

export default function Protected({
  children,
  roles,
  fallback,
}: ProtectedProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <>{fallback ?? null}</>;

  // Not authenticated → go to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Optional role gate (if you pass `roles`)
  if (roles && roles.length > 0) {
    const normalize = (s: string) =>
      (s || "").toLowerCase().replace(/[_\s-]/g, "");
    const userRole = normalize(user?.data?.type ?? "");
    const allowed = roles.map(normalize);
    if (!allowed.includes(userRole)) {
      // Authenticated but not allowed → back to dashboard (or a 403 page)
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
