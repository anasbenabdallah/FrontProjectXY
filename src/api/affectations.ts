// src/api/affectations.ts
import {
  listEntities,
  createEntity,
  updateEntity,
  deleteEntity,
} from "./shared";

export const listAffectations = (params?: Record<string, any>) =>
  listEntities<any>("affectations", params);

export const createAffectation = (data: {
  carId: string;
  driverId: string;
  notes?: string;
}) => createEntity("affectations", { data, status: true });

export const endAffectation = (id: string) =>
  updateEntity("affectations", id, { status: false }); // backend will set data.endAt

export const deleteAffectation = (id: string) =>
  deleteEntity("affectations", id);
