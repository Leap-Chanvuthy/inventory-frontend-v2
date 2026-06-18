import { useQuery } from "@tanstack/react-query";
import {
  getCustomerCategories,
  getCustomerCategoryById,
  getTrashedCustomerCategories,
} from "./customer-category.api";
import { CustomerCategoryQueryParams } from "@/api/categories/types/category.type";

const customerCategoryQueryKey = (
  scope: string,
  params?: CustomerCategoryQueryParams,
) => [
  scope,
  params?.page,
  params?.per_page,
  params?.["filter[search]"],
  params?.["filter[is_deleted]"],
  params?.sort,
];

export const useCustomerCategories = (params?: CustomerCategoryQueryParams) => {
  return useQuery({
    queryKey: customerCategoryQueryKey("customer-categories", params),
    queryFn: () => getCustomerCategories(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};

export const useSingleCustomerCategory = (id: number) => {
  return useQuery({
    queryKey: ["customer-category", id],
    queryFn: () => getCustomerCategoryById(id),
    enabled: !!id,
  });
};


export const useTrashedCustomerCategories = (params?: CustomerCategoryQueryParams) => {
  return useQuery({
    queryKey: customerCategoryQueryKey("customer-categories-trashed", params),
    queryFn: () => getTrashedCustomerCategories(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
}
