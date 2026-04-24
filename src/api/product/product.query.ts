import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts, getProductById, getTrashedProducts, getInternalReorderMovement, getExternalReorderMovement, getProductMovements, getScrapMovement } from "./product.api";
import { ProductQueryParams, ProductMovementQueryParams } from "./product.type";

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

export const useTrashedProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ["products-trashed", params],
    queryFn: () => getTrashedProducts(params),
    placeholderData: keepPreviousData,
  });
};

export const useInternalReorderMovement = (productId: number, movementId: number) => {
  return useQuery({
    queryKey: ["product-movement-internal", productId, movementId],
    queryFn: () => getInternalReorderMovement(productId, movementId),
    enabled: !!productId && !!movementId,
  });
};

export const useExternalReorderMovement = (productId: number, movementId: number) => {
  return useQuery({
    queryKey: ["product-movement-external", productId, movementId],
    queryFn: () => getExternalReorderMovement(productId, movementId),
    enabled: !!productId && !!movementId,
  });
};

export const useProductMovements = (productId: number, params?: ProductMovementQueryParams) => {
  return useQuery({
    queryKey: ["product-movements", productId, params],
    queryFn: () => getProductMovements(productId, params),
    enabled: !!productId,
    placeholderData: keepPreviousData,
  });
};

export const useScrapMovement = (productId: number, movementId: number) => {
  return useQuery({
    queryKey: ["product-scrap-movement", productId, movementId],
    queryFn: () => getScrapMovement(productId, movementId),
    enabled: !!productId && !!movementId,
  });
};
