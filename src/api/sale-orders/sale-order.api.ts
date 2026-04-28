import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "@/api/client";
import {
  CreateSaleOrderPayload,
  RefundSaleOrderPayload,
  SaleOrderRefundListResponse,
  SaleOrderListResponse,
  SaleOrderQueryParams,
  SaleOrderStatisticsResponse,
  SaleOrderSingleResponse,
  SaleOrderStockAvailabilityResponse,
  UpdateSaleOrderPayload,
  UpdateSaleOrderStatusPayload,
} from "./sale-order.types";

export const getSaleOrders = async (
  params?: SaleOrderQueryParams,
): Promise<SaleOrderListResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/sale-orders`, { params });
  return response.data;
};

export const getSaleOrderById = async (
  id: number,
): Promise<SaleOrderSingleResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/sale-orders/${id}`);
  return response.data;
};

export const getSaleOrderRefunds = async (
  id: number,
): Promise<SaleOrderRefundListResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/sale-orders/${id}/refunds`);
  return response.data;
};

export const createSaleOrder = async (
  payload: CreateSaleOrderPayload,
): Promise<SaleOrderSingleResponse> => {
  const response = await apiClient.post(`${BASE_API_URL}/sale-orders`, payload);
  return response.data;
};

export const updateSaleOrder = async (
  id: number,
  payload: UpdateSaleOrderPayload,
): Promise<SaleOrderSingleResponse> => {
  const response = await apiClient.patch(`${BASE_API_URL}/sale-orders/${id}`, payload);
  return response.data;
};

export const updateSaleOrderStatus = async (
  id: number,
  payload: UpdateSaleOrderStatusPayload,
): Promise<SaleOrderSingleResponse> => {
  const response = await apiClient.patch(`${BASE_API_URL}/sale-orders/${id}/status`, payload);
  return response.data;
};

export const refundSaleOrder = async (
  id: number,
  payload: RefundSaleOrderPayload,
): Promise<SaleOrderSingleResponse> => {
  const response = await apiClient.patch(`${BASE_API_URL}/sale-orders/${id}/refund`, payload);
  return response.data;
};

export const deleteSaleOrder = async (
  id: number,
): Promise<{ status: boolean; message: string }> => {
  const response = await apiClient.delete(`${BASE_API_URL}/sale-orders/${id}`);
  return response.data;
};

export const getSaleOrderStockAvailability = async (
  productId: number,
): Promise<SaleOrderStockAvailabilityResponse> => {
  const response = await apiClient.get(
    `${BASE_API_URL}/sale-orders/stock-availability/${productId}`,
  );
  return response.data;
};

export const getSaleOrderStatistics = async (
  params?: { date_from?: string; date_to?: string },
): Promise<SaleOrderStatisticsResponse> => {
  const response = await apiClient.get(`${BASE_API_URL}/sale-orders/statistics`, {
    params,
  });
  return response.data;
};
