// src/types/shared.ts
export type EntityType =
  | "cars"
  | "drivers"
  | "users"
  | "enums"
  | "affectations"
  | "gps";

export type SharedDoc<T = any> = {
  _id: string;
  status: boolean; // boolean in backend
  type: EntityType;
  data: T;
  car?: SharedDoc | null; // optional when populate=true
  driver?: SharedDoc | null; // optional when populate=true
  createdAt?: string;
  updatedAt?: string;
};

export type ListResponse<T> =
  | {
      data: T[];
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    }
  | T[]; // controller may return plain array in some cases
