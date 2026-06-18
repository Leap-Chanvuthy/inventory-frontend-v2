import { useQuery } from "@tanstack/react-query";
import { getCustomers, getCustomerById } from "./customer.api";
import { CustomerQueryParams } from "./customer.types";

// Get all customers with pagination and filters
export const useCustomers = (params?: CustomerQueryParams) => {
  return useQuery({
    queryKey: [
      "customers",
      params?.page,
      params?.per_page,
      params?.["filter[id]"],
      params?.["filter[search]"],
      params?.["filter[customer_status]"],
      params?.["filter[customer_category_id]"],
      params?.sort,
    ],
    queryFn: () => getCustomers(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
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
