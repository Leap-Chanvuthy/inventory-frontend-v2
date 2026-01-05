import { useQuery } from "@tanstack/react-query";
import { getRawMaterialCategories } from "./category.api";
import { CategoryQueryParams } from "./category.types";

export const useRawMaterialCategories = (params?: CategoryQueryParams) => {
  return useQuery({
    queryKey: ["raw-material-categories", params],
    queryFn: () => getRawMaterialCategories(params),
  });
};
