import { useQuery } from "@tanstack/react-query";
import {
  getRawMaterialCategories,
  getRawMaterialCategoryById,
} from "./raw-material-category.api";
import { CategoryQueryParams } from "@/api/categories/types/category.type";

export const useRawMaterialCategories = (params?: CategoryQueryParams) => {
  return useQuery({
    queryKey: [
      "raw-material-categories",
      params?.page,
      params?.per_page,
      params?.["filter[search]"],
      params?.["filter[is_deleted]"],
      params?.sort,
    ],
    queryFn: () => getRawMaterialCategories(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};

export const useSingleRawMaterialCategory = (id: number) => {
  return useQuery({
    queryKey: ["raw-material-category", id],
    queryFn: () => getRawMaterialCategoryById(id),
    enabled: !!id,
  });
};
