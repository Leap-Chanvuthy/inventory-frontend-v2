import { BASE_API_URL } from "@/consts/endpoints";
import {
  CreateProductCategoryRequest,
  ProductCategory,
  ProductCategoryQueryParams,
  ProductCategoryResponse,
} from "@/api/categories/types/category.type";
import { apiClient } from "@/api/client";

// Product Categories
export const getProductCategories = async (
  params?: ProductCategoryQueryParams
): Promise<ProductCategoryResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/product-categories`, {
    params,
  });
  return response.data;
};

export const createProductCategory = async (
  data: CreateProductCategoryRequest
): Promise<{ status: boolean; message: string; data: ProductCategory }> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/product-categories`,
    data
  );
  return response.data;
};

export const getProductCategoryById = async (
  id: number
): Promise<{ status: boolean; message: string; data: ProductCategory }> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/product-categories/${id}`
  );
  return response.data;
};

export const updateProductCategory = async (
  id: number,
  data: CreateProductCategoryRequest
): Promise<{ status: boolean; message: string; data: ProductCategory }> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/product-categories/${id}`,
    data
  );
  return response.data;
};


export const deleteProductCategory = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${BASE_API_URL}/product-categories/${id}`);
};