import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getRawMaterials,
  getRawMaterialById,
  getDeletedRawMaterials,
  getRawMaterialMovements,
} from "./raw-material.api";
import { RawMaterialQueryParams, StockMovementsQueryParams } from "./raw-material.types";

// Get all raw materials with pagination and filters
export const useRawMaterials = (params?: RawMaterialQueryParams) => {
  const normalizedParams = params ? { ...params } : {};
  return useQuery({
    queryKey: ["raw-materials", normalizedParams],
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

// Get paginated stock movements for a raw material
export const useRawMaterialMovements = (
  rawMaterialId: number,
  params?: StockMovementsQueryParams
) => {
  return useQuery({
    queryKey: ["raw-material-movements", rawMaterialId, params],
    queryFn: () => getRawMaterialMovements(rawMaterialId, params),
    enabled: !!rawMaterialId,
    placeholderData: keepPreviousData,
  });
};

// Get deleted (soft-deleted) raw materials
export const useDeletedRawMaterials = (params?: RawMaterialQueryParams) => {
  const normalizedParams = params ? { ...params } : {};
  return useQuery({
    queryKey: ["raw-materials-deleted", normalizedParams],
    queryFn: () => getDeletedRawMaterials(params),
    placeholderData: keepPreviousData,
  });
};
