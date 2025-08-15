// src/Pages/Shared/sharedConfigs.ts
import type { EntityType } from "../../types/shared";

export type FieldDef = {
  name: string; // key inside data.*
  labelKey: string; // i18n key
  required?: boolean;
};

export type EntityConfig = {
  type: EntityType;
  titleKey: string;
  editTitleKey?: string;
  fields: FieldDef[];
};

export const configs: Record<EntityType, EntityConfig> = {
  users: {
    type: "users",
    titleKey: "users.title",
    editTitleKey: "users.editTitle",
    fields: [
      { name: "username", labelKey: "users.username", required: true },
      { name: "email", labelKey: "auth.email", required: true },
      { name: "phone", labelKey: "users.phone" },
      {
        name: "role",
        labelKey: "users.role", // Le titre affiché en table et formulaire
        required: true,
      },
    ],
  },

  cars: {
    type: "cars",
    titleKey: "cars.title",
    editTitleKey: "cars.editTitle",
    fields: [
      { name: "license_plate", labelKey: "cars.plate", required: true },
      { name: "make", labelKey: "cars.make", required: true },
      { name: "model", labelKey: "cars.model", required: true },
      { name: "year", labelKey: "cars.year" },
      { name: "gps_number", labelKey: "cars.gps_number" },
      { name: "vehicle_unit", labelKey: "cars.vehicle_unit" },
      { name: "description", labelKey: "cars.description" },
      { name: "active", labelKey: "common.active" },
    ],
  },

  drivers: {
    type: "drivers",
    titleKey: "drivers.title",
    editTitleKey: "drivers.editTitle",
    fields: [
      { name: "prenom", labelKey: "drivers.firstName", required: true },
      { name: "nom", labelKey: "drivers.lastName", required: true },
      { name: "email", labelKey: "auth.email" },
      { name: "tel", labelKey: "drivers.phone" },
    ],
  },

  gps: {
    type: "gps",
    titleKey: "gps.title",
    editTitleKey: "gps.editTitle",
    fields: [
      { name: "gps_device_id", labelKey: "gps.deviceId", required: true },
      { name: "gps_number", labelKey: "gps.number" },
      { name: "vehicle_id", labelKey: "gps.vehicleId" },
      { name: "imei", labelKey: "gps.imei" },
      { name: "description", labelKey: "gps.description" },
    ],
  },

  affectations: {
    type: "affectations",
    titleKey: "affectations.title",
    editTitleKey: "affectations.editTitle",
    fields: [
      { name: "carId", labelKey: "affectations.carId", required: true },
      { name: "driverId", labelKey: "affectations.driverId", required: true },
      { name: "startAt", labelKey: "affectations.startAt" },
      { name: "endAt", labelKey: "affectations.endAt" },
    ],
  },
};
