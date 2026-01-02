import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "../client";
import {
  CreateWarehouse,
  CreateWarehousesPayload,
  GetWarehousesParams,
  PaginatedData,
  Warehouse,
} from "./warehouses.types";

export const getWarehouses = async (
  params: GetWarehousesParams
): Promise<PaginatedData<Warehouse>> => {
  const { data } = await apiClient.get(`${BASE_API_URL}/warehouses`, {
    params,
  });
  return data.data;
};

export const getWarehouse = async (id: string | number): Promise<Warehouse> => {
  const { data } = await apiClient.get(`${BASE_API_URL}/warehouses/${id}`);
  return data.data;
};

export const createWarehouse = async (
  payload: CreateWarehousesPayload
): Promise<CreateWarehouse> => {
  const { data } = await apiClient.post(`${BASE_API_URL}/warehouses`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updateWarehouse = async (
  id: string | number,
  payload: CreateWarehousesPayload
): Promise<CreateWarehouse> => {

  const formData = new FormData();

  // Add _method field to emulate PATCH request
  formData.append("_method", "PATCH");



  Object.entries(payload).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      value.forEach(file => {
        formData.append("images[]", file);
      });
    } else if (value !== null && value !== undefined) {
      formData.append(key, value as string | Blob);
    }
  });

  const { data } = await apiClient.post(
    `${BASE_API_URL}/warehouses/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const deleteWarehouse = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${BASE_API_URL}/warehouses/${id}`);
};
