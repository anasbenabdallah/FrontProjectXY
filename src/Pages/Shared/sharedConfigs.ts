// src/Pages/Shared/sharedConfigs.ts
import type { EntityType } from "../../types/shared";

export type FieldDef = {
  name: string; // key inside data.*
  label: string;
  required?: boolean;
};

export type EntityConfig = {
  type: EntityType;
  title: string;
  fields: FieldDef[]; // used for form + columns
};

export const configs: Record<EntityType, EntityConfig> = {
  cars: {
    type: "cars",
    title: "Voitures",
    fields: [
      { name: "marque", label: "Marque", required: true },
      { name: "modele", label: "Modèle" },
      { name: "immatriculation", label: "Immatriculation", required: true },
    ],
  },
  drivers: {
    type: "drivers",
    title: "Chauffeurs",
    fields: [
      { name: "nom", label: "Nom", required: true },
      { name: "prenom", label: "Prénom" },
      { name: "email", label: "Email" },
      { name: "tel", label: "Téléphone" },
    ],
  },
  users: {
    type: "users",
    title: "Utilisateurs",
    fields: [
      { name: "email", label: "Email", required: true },
      { name: "type", label: "Rôle" }, // e.g., super_admin/admin/user
    ],
  },
  enums: {
    type: "enums",
    title: "GPS / Enums",
    fields: [
      { name: "attr", label: "Attribut", required: true },
      { name: "value", label: "Valeur", required: true },
      { name: "groupId", label: "Groupe ID" },
      { name: "description", label: "Description" },
    ],
  },
};
