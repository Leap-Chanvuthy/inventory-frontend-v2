import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCompanyInfo, updateAddressInfo, updateTelegramInfo, setupBankingPayment } from "./company.api";
import { toast } from "sonner";
import { UpdateCompanyRequest, UpdateAddressRequest, UpdateTelegramRequest, SetupBankingPaymentRequest } from "./company.type";

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

export const useUpdateAddressInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAddressRequest) => updateAddressInfo(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-info"] });
      toast.success("Address information updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update address information"
      );
    },
  });
};

export const useUpdateTelegramInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTelegramRequest) => updateTelegramInfo(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-info"] });
      toast.success("Telegram notification updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update telegram notification"
      );
    },
  });
};

export const useSetupBankingPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SetupBankingPaymentRequest) => setupBankingPayment(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-info"] });
      toast.success("Banking payment added successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to add banking payment"
      );
    },
  });
};
