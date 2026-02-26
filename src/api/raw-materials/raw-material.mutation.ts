import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  deleteRawMaterialImages,
  reorderRawMaterial,
  updateReorderRawMaterial,
  recoverRawMaterial,
} from "./raw-material.api";
import {
  CreateRawMaterialRequest,
  UpdateRawMaterialRequest,
  ReorderRawMaterialPayload,
} from "./raw-material.types";
import { toast } from "sonner";

export const useCreateRawMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRawMaterialRequest) =>
      createRawMaterial(payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      toast.success(response.message || "Raw material created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create raw material",
      );
    },
  });
};

export const useUpdateRawMaterial = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRawMaterialRequest) => updateRawMaterial(id, payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      queryClient.invalidateQueries({ queryKey: ["raw-material", id] });
      toast.success(response.message || "Raw material updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update raw material",
      );
    },
  });
};

export const useReorderRawMaterial = (rawMaterialId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderRawMaterialPayload) =>
      reorderRawMaterial(rawMaterialId, payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      queryClient.invalidateQueries({
        queryKey: ["raw-material", rawMaterialId],
      });
      toast.success(response.message || "Raw material reordered successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to reorder raw material",
      );
    },
  });
};

export const useUpdateReorderRawMaterial = (
  rawMaterialId: number,
  movementId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReorderRawMaterialPayload) =>
      updateReorderRawMaterial(rawMaterialId, movementId, payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      queryClient.invalidateQueries({
        queryKey: ["raw-material", rawMaterialId],
      });
      toast.success(response.message || "Reorder updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update reorder");
    },
  });
};

export const useDeleteRawMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRawMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      toast.success("Raw material deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete raw material",
      );
    },
  });
};

export const useRecoverRawMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => recoverRawMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      queryClient.invalidateQueries({ queryKey: ["raw-materials-deleted"] });
      toast.success("Raw material recovered successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to recover raw material",
      );
    },
  });
};

export const useDeleteRawMaterialImages = (rawMaterialId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageIds: number[]) =>
      deleteRawMaterialImages(rawMaterialId, imageIds),
    onSuccess: response => {
      queryClient.invalidateQueries({
        queryKey: ["raw-material", rawMaterialId],
      });
      toast.success(response.message || "Image(s) deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete image(s)");
    },
  });
};
