// src/api/shared.ts
import api from "./api";
import type { EntityType, SharedDoc, ListResponse } from "../types/shared";

export async function listEntities<T>(
  type: EntityType,
  params?: Record<string, any>
) {
  const { data } = await api.get<ListResponse<SharedDoc<T>>>(`/api/${type}`, {
    params,
  });
  return Array.isArray(data) ? data : data.data;
}

export async function createEntity<T>(
  type: EntityType,
  payload: { data: T; status?: boolean }
) {
  const body: any = { type, data: payload.data };
  if (typeof payload.status === "boolean") body.status = payload.status;
  const { data } = await api.post<SharedDoc<T>>(`/api`, body);
  return data;
}

export async function updateEntity<T>(
  type: EntityType,
  id: string,
  payload: { data?: Partial<T>; status?: boolean }
) {
  const body: any = {};
  if (payload.data) body.data = payload.data;
  if (typeof payload.status === "boolean") body.status = payload.status;
  const { data } = await api.patch<SharedDoc<T>>(`/api/${type}/${id}`, body);
  return data;
}

export async function deleteEntity(type: EntityType, id: string) {
  const { data } = await api.delete(`/api/${type}/${id}`);
  return data; // { message: "Supprimé" }
}
