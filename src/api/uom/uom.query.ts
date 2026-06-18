import { useQuery } from "@tanstack/react-query";
import {
  getUOMs,
  getUOMById,
  getUomCategories,
  getUomCategoryById,
  getTrashedUomCategories,
  getTrashedUOMs,
} from "./uom.api";
import { UOMQueryParams, UomCategoryQueryParams, TrashedCategoryQueryParams, TrashedUOMQueryParams } from "./uom.types";

const uomCategoryQueryKey = (
  scope: string,
  params?: UomCategoryQueryParams | TrashedCategoryQueryParams,
) => [
  scope,
  params?.page,
  params?.per_page,
  params?.["filter[search]"],
  "sort" in (params || {}) ? (params as UomCategoryQueryParams).sort : undefined,
];

const uomListQueryKey = (
  scope: string,
  params?: UOMQueryParams | TrashedUOMQueryParams,
) => [
  scope,
  params?.page,
  params?.per_page,
  "filter[search]" in (params || {}) ? (params as UOMQueryParams)["filter[search]"] : undefined,
  "filter[id]" in (params || {}) ? (params as UOMQueryParams)["filter[id]"] : undefined,
  "filter[is_active]" in (params || {}) ? (params as UOMQueryParams)["filter[is_active]"] : undefined,
  params?.["filter[category_id]"],
  "filter[is_base_unit]" in (params || {}) ? (params as UOMQueryParams)["filter[is_base_unit]"] : undefined,
  "sort" in (params || {}) ? (params as UOMQueryParams).sort : undefined,
];

// ── UOM Category Queries ───────────────────────────────────────────────────

export const useUomCategories = (params?: UomCategoryQueryParams) => {
  return useQuery({
    queryKey: uomCategoryQueryKey("uom-categories", params),
    queryFn: () => getUomCategories(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};

export const useTrashedUomCategories = (params?: TrashedCategoryQueryParams, enabled = true) => {
  return useQuery({
    queryKey: uomCategoryQueryKey("uom-categories-trashed", params),
    queryFn: () => getTrashedUomCategories(params),
    enabled,
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};

export const useSingleUomCategory = (id: number) => {
  return useQuery({
    queryKey: ["uom-category", id],
    queryFn: () => getUomCategoryById(id),
    enabled: !!id,
  });
};

// ── UOM Queries ─────────────────────────────────────────────────────────────

export const useUOMs = (params?: UOMQueryParams) => {
  return useQuery({
    queryKey: uomListQueryKey("uoms", params),
    queryFn: () => getUOMs(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};

export const useSingleUOM = (id: number) => {
  return useQuery({
    queryKey: ["uom", id],
    queryFn: () => getUOMById(id),
    enabled: !!id,
  });
};

export const useTrashedUOMs = (params?: TrashedUOMQueryParams, enabled = true) => {
  return useQuery({
    queryKey: uomListQueryKey("uoms-trashed", params),
    queryFn: () => getTrashedUOMs(params),
    enabled,
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};
