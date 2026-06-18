import { useQuery } from "@tanstack/react-query";
import {
  getRawMaterials,
  getRawMaterialById,
  getDeletedRawMaterials,
  getRawMaterialMovements,
  getRawMaterialStockLots,
  getRawMaterialScrapEligibleStockLots,
  previewRawMaterialProductionAllocation,
} from "./raw-material.api";
import { RawMaterialQueryParams, StockMovementsQueryParams } from "./raw-material.types";

const rawMaterialListQueryKey = (scope: string, params?: RawMaterialQueryParams) => [
  scope,
  params?.page,
  params?.per_page,
  params?.["filter[search]"],
  params?.["filter[raw_material_category_id]"],
  params?.["filter[uom_id]"],
  params?.["filter[supplier_id]"],
  params?.["filter[warehouse_id]"],
  params?.sort,
];

// Get all raw materials with pagination and filters
export const useRawMaterials = (params?: RawMaterialQueryParams) => {
  return useQuery({
    queryKey: rawMaterialListQueryKey("raw-materials", params),
    queryFn: () => getRawMaterials(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
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
    queryKey: [
      "raw-material-movements",
      rawMaterialId,
      params?.page,
      params?.per_page,
      params?.sort,
      params?.["filter[movement_type]"],
      params?.["filter[direction]"],
    ],
    queryFn: () => getRawMaterialMovements(rawMaterialId, params),
    enabled: !!rawMaterialId,
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};

export const useRawMaterialStockLots = (
  rawMaterialId: number,
  params?: { include_children?: boolean; include_disabled?: boolean },
) => {
  return useQuery({
    queryKey: [
      "raw-material-stock-lots",
      rawMaterialId,
      params?.include_children,
      params?.include_disabled,
    ],
    queryFn: () => getRawMaterialStockLots(rawMaterialId, params),
    enabled: !!rawMaterialId,
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};

export const useRawMaterialScrapEligibleStockLots = (
  rawMaterialId: number,
  includeDisabled = true,
) => {
  return useQuery({
    queryKey: ["raw-material-scrap-eligible-stock-lots", rawMaterialId, includeDisabled],
    queryFn: () => getRawMaterialScrapEligibleStockLots(rawMaterialId, { include_disabled: includeDisabled }),
    enabled: !!rawMaterialId,
  });
};

export const useRawMaterialProductionAllocationPreview = (
  rawMaterialId: number,
  quantity: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["raw-material-production-allocation-preview", rawMaterialId, quantity],
    queryFn: () => previewRawMaterialProductionAllocation(rawMaterialId, quantity),
    enabled: enabled && rawMaterialId > 0 && quantity > 0,
    staleTime: 0,
  });
};

// Get deleted (soft-deleted) raw materials
export const useDeletedRawMaterials = (params?: RawMaterialQueryParams) => {
  return useQuery({
    queryKey: rawMaterialListQueryKey("raw-materials-deleted", params),
    queryFn: () => getDeletedRawMaterials(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};
