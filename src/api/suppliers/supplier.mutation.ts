import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupplier, updateSupplier, deleteSupplier } from "./supplier.api";
import { CreateSupplierRequest } from "./supplier.types";
import { toast } from "sonner";

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createSupplier(data as any),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success(response.message || "Supplier created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create supplier");
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSupplierRequest> }) =>
      updateSupplier(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success(response.message || "Supplier updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update supplier");
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSupplier(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success(response.message || "Supplier deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete supplier");
    },
  });
};
