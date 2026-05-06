import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "../client";
import {
  CreateWarehouse,
  CreateWarehousesPayload,
  GetWarehousesParams,
  PaginatedData,
  SubWarehouse,
  SubWarehousePayload,
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

const appendWarehousePayloadToFormData = (
  formData: FormData,
  payload: CreateWarehousesPayload,
) => {
  const primitiveFields: (keyof CreateWarehousesPayload)[] = [
    "warehouse_name",
    "warehouse_manager",
    "warehouse_manager_contact",
    "warehouse_manager_email",
    "warehouse_address",
    "latitude",
    "longitude",
    "warehouse_description",
  ];

  primitiveFields.forEach((field) => {
    const value = payload[field];
    if (value !== null && value !== undefined && value !== "") {
      formData.append(field, value as string);
    }
  });

  if (Array.isArray(payload.images)) {
    payload.images.forEach((file) => {
      formData.append("images[]", file);
    });
  }

  if (Array.isArray(payload.sub_warehouses)) {
    payload.sub_warehouses.forEach((subWarehouse, index) => {
      Object.entries(subWarehouse).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          formData.append(`sub_warehouses[${index}][${key}]`, value);
        }
      });
    });
  }
};

export const createWarehouse = async (
  payload: CreateWarehousesPayload
): Promise<CreateWarehouse> => {
  const formData = new FormData();
  appendWarehousePayloadToFormData(formData, payload);

  const { data } = await apiClient.post(`${BASE_API_URL}/warehouses`, formData, {
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
  appendWarehousePayloadToFormData(formData, payload);

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

export const deleteWarehouseImage = async (
  warehouseId: string | number,
  imageId: string | number
): Promise<void> => {
  await apiClient.delete(
    `${BASE_API_URL}/warehouses/${warehouseId}/images/${imageId}`
  );
};

export const updateSubWarehouse = async (
  warehouseId: string | number,
  subWarehouseId: string | number,
  payload: SubWarehousePayload,
): Promise<SubWarehouse> => {
  const { data } = await apiClient.patch(
    `${BASE_API_URL}/warehouses/${warehouseId}/sub-warehouses/${subWarehouseId}`,
    payload,
  );
  return data.data;
};

export const deleteSubWarehouse = async (
  warehouseId: string | number,
  subWarehouseId: string | number,
): Promise<void> => {
  await apiClient.delete(
    `${BASE_API_URL}/warehouses/${warehouseId}/sub-warehouses/${subWarehouseId}`,
  );
};
