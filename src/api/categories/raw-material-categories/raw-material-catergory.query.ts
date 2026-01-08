import { useQuery } from "@tanstack/react-query";
import {
  getRawMaterialCategories,
  getRawMaterialCategoryById,
} from "./raw-material-category.api";
import { CategoryQueryParams } from "./raw-material-category.types";

export const useRawMaterialCategories = (params?: CategoryQueryParams) => {
  return useQuery({
    queryKey: ["raw-material-categories", params],
    queryFn: () => getRawMaterialCategories(params),
  });
};

export const useSingleRawMaterialCategory = (id: number) => {
  return useQuery({
    queryKey: ["raw-material-category", id],
    queryFn: () => getRawMaterialCategoryById(id),
    enabled: !!id,
  });
};
