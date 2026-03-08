import { BASE_API_URL } from "@/consts/endpoints";
import {
  GetUOMsResponse,
  UOMQueryParams,
  TrashedUOMQueryParams,
  CreateUOMRequest,
  UOM,
  UomCategory,
  GetUomCategoriesResponse,
  UomCategoryQueryParams,
  TrashedCategoryQueryParams,
  CreateUomCategoryRequest,
} from "./uom.types";
import { apiClient } from "@/api/client";

// ── UOM Category ───────────────────────────────────────────────────────

export const getUomCategories = async (
  params?: UomCategoryQueryParams
): Promise<GetUomCategoriesResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/uom-categories`, { params });
  // ResponseHelper wraps as { status, message, data: PaginatedData } — unwrap here
  return response.data?.data ?? response.data;
};

/** Fetch only soft-deleted categories (for the restore workflow). */
export const getTrashedUomCategories = async (
  params?: TrashedCategoryQueryParams
): Promise<GetUomCategoriesResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/uom-categories/trashed`, { params });
  return response.data?.data ?? response.data;
};

export const getUomCategoryById = async (
  id: number
): Promise<{ status: boolean; message: string; data: UomCategory }> => {
  const response = await apiClient.get(`${BASE_API_URL}/uom-categories/${id}`);
  return response.data;
};

export const createUomCategory = async (
  data: CreateUomCategoryRequest
): Promise<{ status: boolean; message: string; data: UomCategory }> => {
  const response = await apiClient.post(`${BASE_API_URL}/uom-categories`, data);
  return response.data;
};

export const updateUomCategory = async (
  id: number,
  data: CreateUomCategoryRequest
): Promise<{ status: boolean; message: string; data: UomCategory }> => {
  const response = await apiClient.patch(`${BASE_API_URL}/uom-categories/${id}`, data);
  return response.data;
};

export const deleteUomCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`${BASE_API_URL}/uom-categories/${id}`);
};

/** Restore a soft-deleted category. */
export const restoreUomCategory = async (
  id: number
): Promise<{ status: boolean; message: string; data: UomCategory }> => {
  const response = await apiClient.patch(`${BASE_API_URL}/uom-categories/${id}/restore`);
  return response.data;
};

// ── Unit of Measurement ───────────────────────────────────────────────────────

export const getUOMs = async (params?: UOMQueryParams): Promise<GetUOMsResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/uoms`, { params });
  return response.data;
};

export const createUOM = async (
  data: CreateUOMRequest
): Promise<{ status: boolean; message: string; data: UOM }> => {
  const response = await apiClient.post(`${BASE_API_URL}/uoms`, data);
  return response.data;
};

export const getUOMById = async (
  id: number
): Promise<{ status: boolean; message: string; data: UOM }> => {
  const response = await apiClient.get(`${BASE_API_URL}/uoms/${id}`);
  return response.data;
};

export const updateUOM = async (
  id: number,
  data: CreateUOMRequest
): Promise<{ status: boolean; message: string; data: UOM }> => {
  const response = await apiClient.patch(`${BASE_API_URL}/uoms/${id}`, data);
  return response.data;
};

export const deleteUOM = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${BASE_API_URL}/uoms/${id}`);
};

/** Restore a soft-deleted UOM. */
export const restoreUOM = async (
  id: number
): Promise<{ status: boolean; message: string; data: UOM }> => {
  const response = await apiClient.patch(`${BASE_API_URL}/uoms/${id}/restore`);
  return response.data;
};

/** Fetch paginated soft-deleted UOMs. */
export const getTrashedUOMs = async (
  params?: TrashedUOMQueryParams
): Promise<GetUOMsResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/uoms/trashed`, { params });
  return response.data?.data ?? response.data;
};
