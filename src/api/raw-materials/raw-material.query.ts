import { useQuery } from "@tanstack/react-query";
import { getRawMaterials, getRawMaterialById } from "./raw-material.api";
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
