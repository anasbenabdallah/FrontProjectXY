import api from "./api";
import type { StatsOverview } from "../types/stats";

export async function getStatsOverview() {
  const { data } = await api.get<StatsOverview>("/stats/overview");
  return data;
}
