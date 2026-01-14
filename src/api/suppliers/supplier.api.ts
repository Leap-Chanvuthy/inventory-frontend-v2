import { BASE_API_URL } from "@/consts/endpoints";
import {
  GetSuppliersResponse,
  GetSupplierResponse,
  SupplierQueryParams,
  CreateSupplierRequest,
  CreateSupplierFormPayload,
  GetImportHistoriesResponse,
  ImportHistoryQueryParams,
} from "./supplier.types";
import { apiClient } from "@/api/client";

// Get all suppliers with pagination and filters
export const getSuppliers = async (
  params?: SupplierQueryParams
): Promise<GetSuppliersResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/suppliers`, {
    params,
  });
  return response.data;
};

// Get single supplier by ID
export const getSupplierById = async (
  id: number
): Promise<GetSupplierResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/suppliers/${id}`);
  return response.data;
};

// Create new supplier
export const createSupplier = async (
  data: CreateSupplierFormPayload | CreateSupplierRequest
): Promise<GetSupplierResponse> => {
  const response = await apiClient.post(`${BASE_API_URL}/suppliers`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update existing supplier
export const updateSupplier = async (
  id: number,
  data: CreateSupplierFormPayload | Partial<CreateSupplierRequest>
): Promise<GetSupplierResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/suppliers/${id}`,
    { ...data, _method: "PATCH" },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Delete supplier
export const deleteSupplier = async (
  id: number
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.delete(`${BASE_API_URL}/suppliers/${id}`);
  return response.data;
};

// Import suppliers from Excel/CSV
export const importSuppliers = async (
  file: File | null
): Promise<{ status: boolean; message: string }> => {
  const formData = new FormData();
  if (file) {
    formData.append("supplier_file", file);
  }

  const response = await apiClient.post(
    `${BASE_API_URL}/suppliers/import`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Get import histories with pagination and filters
export const getImportHistories = async (
  params?: ImportHistoryQueryParams
): Promise<GetImportHistoriesResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/suppliers/import-histories`, {
    params,
  });
  return response.data;
};
