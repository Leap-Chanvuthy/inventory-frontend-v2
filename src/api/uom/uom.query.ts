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

// ── UOM Category Queries ───────────────────────────────────────────────────

export const useUomCategories = (params?: UomCategoryQueryParams) => {
  return useQuery({
    queryKey: ["uom-categories", params],
    queryFn: () => getUomCategories(params),
  });
};

export const useTrashedUomCategories = (params?: TrashedCategoryQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ["uom-categories-trashed", params],
    queryFn: () => getTrashedUomCategories(params),
    enabled,
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
    queryKey: ["uoms", params],
    queryFn: () => getUOMs(params),
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
    queryKey: ["uoms-trashed", params],
    queryFn: () => getTrashedUOMs(params),
    enabled,
  });
};
