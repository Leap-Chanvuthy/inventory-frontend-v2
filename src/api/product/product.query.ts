import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById } from "./product.api";
import { ProductQueryParams } from "./product.type";

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};

export const useSingleProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};
