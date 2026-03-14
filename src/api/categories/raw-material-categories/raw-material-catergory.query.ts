import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getRawMaterialCategories,
  getRawMaterialCategoryById,
} from "./raw-material-category.api";
import { CategoryQueryParams } from "@/api/categories/types/category.type";

export const useRawMaterialCategories = (params?: CategoryQueryParams) => {
  const normalizedParams = params ? { ...params } : {};
  return useQuery({
    queryKey: ["raw-material-categories", normalizedParams],
    queryFn: () => getRawMaterialCategories(params),
    placeholderData: keepPreviousData,
  });
};

export const useSingleRawMaterialCategory = (id: number) => {
  return useQuery({
    queryKey: ["raw-material-category", id],
    queryFn: () => getRawMaterialCategoryById(id),
    enabled: !!id,
  });
};
