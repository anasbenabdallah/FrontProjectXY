// api/auth.ts
import api from "./api";
import type { AuthUser, LoginPayload } from "../types/auth";

export async function login(payload: LoginPayload) {
  // POST /auth/login expects { email, password }
  const { data } = await api.post<{ token: string; user: AuthUser }>(
    "api/auth/login",
    payload
  );
  return data;
}

// keep if you’ll add a /auth/me later; otherwise you can remove for now
export async function me() {
  const { data } = await api.get<AuthUser>("/api/auth/me");
  return data;
}
