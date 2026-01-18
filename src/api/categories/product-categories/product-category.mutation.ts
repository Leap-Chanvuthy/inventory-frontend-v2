import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductCategory,
  updateProductCategory,
} from "./product-category.api";
import { toast } from "sonner";
import { CreateProductCategoryRequest } from "./product-category.types";

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductCategoryRequest) =>
      createProductCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast.success("Category created successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category"
      );
    },
  });
};

export const useUpdateProductCategory = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductCategoryRequest) =>
      updateProductCategory(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["product-category", id],
      });
      toast.success("Category updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update category"
      );
    },
  });
};
