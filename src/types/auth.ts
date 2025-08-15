export type LoginPayload = {
  email: string;
  password: string;
};

export type Role = "super_admin" | "admin" | "utilisateur" | "conducteur";

export type AuthUser = {
  _id: string;
  status: boolean;
  type: "users";
  data: {
    email: string;
    type: Role; // from backend
  };
  role?: Role; // 🔹 normalized role for frontend use
  createdAt?: string;
  updatedAt?: string;
};
