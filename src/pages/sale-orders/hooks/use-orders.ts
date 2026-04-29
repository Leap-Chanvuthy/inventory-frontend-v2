import { useMemo } from "react";
import {
  useAddSaleOrderPayment,
  useCreateSaleOrder,
  useRefundSaleOrder,
  useUpdateSaleOrder,
  useUpdateSaleOrderStatus,
} from "@/api/sale-orders/sale-order.mutation";
import { useSaleOrders } from "@/api/sale-orders/sale-order.query";
import type {
  PaymentStatus,
  SaleOrderInstallmentRecord,
  SaleOrderItemRecord,
  SaleOrderQueryParams,
  SaleOrderRecord,
  SaleOrderRefundItemRecord,
  SaleOrderRefundRecord,
} from "@/api/sale-orders/sale-order.types";
import type { Order, OrderFormState, OrderStatus, RefundData } from "../types";

function normalizeOrderItems(items: SaleOrderItemRecord[] | undefined): Order["items"] {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: item.id,
    productId: String(item.product_id),
    productDbId: Number(item.product_id),
    productName: item.product?.product_name,
    productSku: item.product?.product_sku_code,
    productCategory: item.product?.product_category_name,
    qty: Number(item.quantity ?? 0),
    priceAtSale: Number(item.unit_price_in_usd ?? 0),
    priceAtSaleRiel: Number(item.unit_price_in_riel ?? 0),
    returnedQty: Number(item.returned_quantity ?? 0),
    refundQty: Number(item.refund_quantity ?? 0),
    exchangeRateUsdToRiel: Number(item.exchange_rate_from_usd_to_riel ?? 0),
  }));
}

function normalizeInstallments(items: SaleOrderInstallmentRecord[] | undefined): NonNullable<Order["installments"]> {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: Number(item.id),
    percentage: Number(item.percentage ?? 0),
    cumulativePercentage: Number(item.cumulative_percentage ?? 0),
    amountUsd: Number(item.amount_usd ?? 0),
    amountRiel: Number(item.amount_riel ?? 0),
    paidAt: item.paid_at,
    note: item.note ?? null,
  }));
}

function normalizeRefundItems(items: SaleOrderRefundItemRecord[] | undefined): NonNullable<Order["refunds"]>[number]["items"] {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: Number(item.id),
    saleOrderItemId: Number(item.sale_order_item_id),
    quantity: Number(item.quantity ?? 0),
    processReturn: Boolean(item.process_return),
    processRefund: Boolean(item.process_refund),
    isResellable: item.is_resellable ?? null,
    returnAction: item.return_action,
    refundPercentage: Number(item.refund_percentage ?? 0),
    refundAmountInUsd: Number(item.refund_amount_in_usd ?? 0),
    reason: item.reason ?? null,
    note: item.note ?? null,
    productName:
      item.sale_order_item?.product?.product_name ??
      item.saleOrderItem?.product?.product_name,
  }));
}

function normalizeRefunds(refunds: SaleOrderRefundRecord[] | undefined): NonNullable<Order["refunds"]> {
  if (!Array.isArray(refunds)) return [];
  return refunds.map(refund => ({
    id: Number(refund.id),
    refundNo: refund.refund_no,
    refundType: refund.refund_type,
    refundMethod: refund.refund_method,
    reasonType: refund.reason_type,
    reason: refund.reason,
    totalRefundAmountInUsd: Number(refund.total_refund_amount_in_usd ?? 0),
    totalRefundAmountInRiel: Number(refund.total_refund_amount_in_riel ?? 0),
    processedAt: refund.processed_at,
    items: normalizeRefundItems(refund.items),
  }));
}

export function mapSaleOrderRecord(record: SaleOrderRecord): Order {
  const orderItems = normalizeOrderItems(record.order_items ?? record.orderItems ?? []);
  const refunds = normalizeRefunds(record.refunds);
  const installments = normalizeInstallments(record.installments);
  const customerDiscount = Number(
    record.customer?.customer_category?.discount_percentage ??
      record.customer?.customerCategory?.discount_percentage ??
      0,
  );

  const normalizedPaymentStatus: Order["paymentStatus"] =
    record.payment_status === "PAID"
      ? "PAID"
      : record.payment_status === "DEBT"
        ? "DEBT"
        : "INSTALLMENT";

  return {
    id: record.order_no,
    dbId: Number(record.id),
    customerId: String(record.customer_id ?? ""),
    customerName: record.customer_name ?? record.customer?.fullname ?? undefined,
    customerPhone: record.customer_phone ?? record.customer?.phone_number ?? undefined,
    status: record.order_status as OrderStatus,
    paymentStatus: normalizedPaymentStatus,
    discount: Number(record.discount_percentage ?? 0),
    discountPercentage: Number(record.discount_percentage ?? 0),
    tax: Number(record.tax_percentage ?? 0),
    note: record.note ?? "",
    useCategoryDiscount:
      Math.abs(Number(record.discount_percentage ?? 0) - customerDiscount) < 0.0001,
    items: orderItems,
    createdAt: record.created_at,
    orderDate: record.order_date,
    subtotalInUsd: Number(record.sub_total_in_usd ?? 0),
    subtotalInRiel: Number(record.sub_total_in_riel ?? 0),
    discountAmountInUsd: Number(record.discount_amount ?? 0),
    taxAmountInUsd: Number(record.tax_amount_in_usd ?? 0),
    grandTotalInUsd: Number(record.grand_total_amount_in_usd ?? 0),
    grandTotalInRiel: Number(record.grand_total_amount_in_riel ?? 0),
    returnWindowDays: Number(record.return_window_days ?? 0),
    returnValidUntil: record.return_valid_until ?? undefined,
    paidAmountInUsd: Number(record.paid_amount_in_usd ?? 0),
    paidAmountInRiel: Number(record.paid_amount_in_riel ?? 0),
    paidPercentage: Number(record.paid_percentage ?? 0),
    totalRefundedAmountInUsd: Number(record.total_refunded_amount_in_usd ?? 0),
    totalRefundedAmountInRiel: Number(record.total_refunded_amount_in_riel ?? 0),
    remainingBalanceInUsd: Number(record.remaining_balance_in_usd ?? 0),
    remainingBalanceInRiel: Number(record.remaining_balance_in_riel ?? 0),
    installments,
    refunds,
    latestRefund: refunds[0] ?? null,
  };
}

function buildOrderPayload(formState: OrderFormState) {
  const normalizedOrderDate = formState.orderDate
    ? `${formState.orderDate} 00:00:00`
    : new Date().toISOString();

  return {
    customer_id: formState.customerId ? Number(formState.customerId) : undefined,
    order_date: normalizedOrderDate,
    return_window_days: Number(formState.returnWindowDays || 30),
    note: formState.note || undefined,
    tax_percentage: Number(formState.tax || 0),
    discount_type: formState.useCategoryDiscount ? ("AUTO" as const) : ("MANUAL" as const),
    ...(formState.useCategoryDiscount
      ? {}
      : { discount_value: Number(formState.discount || 0) }),
    items: formState.items.map(item => ({
      product_id: Number(item.productDbId || item.productId),
      quantity: Number(item.qty),
    })),
  };
}

export function useOrders(params?: SaleOrderQueryParams) {
  const ordersQuery = useSaleOrders(params);

  const createMutation = useCreateSaleOrder();
  const updateMutation = useUpdateSaleOrder();
  const updateStatusMutation = useUpdateSaleOrderStatus();
  const refundMutation = useRefundSaleOrder();
  const addPaymentMutation = useAddSaleOrderPayment();

  const orders: Order[] = useMemo(
    () => (ordersQuery.data?.data?.data ?? []).map(mapSaleOrderRecord),
    [ordersQuery.data],
  );

  const orderMap = useMemo(() => {
    return new Map(orders.map(order => [order.id, order]));
  }, [orders]);

  const orderMapByDbId = useMemo(() => {
    return new Map(orders.map(order => [order.dbId, order]));
  }, [orders]);

  const resolveOrderByIdentifier = (identifier: string | number) => {
    if (typeof identifier === "number") {
      return orderMapByDbId.get(identifier) ?? null;
    }

    const byOrderNo = orderMap.get(identifier);
    if (byOrderNo) return byOrderNo;

    const numeric = Number(identifier);
    if (Number.isFinite(numeric) && numeric > 0) {
      return orderMapByDbId.get(numeric) ?? null;
    }

    return null;
  };

  const saveOrder = async (formState: OrderFormState, shouldProcess = false) => {
    const payload = buildOrderPayload(formState);
    let orderDbId: number | null = null;

    if (formState.isEdit && formState.dbId) {
      const response = await updateMutation.mutateAsync({
        id: formState.dbId,
        payload,
      });
      orderDbId = Number(response.data.sale_order.id);
    } else {
      const response = await createMutation.mutateAsync(payload);
      orderDbId = Number(response.data.sale_order.id);
    }

    if (shouldProcess && orderDbId) {
      await updateStatusMutation.mutateAsync({
        id: orderDbId,
        payload: { order_status: "PROCESSING" },
      });
    }
  };

  const updateStatus = async (id: string | number, status: OrderStatus) => {
    const order = resolveOrderByIdentifier(id);
    if (!order) return;
    if (status === "REFUNDED") return;

    await updateStatusMutation.mutateAsync({
      id: order.dbId,
      payload: { order_status: status },
    });
  };

  const updatePayment = async (
    id: string | number,
    payload: {
      payment_status: PaymentStatus;
      payment_percentage?: number;
      paid_at?: string;
      installment_note?: string;
    },
  ) => {
    const order = resolveOrderByIdentifier(id);
    if (!order) return;

    if (typeof payload.payment_percentage !== "number") {
      return;
    }

    await addPaymentMutation.mutateAsync({
      id: order.dbId,
      payload: {
        payment_status: payload.payment_status,
        payment_percentage: payload.payment_percentage,
        paid_at: payload.paid_at,
        note: payload.installment_note,
      },
    });
  };

  const markRefunded = async (refundData: RefundData) => {
    if (!refundData.orderId) return null;
    const order = orderMapByDbId.get(refundData.orderId);
    if (!order) return null;

    const selectedItems = refundData.items.filter(
      item => item.quantity > 0 && (item.processReturn || item.processRefund),
    );
    if (selectedItems.length === 0) return null;

    const response = await refundMutation.mutateAsync({
      id: order.dbId,
      payload: {
        refund_type: refundData.refundType,
        refund_method: refundData.refundMethod,
        reason_type: refundData.reasonType,
        reason: refundData.reason,
        items: selectedItems.map(item => ({
          sale_order_item_id: item.id,
          product_id: item.productDbId,
          quantity: item.quantity,
          process_return: item.processReturn,
          process_refund: item.processRefund,
          is_resellable: item.isResellable,
          return_action: item.returnAction,
          refund_percentage: item.processRefund ? item.refundPercentage : undefined,
          refund_amount_override: item.refundAmountOverride,
          reason: item.reason || undefined,
          note: item.refundNote || undefined,
        })),
      },
    });

    return response.data.sale_order.order_status as OrderStatus;
  };

  return {
    orders,
    orderMap,
    orderMapByDbId,
    pagination: ordersQuery.data?.data
      ? {
          currentPage: Number(ordersQuery.data.data.current_page ?? 1),
          perPage: Number(ordersQuery.data.data.per_page ?? params?.per_page ?? 10),
          totalPages: Number(ordersQuery.data.data.last_page ?? 1),
          totalItems: Number(ordersQuery.data.data.total ?? 0),
        }
      : {
          currentPage: 1,
          perPage: Number(params?.per_page ?? 10),
          totalPages: 1,
          totalItems: 0,
        },
    isLoading: ordersQuery.isLoading,
    isFetching: ordersQuery.isFetching,
    saveOrder,
    updateStatus,
    updatePayment,
    markRefunded,
  };
}
