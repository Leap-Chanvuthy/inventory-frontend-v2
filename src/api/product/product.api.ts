import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "@/api/client";
import {
  GetProductsResponse,
  GetProductResponse,
  ProductQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
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

export const deleteProduct = async (
  id: number
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.delete(`${BASE_API_URL}/products/${id}`);
  return response.data;
};
