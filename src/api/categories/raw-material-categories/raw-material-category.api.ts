import { BASE_API_URL } from "@/consts/endpoints";
import {
  CategoryResponse,
  CategoryQueryParams,
  RawMaterialCategory,
  CreateCategoryRequest,
} from "./raw-material-category.types";
import { apiClient } from "@/api/client";

// Raw Material Categories
export const getRawMaterialCategories = async (
  params?: CategoryQueryParams
): Promise<CategoryResponse<RawMaterialCategory>> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/raw-material-categories`,
    { params }
  );
  return response.data;
};

export const createRawMaterialCategory = async (
  data: CreateCategoryRequest
): Promise<{ status: boolean; message: string; data: RawMaterialCategory }> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/raw-material-categories`,
    data
  );
  return response.data;
};

export const getRawMaterialCategoryById = async (
  id: number
): Promise<{ status: boolean; message: string; data: RawMaterialCategory }> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/raw-material-categories/${id}`
  );
  return response.data;
};

export const updateRawMaterialCategory = async (
  id: number,
  data: CreateCategoryRequest
): Promise<{ status: boolean; message: string; data: RawMaterialCategory }> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/raw-material-categories/${id}`,
    data
  );
  return response.data;
};
