import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCompanyInfo } from "./company.api";
import { toast } from "sonner";
import { UpdateCompanyRequest } from "./company.type";

export const useUpdateCompanyInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCompanyRequest) => updateCompanyInfo(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-info"] });
      toast.success("Company information updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update company information"
      );
    },
  });
};
