import { useQuery } from "@tanstack/react-query";
import { getCustomers, getCustomerById } from "./customer.api";
import { CustomerQueryParams } from "./customer.types";

// Get all customers with pagination and filters
export const useCustomers = (params?: CustomerQueryParams) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params),
  });
};

// Get single customer by ID
export const useSingleCustomer = (id: number) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
};
