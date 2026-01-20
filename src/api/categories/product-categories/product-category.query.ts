import { useQuery } from "@tanstack/react-query";
import {
  getProductCategories,
  getProductCategoryById,
} from "./product-category.api";
import { ProductCategoryQueryParams } from "@/api/categories/types/category.type";

export const useProductCategories = (params?: ProductCategoryQueryParams) => {
  return useQuery({
    queryKey: ["product-categories", params],
    queryFn: () => getProductCategories(params),
  });
};

export const useSingleProductCategory = (id: number) => {
  return useQuery({
    queryKey: ["product-category", id],
    queryFn: () => getProductCategoryById(id),
    enabled: !!id,
  });
};
