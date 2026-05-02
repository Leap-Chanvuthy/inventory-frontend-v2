export type SaleOrderStatus =
  | "DRAFT"
  | "PROCESSING"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PAID" | "INSTALLMENT" | "DEBT";

export interface SaleOrderCustomerCategory {
  id?: number;
  category_name?: string;
  discount_percentage?: number;
}

export interface SaleOrderCustomer {
  id: number;
  fullname?: string;
  phone_number?: string;
  customer_category?: SaleOrderCustomerCategory;
  customerCategory?: SaleOrderCustomerCategory;
}

export interface SaleOrderProduct {
  id: number;
  product_name?: string;
  product_sku_code?: string;
  product_category_name?: string;
}

export interface SaleOrderItemRecord {
  id: number;
  sale_order_id: number;
  product_id: number;
  quantity: number;
  returned_quantity: number;
  refund_quantity: number;
  unit_price_in_usd: number;
  unit_price_in_riel: number;
  total_price_in_usd: number;
  total_price_in_riel: number;
  exchange_rate_from_usd_to_riel: number;
  exchange_rate_from_riel_to_usd: number;
  note?: string | null;
  product?: SaleOrderProduct;
}

export interface SaleOrderInstallmentRecord {
  id: number;
  sale_order_id: number;
  percentage: number;
  cumulative_percentage: number;
  amount_usd: number;
  amount_riel: number;
  paid_at: string;
  note?: string | null;
  created_by?: number | null;
  created_at: string;
  updated_at: string;
}

export interface SaleOrderStatusHistoryRecord {
  id: number;
  sale_order_id: number;
  from_status?: string | null;
  to_status: string;
  note?: string | null;
  changed_at: string;
  changed_by?: number | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface SaleOrderRecord {
  id: number;
  order_no: string;
  customer_id?: number | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  order_date: string;
  order_status: SaleOrderStatus;
  payment_status: PaymentStatus;
  note?: string | null;
  tax_percentage: number;
  tax_amount_in_usd: number;
  tax_amount_in_riel: number;
  return_window_days?: number;
  return_valid_until?: string | null;
  sub_total_in_usd: number;
  sub_total_in_riel: number;
  grand_total_amount_in_usd: number;
  grand_total_amount_in_riel: number;
  discount_percentage: number;
  discount_amount: number;
  paid_amount_in_usd?: number;
  paid_amount_in_riel?: number;
  paid_percentage?: number;
  total_refunded_amount_in_usd?: number;
  total_refunded_amount_in_riel?: number;
  remaining_balance_in_usd?: number;
  remaining_balance_in_riel?: number;
  created_at: string;
  updated_at: string;
  order_items_count?: number;
  refunds_count?: number;
  installments_count?: number;
  order_items?: SaleOrderItemRecord[];
  orderItems?: SaleOrderItemRecord[];
  customer?: SaleOrderCustomer | null;
  refunds?: SaleOrderRefundRecord[];
  installments?: SaleOrderInstallmentRecord[];
  status_histories?: SaleOrderStatusHistoryRecord[];
}

export interface SaleOrderPaginatedData {
  current_page: number;
  data: SaleOrderRecord[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface SaleOrderListResponse {
  status: boolean;
  message: string;
  data: SaleOrderPaginatedData;
}

export interface SaleOrderSingleResponse {
  status: boolean;
  message: string;
  data: {
    sale_order: SaleOrderRecord;
  };
}

export interface SaleOrderQueryParams {
  page?: number;
  per_page?: number;
  "filter[search]"?: string;
  "filter[order_status]"?: string;
  "filter[payment_status]"?: string;
  "filter[date_from]"?: string;
  "filter[date_to]"?: string;
  sort?: string;
}

export interface SaleOrderLineInput {
  product_id: number;
  quantity: number;
  note?: string;
}

export type RefundType = "CASH_REFUND" | "PARTIAL_REFUND" | "DISCOUNT_COMPENSATION";
export type RefundMethod = "CASH" | "BANK_TRANSFER" | "STORE_CREDIT" | "DISCOUNT_COMPENSATION";
export type RefundReasonType = "PRODUCT_ISSUE" | "CUSTOMER_SATISFACTION" | "COMPENSATION" | "OTHER";
export type ReturnAction = "RETURN_TO_STOCK" | "SCRAP" | "NO_RETURN";

export interface CreateSaleOrderPayload {
  customer_id?: number | null;
  order_date: string;
  return_window_days?: number;
  payment_status?: PaymentStatus;
  payment_percentage?: number;
  paid_at?: string;
  installment_note?: string;
  note?: string;
  tax_percentage?: number;
  discount_type?: "AUTO" | "MANUAL";
  discount_value?: number;
  use_customer_category_discount?: boolean;
  discount_percentage?: number;
  items: SaleOrderLineInput[];
}

export interface UpdateSaleOrderPayload {
  customer_id?: number | null;
  order_date?: string;
  return_window_days?: number;
  payment_status?: PaymentStatus;
  payment_percentage?: number;
  paid_at?: string;
  installment_note?: string;
  note?: string;
  tax_percentage?: number;
  discount_type?: "AUTO" | "MANUAL";
  discount_value?: number;
  use_customer_category_discount?: boolean;
  discount_percentage?: number;
  items?: SaleOrderLineInput[];
}

export interface UpdateSaleOrderStatusPayload {
  order_status: Exclude<SaleOrderStatus, "REFUNDED">;
  payment_status?: PaymentStatus;
}

export interface AddSaleOrderPaymentPayload {
  payment_status: PaymentStatus;
  payment_percentage: number;
  paid_at?: string;
  note?: string;
}

export interface UpdateLatestInstallmentPayload {
  payment_percentage: number;
  paid_at?: string;
  note?: string;
}

export interface RefundSaleOrderLinePayload {
  sale_order_item_id?: number;
  product_id?: number;
  quantity: number;
  process_return?: boolean;
  process_refund?: boolean;
  is_resellable?: boolean;
  return_action?: ReturnAction;
  refund_percentage?: number;
  refund_amount_override?: number;
  refund_amount_override_in_usd?: number;
  refund_amount_override_in_riel?: number;
  reason?: string;
  note?: string;
}

export interface RefundSaleOrderPayload {
  refund_type: RefundType;
  refund_method: RefundMethod;
  reason_type: RefundReasonType;
  reason: string;
  processed_at?: string;
  movement_date?: string;
  note?: string;
  items: RefundSaleOrderLinePayload[];
}

export interface SaleOrderRefundItemRecord {
  id: number;
  sale_order_refund_id: number;
  sale_order_item_id: number;
  quantity: number;
  process_return: boolean;
  process_refund: boolean;
  is_resellable?: boolean | null;
  return_action: ReturnAction;
  refund_percentage: number;
  refund_amount_in_usd: number;
  refund_amount_in_riel: number;
  reason?: string | null;
  note?: string | null;
  created_at: string;
  updated_at: string;
  sale_order_item?: SaleOrderItemRecord;
  saleOrderItem?: SaleOrderItemRecord;
}

export interface SaleOrderRefundRecord {
  id: number;
  sale_order_id: number;
  refund_no: string;
  refund_type: RefundType;
  refund_method: RefundMethod;
  reason_type: RefundReasonType;
  reason: string;
  note?: string | null;
  total_refund_amount_in_usd: number;
  total_refund_amount_in_riel: number;
  processed_at: string;
  processed_by?: number | null;
  created_at: string;
  updated_at: string;
  items?: SaleOrderRefundItemRecord[];
  sale_order?: SaleOrderRecord;
  saleOrder?: SaleOrderRecord;
}

export interface SaleOrderRefundListResponse {
  status: boolean;
  message: string;
  data: {
    sale_order_id: number;
    refunds: SaleOrderRefundRecord[];
  };
}

export interface SaleOrderRefundRecordQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  refund_type?: string;
}

export interface SaleOrderRefundRecordListResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: SaleOrderRefundRecord[];
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SaleOrderStockAvailabilityResponse {
  status: boolean;
  message: string;
  data: {
    available_stock: number;
  };
}

export interface SaleOrderValidationErrors {
  status: boolean;
  message: string;
  errors?: Record<string, string[]> | Array<Record<string, unknown>>;
}

export interface SaleOrderTrendPoint {
  period: string;
  total_sales_usd: number;
  total_sales_riel: number;
}

export interface SaleOrderStatistics {
  total_orders: number;
  total_draft: number;
  total_processing: number;
  total_on_hold: number;
  total_completed: number;
  total_cancelled: number;
  total_refunded_records: number;
  total_refunded: number;
  total_refunded_usd: number;
  total_refunded_riel: number;
  total_discount_amount: number;
  gross_sales_usd: number;
  gross_sales_riel: number;
  total_sales_usd: number;
  total_sales_riel: number;
  net_revenue_usd: number;
  net_revenue_riel: number;
  average_order_value_usd: number;
  average_order_value_riel: number;
  total_earning_usd: number;
  total_earning_riel: number;
  group_by: "day" | "week" | "month" | "year";
  top_customers: Array<{
    customer_id: number | null;
    customer_name: string;
    orders_count: number;
    total_sales_usd: number;
    total_sales_riel: number;
  }>;
  top_products: Array<{
    product_id: number;
    product_name: string;
    quantity_sold: number;
    total_sales_usd: number;
    total_sales_riel: number;
  }>;
  top_refunded_customers: Array<{
    customer_id: number | null;
    customer_name: string;
    refunded_orders_count: number;
    total_refund_usd: number;
    total_refund_riel: number;
  }>;
  top_cancelled_customers: Array<{
    customer_id: number | null;
    customer_name: string;
    cancelled_orders_count: number;
    total_cancelled_usd: number;
    total_cancelled_riel: number;
  }>;
  filters?: {
    date_from?: string | null;
    date_to?: string | null;
    customer_id?: number | null;
    status?: string[];
  };
  sales_trend: SaleOrderTrendPoint[];
}

export interface SaleOrderStatisticsResponse {
  status: boolean;
  message: string;
  data: SaleOrderStatistics;
}
