import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "./dashboard.api";
import { DashboardSummaryParams } from "./dashboard.types";

export const useDashboardSummary = (params?: DashboardSummaryParams) => {
  return useQuery({
    queryKey: ["dashboard-summary", params],
    queryFn: () => getDashboardSummary(params),
    placeholderData: keepPreviousData,
  });
};
