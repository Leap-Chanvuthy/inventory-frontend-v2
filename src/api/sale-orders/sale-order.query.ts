import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getSaleOrderById,
  getSaleOrderRefunds,
  getSaleOrderStatistics,
  getSaleOrderStockAvailability,
  getSaleOrders,
} from "./sale-order.api";
import { SaleOrderQueryParams } from "./sale-order.types";

export const useSaleOrders = (params?: SaleOrderQueryParams) => {
  return useQuery({
    queryKey: ["sale-orders", params],
    queryFn: () => getSaleOrders(params),
    placeholderData: keepPreviousData,
  });
};

export const useSingleSaleOrder = (id: number) => {
  return useQuery({
    queryKey: ["sale-order", id],
    queryFn: () => getSaleOrderById(id),
    enabled: !!id,
  });
};

export const useSaleOrderRefunds = (id: number) => {
  return useQuery({
    queryKey: ["sale-order-refunds", id],
    queryFn: () => getSaleOrderRefunds(id),
    enabled: !!id,
  });
};

export const useSaleOrderStockAvailability = (productId: number) => {
  return useQuery({
    queryKey: ["sale-order-stock-availability", productId],
    queryFn: () => getSaleOrderStockAvailability(productId),
    enabled: !!productId,
  });
};

export const useSaleOrderStatistics = (params?: { date_from?: string; date_to?: string }) => {
  return useQuery({
    queryKey: ["sale-order-statistics", params],
    queryFn: () => getSaleOrderStatistics(params),
  });
};
