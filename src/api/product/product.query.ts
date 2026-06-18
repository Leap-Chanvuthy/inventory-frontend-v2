import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { getProducts, getProductById, getTrashedProducts, getInternalReorderMovement, getExternalReorderMovement, getProductMovements, getProductPnLDetailed, getProductStockLots, getProductScrapEligibleStockLots, getProductBomSummary, getProductMovementBomSummary, getScrapMovement, previewProductSaleAllocation } from "./product.api";
import { ProductQueryParams, ProductMovementQueryParams, ProductStockLotQueryParams } from "./product.type";

const productListQueryKey = (scope: string, params?: ProductQueryParams) => [
  scope,
  params?.page,
  params?.per_page,
  params?.["filter[search]"],
  params?.["filter[product_type]"],
  params?.["filter[product_category_id]"],
  params?.["filter[supplier_id]"],
  params?.["filter[warehouse_id]"],
  params?.["filter[uom_id]"],
  params?.["filter[has_expired_stock]"],
  params?.sort,
];

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: productListQueryKey("products", params),
    queryFn: () => getProducts(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
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
    queryKey: productListQueryKey("products-trashed", params),
    queryFn: () => getTrashedProducts(params),
    placeholderData: previousData => previousData,
    staleTime: 10_000,
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
    queryKey: [
      "product-movements",
      productId,
      params?.page,
      params?.per_page,
      params?.sort,
      params?.["filter[movement_type]"],
      params?.["filter[direction]"],
    ],
    queryFn: () => getProductMovements(productId, params),
    enabled: !!productId,
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};

export const useProductStockLots = (
  productId: number,
  params?: ProductStockLotQueryParams,
) => {
  return useQuery({
    queryKey: [
      "product-stock-lots",
      productId,
      params?.include_children,
      params?.include_disabled,
    ],
    queryFn: () => getProductStockLots(productId, params),
    enabled: !!productId,
    placeholderData: previousData => previousData,
    staleTime: 10_000,
  });
};

export const useProductScrapEligibleStockLots = (
  productId: number,
  includeDisabled = true,
) => {
  return useQuery({
    queryKey: ["product-scrap-eligible-stock-lots", productId, includeDisabled],
    queryFn: () => getProductScrapEligibleStockLots(productId, { include_disabled: includeDisabled }),
    enabled: !!productId,
  });
};

export const useProductPnLDetailed = (productId: number) => {
  return useQuery({
    queryKey: ["product-pnl-detailed", productId],
    queryFn: () => getProductPnLDetailed(productId),
    enabled: !!productId,
  });
};

export const useProductBomSummary = (productId: number) => {
  return useQuery({
    queryKey: ["product-bom-summary", productId],
    queryFn: () => getProductBomSummary(productId),
    enabled: !!productId,
  });
};

export const useProductMovementBomSummary = (productId: number, movementId: number) => {
  return useQuery({
    queryKey: ["product-bom-summary-movement", productId, movementId],
    queryFn: () => getProductMovementBomSummary(productId, movementId),
    enabled: !!productId && !!movementId,
  });
};

export const useScrapMovement = (productId: number, movementId: number) => {
  return useQuery({
    queryKey: ["product-scrap-movement", productId, movementId],
    queryFn: () => getScrapMovement(productId, movementId),
    enabled: !!productId && !!movementId,
  });
};

export const useProductSaleAllocationPreview = (
  productId: number,
  quantity: number,
  enabled = true,
) => {
  const debouncedQuantity = useDebounce(quantity, 350);

  return useQuery({
    queryKey: ["product-sale-allocation-preview", productId, debouncedQuantity],
    queryFn: () => previewProductSaleAllocation(productId, debouncedQuantity),
    enabled: enabled && productId > 0 && debouncedQuantity > 0,
    staleTime: 0,
  });
};
