import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRawMaterialCategory,
  deleteRawMaterialCategory,
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
        error?.response?.data?.message || "Failed to create category"
      );
    },
  });
};

export const useUpdateRawMaterialCategory = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      updateRawMaterialCategory(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-material-categories"] });
      queryClient.invalidateQueries({
        queryKey: ["raw-material-category", id],
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


export const useDeleteRawMaterialCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => 
    
    deleteRawMaterialCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-material-categories"] });
      toast.success("Category deleted successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete category"
      );
    },
  });
}