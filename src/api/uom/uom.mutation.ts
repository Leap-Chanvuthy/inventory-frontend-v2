import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUOM, updateUOM, deleteUOM } from "./uom.api";
import { toast } from "sonner";
import { CreateUOMRequest } from "./uom.types";

export const useCreateUOM = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUOMRequest) => createUOM(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uoms"] });
      toast.success("UOM created successfully");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create UOM");
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
    mutationFn: (id: string | number) => deleteUOM(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uoms"] });
      toast.success("UOM deleted successfully");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete UOM");
    },
  });
};
