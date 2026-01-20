import { useQuery } from "@tanstack/react-query";
import {
  getCustomerCategories,
  getCustomerCategoryById,
} from "./customer-category.api";
import { CustomerCategoryQueryParams } from "@/api/categories/types/category.type";

export const useCustomerCategories = (params?: CustomerCategoryQueryParams) => {
  return useQuery({
    queryKey: ["customer-categories", params],
    queryFn: () => getCustomerCategories(params),
  });
};

export const useSingleCustomerCategory = (id: number) => {
  return useQuery({
    queryKey: ["customer-category", id],
    queryFn: () => getCustomerCategoryById(id),
    enabled: !!id,
  });
};
