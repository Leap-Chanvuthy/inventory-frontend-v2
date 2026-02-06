import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "@/api/client";
import {
  GetRawMaterialsResponse,
  GetRawMaterialResponse,
  RawMaterialQueryParams,
  CreateRawMaterialRequest,
  CreateRawMaterialResponse,
} from "./raw-material.types";

// Get all raw materials with pagination and filters
export const getRawMaterials = async (
  params?: RawMaterialQueryParams
): Promise<GetRawMaterialsResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/raw-materials`, {
    params,
  });
  return response.data;
};

// Get single raw material by ID
export const getRawMaterialById = async (
  id: number
): Promise<GetRawMaterialResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/raw-materials/${id}`);
  return response.data;
};

// Create new raw material
export const createRawMaterial = async (
  data: CreateRawMaterialRequest
): Promise<CreateRawMaterialResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/raw-materials/create`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Update raw material
export const updateRawMaterial = async (
  id: number,
  data: FormData
): Promise<CreateRawMaterialResponse> => {
  const response = await apiClient.post(`${BASE_API_URL}/raw-materials/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      _method: "PATCH",
    }
  });
  return response.data;
};

export const deleteRawMaterialImages = async (
  rawMaterialId: number,
  imageIds: number[]
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
    }
  );

  return response.data;
};
