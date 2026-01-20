import { useQuery } from "@tanstack/react-query";
import { getCompanyInfo } from "./company.api";

export const useCompanyInfo = () => {
  return useQuery({
    queryKey: ["company-info"],
    queryFn: () => getCompanyInfo(),
  });
};
