// src/config/permissions.ts
export type PermissionAction = "read" | "create" | "update" | "delete";

export const rolePermissions: Record<
  string,
  Record<string, PermissionAction[]>
> = {
  conducteur: {
    "carte-interactive": ["read"], // Page OpenStreetMap
  },
  utilisateur: {
    "*": ["read"], // Lecture seule partout
  },
  admin: {
    "*": ["read", "create", "update"], // Pas de delete
  },
  super_admin: {
    "*": ["read", "create", "update", "delete"], // Accès total
  },
};
