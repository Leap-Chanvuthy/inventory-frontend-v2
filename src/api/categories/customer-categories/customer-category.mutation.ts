import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCustomerCategory,
  deleteCustomerCategory,
  restoreCustomerCategory,
  updateCustomerCategory,
} from "./customer-category.api";
import { toast } from "sonner";
import { CreateCustomerCategoryRequest } from "@/api/categories/types/category.type";

export const useCreateCustomerCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerCategoryRequest) =>
      createCustomerCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
      toast.success("Category created successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category"
      );
    },
  });
};

// export const useUpdateCustomerCategory = (id: number) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: CreateCustomerCategoryRequest) =>
//       updateCustomerCategory(id, data),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
//       queryClient.invalidateQueries({
//         queryKey: ["customer-category", id],
//       });
//       toast.success("Category updated successfully");
//     },

//     onError: (error: any) => {
//       toast.error(
//         error?.response?.data?.message || "Failed to update category"
//       );
//     },
//   });
// };

type UpdateCategoryPayload =
  | CreateCustomerCategoryRequest
  | { id: number; payload: CreateCustomerCategoryRequest };

export const useUpdateCustomerCategory = (categoryId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCategoryPayload) => {
      if ("id" in payload) {
        return updateCustomerCategory(payload.id, payload.payload);
      }

      if (!categoryId) {
        throw new Error("Category id is required for update");
      }

      return updateCustomerCategory(categoryId, payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
      toast.success("Category updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update category",
      );
    },
  });
};



export const useDeleteCustomerCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => 
      deleteCustomerCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
      toast.success("Category deleted successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete category"
      );
    },
  });
}


export const useRestoreCustomerCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => restoreCustomerCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
      toast.success("Category restored successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to restore category",
      );
    },
  });
};
