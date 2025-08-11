// types/auth.ts
export type LoginPayload = {
  email: string;
  password: string; // <-- align with backend
};

export type AuthUser = {
  _id: string;
  status: boolean;
  type: "users";
  data: {
    email: string;
    type: "super_admin" | "admin" | "user";
  };
  createdAt?: string;
  updatedAt?: string;
};
