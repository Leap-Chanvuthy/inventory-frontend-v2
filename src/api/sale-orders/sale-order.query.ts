import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getSaleOrderRefundRecords,
  getSaleOrderById,
  getSaleOrderRefunds,
  getSaleOrderStatistics,
  getSaleOrderStockAvailability,
  getSaleOrders,
} from "./sale-order.api";
import { SaleOrderQueryParams, SaleOrderRefundRecordQueryParams } from "./sale-order.types";

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

export const useSaleOrderRefundRecords = (params?: SaleOrderRefundRecordQueryParams) => {
  return useQuery({
    queryKey: ["sale-order-refund-records", params],
    queryFn: () => getSaleOrderRefundRecords(params),
    placeholderData: keepPreviousData,
    enabled: Boolean(params),
  });
};

export const useSaleOrderStockAvailability = (productId: number) => {
  return useQuery({
    queryKey: ["sale-order-stock-availability", productId],
    queryFn: () => getSaleOrderStockAvailability(productId),
    enabled: !!productId,
  });
};

export const useSaleOrderStatistics = (params?: {
  date_from?: string;
  date_to?: string;
  group_by?: "day" | "week" | "month" | "year";
  customer_id?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["sale-order-statistics", params],
    queryFn: () => getSaleOrderStatistics(params),
  });
};
