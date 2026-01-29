import { BASE_API_URL } from "@/consts/endpoints";
import {
  GetCustomersResponse,
  GetCustomerResponse,
  CustomerQueryParams,
  CreateCustomerRequest,
  CreateCustomerFormPayload,
} from "./customer.types";
import { apiClient } from "@/api/client";

// Get all customers with pagination and filters
export const getCustomers = async (
  params?: CustomerQueryParams,
): Promise<GetCustomersResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/customers`, {
    params,
  });
  return response.data;
};

// Get single customer by ID
export const getCustomerById = async (
  id: number,
): Promise<GetCustomerResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/customers/${id}`);
  return response.data;
};

// Create new customer
export const createCustomer = async (
  data: CreateCustomerFormPayload | CreateCustomerRequest,
): Promise<GetCustomerResponse> => {
  const response = await apiClient.post(`${BASE_API_URL}/customers`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update existing customer
export const updateCustomer = async (
  id: number,
  data: CreateCustomerFormPayload | Partial<CreateCustomerRequest>,
): Promise<GetCustomerResponse> => {
  const response = await apiClient.post(
    `${BASE_API_URL}/customers/${id}`,
    { ...data, _method: "PATCH" },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

// Delete customer
export const deleteCustomer = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${BASE_API_URL}/customers/${id}`);
};
