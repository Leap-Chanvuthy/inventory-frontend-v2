import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRawMaterial, updateRawMaterial } from "./raw-material.api";
import { CreateRawMaterialRequest, UpdateRawMaterialRequest } from "./raw-material.types";
import { toast } from "sonner";

export const useCreateRawMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRawMaterialRequest) => createRawMaterial(payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      toast.success(response.message || "Raw material created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create raw material"
      );
    },
  });
};

export const useUpdateRawMaterial = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<UpdateRawMaterialRequest, "id">) => updateRawMaterial(id, payload),
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      queryClient.invalidateQueries({ queryKey: ["raw-material", id] });
      toast.success(response.message || "Raw material updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update raw material");
    },
  });
};
