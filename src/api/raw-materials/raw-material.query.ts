import { useQuery } from "@tanstack/react-query";
import { getRawMaterials, getRawMaterialById, getDeletedRawMaterials } from "./raw-material.api";
import { RawMaterialQueryParams } from "./raw-material.types";

// Get all raw materials with pagination and filters
export const useRawMaterials = (params?: RawMaterialQueryParams) => {
  return useQuery({
    queryKey: ["raw-materials", params],
    queryFn: () => getRawMaterials(params),
  });
};

// Get single raw material by ID
export const useSingleRawMaterial = (id: number) => {
  return useQuery({
    queryKey: ["raw-material", id],
    queryFn: () => getRawMaterialById(id),
    enabled: !!id,
  });
};

// Get deleted (soft-deleted) raw materials
export const useDeletedRawMaterials = (params?: RawMaterialQueryParams) => {
  return useQuery({
    queryKey: ["raw-materials-deleted", params],
    queryFn: () => getDeletedRawMaterials(params),
  });
};
