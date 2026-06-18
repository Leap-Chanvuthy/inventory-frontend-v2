import { useQuery } from "@tanstack/react-query";
import {
  getProductCategories,
  getProductCategoryById,
  getTrashedProductCategories,
} from "./product-category.api";
import { ProductCategoryQueryParams } from "@/api/categories/types/category.type";

const productCategoryQueryKey = (
  scope: string,
  params?: ProductCategoryQueryParams,
) => [
  scope,
  params?.page,
  params?.per_page,
  params?.["filter[search]"],
  params?.["filter[is_deleted]"],
  params?.sort,
];

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
    queryKey: productCategoryQueryKey(
      useTrashed ? "product-categories-trashed" : "product-categories",
      params,
    ),
    queryFn: () =>
      useTrashed ? getTrashedProductCategories(params) : getProductCategories(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};

export const useSingleProductCategory = (id: number) => {
  return useQuery({
    queryKey: ["product-category", id],
    queryFn: () => getProductCategoryById(id),
    enabled: !!id,
  });
};
