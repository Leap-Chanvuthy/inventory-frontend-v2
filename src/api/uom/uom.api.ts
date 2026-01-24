import { BASE_API_URL } from "@/consts/endpoints";
import { GetUOMsResponse, UOMQueryParams, CreateUOMRequest, UOM } from "./uom.types";
import { apiClient } from "@/api/client";

export const getUOMs = async (params?: UOMQueryParams): Promise<GetUOMsResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/uoms`, {
    params,
  });
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
