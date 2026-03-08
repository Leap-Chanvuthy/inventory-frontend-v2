import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUOM,
  updateUOM,
  deleteUOM,
  restoreUOM,
  createUomCategory,
  updateUomCategory,
  deleteUomCategory,
  restoreUomCategory,
} from "./uom.api";
import { toast } from "sonner";
import { CreateUOMRequest, CreateUomCategoryRequest } from "./uom.types";

// ── UOM Category Mutations ───────────────────────────────────────────────────

export const useCreateUomCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUomCategoryRequest) => createUomCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uom-categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      const hasFieldErrors =
        error?.response?.data?.errors &&
        Object.keys(error.response.data.errors).length > 0;
      if (!hasFieldErrors) {
        toast.error(error?.response?.data?.message || "Failed to create category");
      }
    },
  });
};

export const useUpdateUomCategory = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUomCategoryRequest) => updateUomCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uom-categories"] });
      queryClient.invalidateQueries({ queryKey: ["uom-category", id] });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update category");
    },
  });
};

export const useDeleteUomCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUomCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uom-categories"] });
      toast.success("Category archived. You can restore it from the deleted list.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to archive category");
    },
  });
};

export const useRestoreUomCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => restoreUomCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uom-categories"] });
      queryClient.invalidateQueries({ queryKey: ["uom-categories-trashed"] });
      toast.success("Category restored successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to restore category");
    },
  });
};

// ── UOM Mutations ─────────────────────────────────────────────────────────────

export const useCreateUOM = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUOMRequest) => createUOM(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["uoms"] });
      const code = result?.data?.uom_code;
      toast.success(
        code ? `Unit created — Code: ${code}` : "UOM created successfully"
      );
    },
    onError: (error: any) => {
      const hasFieldErrors =
        error?.response?.data?.errors &&
        Object.keys(error.response.data.errors).length > 0;
      if (!hasFieldErrors) {
        toast.error(error?.response?.data?.message || "Failed to create UOM");
      }
    },
  });
};

export const useUpdateUOM = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUOMRequest) => updateUOM(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uoms"] });
      queryClient.invalidateQueries({ queryKey: ["uom", id] });
      toast.success("UOM updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update UOM");
    },
  });
};

export const useDeleteUOM = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUOM(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uoms"] });
      queryClient.invalidateQueries({ queryKey: ["uoms-trashed"] });
      toast.success("UOM archived. You can restore it later.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to archive UOM");
    },
  });
};

export const useRestoreUOM = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => restoreUOM(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uoms"] });
      queryClient.invalidateQueries({ queryKey: ["uoms-trashed"] });
      toast.success("UOM restored successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to restore UOM");
    },
  });
};
