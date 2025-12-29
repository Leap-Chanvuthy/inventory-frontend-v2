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



