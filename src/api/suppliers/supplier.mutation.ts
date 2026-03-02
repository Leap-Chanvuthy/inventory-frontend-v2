import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSupplier,
  updateSupplier,
  deleteSupplier,
  importSuppliers,
  recoverSupplier,
} from "./supplier.api";
import {
  CreateSupplierRequest,
  CreateSupplierFormPayload,
} from "./supplier.types";
import { toast } from "sonner";

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSupplierFormPayload) => createSupplier(payload),
    onSuccess: response => {
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
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreateSupplierFormPayload | Partial<CreateSupplierRequest>;
    }) => updateSupplier(id, data),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success(response.message || "Supplier updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update supplier");
    },
  });
};

// export const useDeleteSupplier = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: number) => deleteSupplier(id),
//     onSuccess: response => {
//       queryClient.invalidateQueries({ queryKey: ["suppliers"] });
//       toast.success(response.message || "Supplier deleted successfully");
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || "Failed to delete supplier");
//     },
//   });
// };


export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (supplierId: string | number) =>
      deleteSupplier(supplierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete supplier"
      );
    },
  });
};

export const useImportSuppliers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File | null) => importSuppliers(file),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success(response.message || "Suppliers imported successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to import suppliers"
      );
    },
  });
};

export const useRecoverSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => recoverSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers-deleted"] });
      toast.success("Supplier recovered successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to recover supplier");
    },
  });
};
