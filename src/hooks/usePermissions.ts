import { useAuth } from "./useAuth";
import { rolePermissions } from "../config/permissions";
import type { PermissionAction } from "../config/permissions";

export function usePermissions() {
  const { user } = useAuth();

  const can = (page: string, action: PermissionAction): boolean => {
    const role = user?.data?.type; // 🔹 rôle dans data.type
    if (!role) return false;
    const permissions = rolePermissions[role] || {};
    const actions = permissions[page] || permissions["*"] || [];
    return actions.includes(action);
  };

  return { can };
}
