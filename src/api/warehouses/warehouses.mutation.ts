import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
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

// export const useDeleteWarehouse = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: (id: string | number) => deleteWarehouse(id),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["warehouses"] });
//       toast.success("Warehouse deleted successfully");
//       navigate("/warehouses");
//     },
//     onError: (error: any) => {
//       toast.error(
//         error?.response?.data?.message || "Failed to delete warehouse"
//       );
//     },
//   });
// };
