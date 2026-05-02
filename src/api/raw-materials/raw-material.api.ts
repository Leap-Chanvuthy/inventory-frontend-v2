import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "@/api/client";
import {
  GetRawMaterialsResponse,
  GetRawMaterialResponse,
  RawMaterialQueryParams,
  CreateRawMaterialRequest,
  CreateRawMaterialResponse,
  UpdateRawMaterialRequest,
  ReorderRawMaterialPayload,
  ReorderRawMaterialResponse,
  StockMovementsQueryParams,
  PaginatedStockMovementsResponse,
} from "./raw-material.types";

// Get all raw materials with pagination and filters
export const getRawMaterials = async (
  params?: RawMaterialQueryParams,
): Promise<GetRawMaterialsResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/raw-materials`, {
    params,
  });
  return response.data;
};

// Get single raw material by ID
export const getRawMaterialById = async (
  id: number,
): Promise<GetRawMaterialResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/raw-materials/${id}`);
  return response.data;
};

// Create new raw material
export const createRawMaterial = async (
  data: CreateRawMaterialRequest,
): Promise<CreateRawMaterialResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/raw-materials/create`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

// Update raw material
export const updateRawMaterial = async (
  id: number,
  data: UpdateRawMaterialRequest,
): Promise<CreateRawMaterialResponse> => {
  const { images, ...fields } = data;
  const hasImages = images && images.length > 0;

  if (!hasImages) {
    // No files — regular JSON PATCH
    const response = await apiClient.patch(
      `${BASE_API_URL}/raw-materials/${id}`,
      fields,
    );
    return response.data;
  }

  // PHP cannot parse multipart/form-data on PATCH requests.
  // Use POST + _method=PATCH (Laravel method spoofing) for file uploads.
  const formData = new FormData();
  formData.append("_method", "PATCH");
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }
  images.forEach(img => formData.append("images[]", img));

  const response = await apiClient.post(
    `${BASE_API_URL}/raw-materials/${id}`,
    formData,
  );
  return response.data;
};

// Reorder raw material stock
export const reorderRawMaterial = async (
  rawMaterialId: number,
  data: ReorderRawMaterialPayload,
): Promise<ReorderRawMaterialResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/raw-materials/${rawMaterialId}/reorder`,
    data,
  );
  return response.data;
};

export const updateReorderRawMaterial = async (
  rawMaterialId: number,
  movementId: number,
  data: ReorderRawMaterialPayload,
): Promise<ReorderRawMaterialResponse> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/raw-materials/${rawMaterialId}/reorder/${movementId}`,
    data,
  );
  return response.data;
};

// Get paginated stock movements for a raw material
export const getRawMaterialMovements = async (
  rawMaterialId: number,
  params?: StockMovementsQueryParams,
): Promise<PaginatedStockMovementsResponse> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/raw-materials/${rawMaterialId}/movements`,
    { params },
  );
  return response.data;
};

// Get deleted (soft-deleted) raw materials
export const getDeletedRawMaterials = async (
  params?: RawMaterialQueryParams,
): Promise<GetRawMaterialsResponse> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/raw-materials/deleted`,
    {
      params,
    },
  );
  return response.data;
};

// Recover (restore) a soft-deleted raw material
export const recoverRawMaterial = async (
  id: number,
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/raw-materials/${id}/recover`,
  );
  return response.data;
};

// Delete raw material
export const deleteRawMaterial = async (
  id: number,
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.delete(
    `${BASE_API_URL}/raw-materials/${id}`,
  );
  return response.data;
};

export const deleteRawMaterialImages = async (
  rawMaterialId: number,
  imageIds: number[],
): Promise<{
  status: boolean;
  message: string;
  data: { deleted_image_ids: number[]; deleted_count: number };
}> => {
  const response = await apiClient.delete(
    `${BASE_API_URL}/raw-materials/${rawMaterialId}/images`,
    {
      data: {
        image_ids: imageIds,
      },
    },
  );

  return response.data;
};
