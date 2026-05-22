import { useQuery } from "@tanstack/react-query";
import {
  getProductCategories,
  getProductCategoryById,
  getTrashedProductCategories,
} from "./product-category.api";
import { ProductCategoryQueryParams } from "@/api/categories/types/category.type";

export const useProductCategories = (params?: ProductCategoryQueryParams) => {
  const isDeletedFilter = params?.["filter[is_deleted]"] as unknown;
  const normalizedDeletedFilter =
    typeof isDeletedFilter === "string"
      ? isDeletedFilter.trim().toLowerCase()
      : isDeletedFilter;

  const useTrashed =
    isDeletedFilter === 1 ||
    isDeletedFilter === true ||
    normalizedDeletedFilter === "1" ||
    normalizedDeletedFilter === "true";

  return useQuery({
    queryKey: ["product-categories", useTrashed ? "trashed" : "active", params],
    queryFn: () =>
      useTrashed ? getTrashedProductCategories(params) : getProductCategories(params),
  });
};

export const useSingleProductCategory = (id: number) => {
  return useQuery({
    queryKey: ["product-category", id],
    queryFn: () => getProductCategoryById(id),
    enabled: !!id,
  });
};
