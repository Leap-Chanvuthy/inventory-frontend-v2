import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRawMaterialCategory,
  deleteRawMaterialCategory,
  restoreRawMaterialCategory,
  updateRawMaterialCategory,
} from "./raw-material-category.api";
import { CreateCategoryRequest } from "@/api/categories/types/category.type";
import { toast } from "sonner";

export const useCreateRawMaterialCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      createRawMaterialCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-material-categories"] });
      toast.success("Category created successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category",
      );
    },
  });
};

type UpdateCategoryPayload =
  | CreateCategoryRequest
  | { id: number; payload: CreateCategoryRequest };

export const useUpdateRawMaterialCategory = (categoryId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCategoryPayload) => {
      if ("id" in payload) {
        return updateRawMaterialCategory(payload.id, payload.payload);
      }

      if (!categoryId) {
        throw new Error("Category id is required for update");
      }

      return updateRawMaterialCategory(categoryId, payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-material-categories"] });
      toast.success("Category updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update category",
      );
    },
  });
};

export const useDeleteRawMaterialCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => deleteRawMaterialCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-material-categories"] });
      toast.success("Category deleted successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete category",
      );
    },
  });
};

export const useRestoreRawMaterialCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => restoreRawMaterialCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-material-categories"] });
      toast.success("Category restored successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to restore category",
      );
    },
  });
};
