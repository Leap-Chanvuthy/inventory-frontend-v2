import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRawMaterial } from "./raw-material.api";
import { CreateRawMaterialRequest } from "./raw-material.types";
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
