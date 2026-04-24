import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "@/api/client";
import {
  GetProductsResponse,
  GetProductResponse,
  ProductQueryParams,
  ProductMovementQueryParams,
  GetProductMovementsResponse,
  CreateProductRequest,
  UpdateProductRequest,
  CreateExternalPurchaseRequest,
  CreateInternalManufacturingRequest,
  ReorderExternalPurchasePayload,
  ReorderInternalManufacturingPayload,
  CreateScrapMovementPayload,
  UpdateScrapMovementPayload,
  ScrapMovementResponse,
  ScrapMovementMutationResponse,
  GetMovementDetailResponse,
} from "./product.type";

export const getProducts = async (
  params?: ProductQueryParams,
): Promise<GetProductsResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/products`, { params });
  return response.data;
};

export const getProductById = async (
  id: number,
): Promise<GetProductResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/products/${id}`);
  return response.data;
};

export const getProductMovements = async (
  id: number,
  params?: ProductMovementQueryParams,
): Promise<GetProductMovementsResponse> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/products/${id}/movements`,
    { params },
  );
  return response.data;
};

export const createProduct = async (
  data: CreateProductRequest,
): Promise<GetProductResponse> => {
  const response = await apiClient.post(`${BASE_API_URL}/products`, data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductRequest,
): Promise<GetProductResponse> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/products/${id}`,
    data,
  );
  return response.data;
};

export const createExternalPurchase = async (
  data: CreateExternalPurchaseRequest,
): Promise<GetProductResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/products/create/external-purchase`,
    data,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const createInternalManufacturing = async (
  data: CreateInternalManufacturingRequest,
): Promise<GetProductResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/products/create/internal-manufacturing`,
    data,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const deleteProduct = async (
  id: number,
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.delete(`${BASE_API_URL}/products/${id}`);
  return response.data;
};

export const getTrashedProducts = async (
  params?: ProductQueryParams,
): Promise<GetProductsResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/products/trashed`, {
    params,
  });
  return response.data;
};

export const recoverProduct = async (
  id: number,
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/products/${id}/restore`,
  );
  return response.data;
};

export const updateExternalPurchase = async (
  id: number,
  data: CreateExternalPurchaseRequest,
): Promise<GetProductResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/products/${id}/update/external-purchase`,
    data,
    { params: { _method: "PATCH" } },
  );
  return response.data;
};

export const updateInternalManufacturing = async (
  id: number,
  data: CreateInternalManufacturingRequest,
): Promise<GetProductResponse> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/products/${id}/update/internal-manufacturing`,
    data,
  );
  return response.data;
};

export const reorderExternalPurchase = async (
  productId: number,
  data: ReorderExternalPurchasePayload,
): Promise<GetProductResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/products/${productId}/reorder/external-purchase`,
    data,
  );
  return response.data;
};

export const reorderInternalManufacturing = async (
  productId: number,
  data: ReorderInternalManufacturingPayload,
): Promise<GetProductResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/products/${productId}/reorder/internal-manufacturing`,
    data,
  );
  return response.data;
};

export const getExternalReorderMovement = async (
  productId: number,
  movementId: number,
): Promise<GetMovementDetailResponse> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/products/${productId}/reorder/external-purchase/${movementId}`,
  );
  return response.data;
};

export const getInternalReorderMovement = async (
  productId: number,
  movementId: number,
): Promise<GetMovementDetailResponse> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/products/${productId}/reorder/internal-manufacturing/${movementId}`,
  );
  return response.data;
};

export const updateExternalReorderMovement = async (
  productId: number,
  movementId: number,
  data: ReorderExternalPurchasePayload,
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/products/${productId}/reorder/external-purchase/${movementId}`,
    data,
  );
  return response.data;
};

export const updateInternalReorderMovement = async (
  productId: number,
  movementId: number,
  data: ReorderInternalManufacturingPayload,
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/products/${productId}/reorder/internal-manufacturing/${movementId}`,
    data,
  );
  return response.data;
};

export const deleteExternalReorderMovement = async (
  productId: number,
  movementId: number,
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.delete(
    `${BASE_API_URL}/products/${productId}/reorder/external-purchase/${movementId}`,
  );
  return response.data;
};

export const deleteInternalReorderMovement = async (
  productId: number,
  movementId: number,
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.delete(
    `${BASE_API_URL}/products/${productId}/reorder/internal-manufacturing/${movementId}`,
  );
  return response.data;
};

export const createScrapMovement = async (
  productId: number,
  data: CreateScrapMovementPayload,
): Promise<ScrapMovementResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/products/${productId}/scrap`,
    data,
  );
  return response.data;
};

export const updateScrapMovement = async (
  productId: number,
  movementId: number,
  data: UpdateScrapMovementPayload,
): Promise<ScrapMovementMutationResponse> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/products/${productId}/scrap/${movementId}`,
    data,
  );
  return response.data;
};

export const getScrapMovement = async (
  productId: number,
  movementId: number,
): Promise<ScrapMovementResponse> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/products/${productId}/scrap/${movementId}`,
  );
  return response.data;
};
