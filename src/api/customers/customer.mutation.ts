import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer, updateCustomer, deleteCustomer } from "./customer.api";
import {
  CreateCustomerRequest,
  CreateCustomerFormPayload,
} from "./customer.types";
import { toast } from "sonner";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCustomerFormPayload) => createCustomer(payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(response.message || "Customer created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create customer");
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreateCustomerFormPayload | Partial<CreateCustomerRequest>;
    }) => updateCustomer(id, data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(response.message || "Customer updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update customer");
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string | number) => deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete customer",
      );
    },
  });
};
