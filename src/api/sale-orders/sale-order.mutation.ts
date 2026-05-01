import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addSaleOrderPayment,
  createSaleOrder,
  deleteSaleOrder,
  refundSaleOrder,
  updateSaleOrderLatestInstallment,
  updateSaleOrder,
  updateSaleOrderStatus,
} from "./sale-order.api";
import {
  AddSaleOrderPaymentPayload,
  CreateSaleOrderPayload,
  RefundSaleOrderPayload,
  UpdateLatestInstallmentPayload,
  UpdateSaleOrderPayload,
  UpdateSaleOrderStatusPayload,
} from "./sale-order.types";
import { showApiErrorToast } from "@/components/reusable/partials/api-error-response-toast";

export const useCreateSaleOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSaleOrderPayload) => createSaleOrder(payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["sale-orders"] });
      toast.success(response.message || "Sale order created successfully");
    },
    onError: (error: unknown) => {
      showApiErrorToast(error, "Failed to create sale order");
    },
  });
};

export const useUpdateSaleOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSaleOrderPayload }) =>
      updateSaleOrder(id, payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["sale-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sale-order"] });
      toast.success(response.message || "Sale order updated successfully");
    },
    onError: (error: unknown) => {
      showApiErrorToast(error, "Failed to update sale order");
    },
  });
};

export const useUpdateSaleOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSaleOrderStatusPayload }) =>
      updateSaleOrderStatus(id, payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["sale-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sale-order"] });
      toast.success(response.message || "Sale order status updated successfully");
    },
    onError: (error: unknown) => {
      showApiErrorToast(error, "Failed to update sale order status");
    },
  });
};

export const useRefundSaleOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RefundSaleOrderPayload }) =>
      refundSaleOrder(id, payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["sale-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sale-order"] });
      queryClient.invalidateQueries({ queryKey: ["sale-order-refunds"] });
      toast.success(response.message || "Refund processed successfully");
    },
    onError: (error: unknown) => {
      showApiErrorToast(error, "Failed to process refund");
    },
  });
};

export const useAddSaleOrderPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AddSaleOrderPaymentPayload }) =>
      addSaleOrderPayment(id, payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["sale-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sale-order"] });
      toast.success(response.message || "Installment recorded successfully");
    },
    onError: (error: unknown) => {
      showApiErrorToast(error, "Failed to record installment");
    },
  });
};

export const useUpdateLatestSaleOrderInstallment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateLatestInstallmentPayload }) =>
      updateSaleOrderLatestInstallment(id, payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["sale-orders"] });
      queryClient.invalidateQueries({ queryKey: ["sale-order"] });
      toast.success(response.message || "Latest installment updated successfully");
    },
    onError: (error: unknown) => {
      showApiErrorToast(error, "Failed to update latest installment");
    },
  });
};

export const useDeleteSaleOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSaleOrder(id),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["sale-orders"] });
      toast.success(response.message || "Sale order deleted successfully");
    },
    onError: (error: unknown) => {
      showApiErrorToast(error, "Failed to delete sale order");
    },
  });
};
