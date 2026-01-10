import { useQuery } from "@tanstack/react-query";
import { getSuppliers, getSupplierById } from "./supplier.api";
import { SupplierQueryParams } from "./supplier.types";

// Get all suppliers with pagination and filters
export const useSuppliers = (params?: SupplierQueryParams) => {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
  });
};

// Get single supplier by ID
export const useSingleSupplier = (id: number) => {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: () => getSupplierById(id),
    enabled: !!id,
  });
};
