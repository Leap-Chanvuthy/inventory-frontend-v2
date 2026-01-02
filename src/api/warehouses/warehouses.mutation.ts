import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createWarehouse,
  updateWarehouse,
  deleteWarehouseImage,
} from "./warehouses.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreateWarehousesPayload } from "./warehouses.types";

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateWarehousesPayload) => createWarehouse(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse created successfully");
      navigate("/warehouses");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create warehouse"
      );
    },
  });
};

export const useUpdateWarehouse = (warehouseId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateWarehousesPayload) =>
      updateWarehouse(warehouseId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse", warehouseId] });
      toast.success("Warehouse updated successfully");
      navigate("/warehouses");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update warehouse"
      );
    },
  });
};

export const useDeleteWarehouseImage = (warehouseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string | number) =>
      deleteWarehouseImage(warehouseId, imageId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse", warehouseId] });
      // toast.success("Image deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete image");
    },
  });
};
