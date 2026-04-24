import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductCategory,
  deleteProductCategory,
  updateProductCategory,
} from "./product-category.api";
import { toast } from "sonner";
import { CreateCategoryRequest } from "@/api/categories/types/category.type";

type UpdateProductCategoryPayload =
  | CreateCategoryRequest
  | { id: number; payload: CreateCategoryRequest };

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createProductCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Category created successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category",
      );
    },
  });
};

export const useUpdateProductCategory = (categoryId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductCategoryPayload) => {
      if ("id" in data) {
        return updateProductCategory(data.id, data.payload);
      }
      if (!categoryId) throw new Error("Category id is required for update");
      return updateProductCategory(categoryId, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Category updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update category",
      );
    },
  });
};

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteProductCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Category deleted successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete category",
      );
    },
  });
};
