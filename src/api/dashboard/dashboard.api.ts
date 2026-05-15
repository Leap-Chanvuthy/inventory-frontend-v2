import { apiClient } from "@/api/client";
import { BASE_API_URL } from "@/consts/endpoints";
import { DashboardSummaryParams, DashboardSummaryResponse } from "./dashboard.types";

export const getDashboardSummary = async (
  params?: DashboardSummaryParams,
): Promise<DashboardSummaryResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/v2/inventory-dashboard/summary`, {
    params,
  });
  return response.data;
};
