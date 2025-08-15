import api from "./api";

export type DashboardStats = {
  totalVehicles: number;
  vehiclesInUse: number;
  activeDrivers: number;
  ongoingAssignments: number;
  availableVehicles?: number;
};

export async function fetchDashboardStats() {
  const { data } = await api.get<DashboardStats>("/dashboard/stats");
  return data;
}
