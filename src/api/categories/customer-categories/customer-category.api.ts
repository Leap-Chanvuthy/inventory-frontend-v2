import { BASE_API_URL } from "@/consts/endpoints";
import {
  CreateCustomerCategoryRequest,
  CustomerCategory,
  CustomerCategoryQueryParams,
  CustomerCategoryResponse,
} from "@/api/categories/types/category.type";
import { apiClient } from "@/api/client";

// Customer Categories
export const getCustomerCategories = async (
  params?: CustomerCategoryQueryParams
): Promise<CustomerCategoryResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/customer-categories`, {
    params,
  });
  return response.data;
};

export const createCustomerCategory = async (
  data: CreateCustomerCategoryRequest
): Promise<{ status: boolean; message: string; data: CustomerCategory }> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/customer-categories`,
    data
  );
  return response.data;
};

export const getCustomerCategoryById = async (
  id: number
): Promise<{ status: boolean; message: string; data: CustomerCategory }> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/customer-categories/${id}`
  );
  return response.data;
};

export const updateCustomerCategory = async (
  id: number,
  data: CreateCustomerCategoryRequest
): Promise<{ status: boolean; message: string; data: CustomerCategory }> => {
  const response = await apiClient.patch(
    `${BASE_API_URL}/customer-categories/${id}`,
    data
  );
  return response.data;
};
