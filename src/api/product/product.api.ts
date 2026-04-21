import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "@/api/client";
import {
  GetProductsResponse,
  GetProductResponse,
  ProductQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  CreateExternalPurchaseRequest,
  CreateInternalManufacturingRequest,
} from "./product.type";

export const getProducts = async (
  params?: ProductQueryParams
): Promise<GetProductsResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/products`, { params });
  return response.data;
};

export const getProductById = async (
  id: number
): Promise<GetProductResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: CreateProductRequest
): Promise<GetProductResponse> => {
  const response = await apiClient.post(`${BASE_API_URL}/products`, data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductRequest
): Promise<GetProductResponse> => {
  const response = await apiClient.patch(`${BASE_API_URL}/products/${id}`, data);
  return response.data;
};

export const createExternalPurchase = async (
  data: CreateExternalPurchaseRequest
): Promise<GetProductResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/products/create/external-purchase`,
    data,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const createInternalManufacturing = async (
  data: CreateInternalManufacturingRequest
): Promise<GetProductResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/products/create/internal-manufacturing`,
    data,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const deleteProduct = async (
  id: number
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.delete(`${BASE_API_URL}/products/${id}`);
  return response.data;
};

export const getTrashedProducts = async (
  params?: ProductQueryParams
): Promise<GetProductsResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/products/trashed`, { params });
  return response.data;
};

export const recoverProduct = async (
  id: number
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.patch(`${BASE_API_URL}/products/${id}/restore`);
  return response.data;
};

export const updateExternalPurchase = async (
  id: number,
  data: CreateExternalPurchaseRequest
): Promise<GetProductResponse> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/products/${id}/update/external-purchase`,
    data,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const updateInternalManufacturing = async (
  id: number,
  data: CreateInternalManufacturingRequest
): Promise<GetProductResponse> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/products/${id}/update/internal-manufacturing`,
    data,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};
