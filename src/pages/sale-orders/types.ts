export type OrderStatus =
  | "DRAFT"
  | "PROCESSING"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type TopTab = "ACTIVE" | "HISTORY" | "STATISTIC";

export interface Customer {
  id: string;
  name: string;
  category: string;
  discount: number;
  phone: string;
  email?: string;
  avatar?: string | null;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  priceInRiel?: number;
  exchangeRateUsdToRiel?: number;
  exchangeRateRielToUsd?: number;
  dbId: number;
  sku?: string;
  category?: string;
}

export interface OrderItem {
  id?: number;
  productId: string;
  productDbId: number;
  productName?: string;
  productSku?: string;
  productCategory?: string;
  qty: number;
  priceAtSale: number;
  priceAtSaleRiel?: number;
  returnedQty?: number;
  refundQty?: number;
  exchangeRateUsdToRiel?: number;
}

export interface Order {
  id: string;
  dbId: number;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  status: OrderStatus;
  paymentStatus?: "PAID" | "INSTALLMENT" | "DEBT";
  discount: number; // Manual discount value when manual mode is used.
  discountPercentage: number;
  tax: number;
  note: string;
  useCategoryDiscount: boolean;
  items: OrderItem[];
  createdAt: string;
  orderDate: string;
  subtotalInUsd: number;
  subtotalInRiel: number;
  discountAmountInUsd: number;
  taxAmountInUsd: number;
  grandTotalInUsd: number;
  grandTotalInRiel: number;
  returnWindowDays?: number;
  returnValidUntil?: string;
  paidAmountInUsd?: number;
  paidAmountInRiel?: number;
  paidPercentage?: number;
  totalRefundedAmountInUsd?: number;
  totalRefundedAmountInRiel?: number;
  remainingBalanceInUsd?: number;
  remainingBalanceInRiel?: number;
  installments?: OrderInstallmentRecord[];
  refunds?: OrderRefundRecord[];
  latestRefund?: OrderRefundRecord | null;
}

export interface OrderInstallmentRecord {
  id: number;
  percentage: number;
  cumulativePercentage: number;
  amountUsd: number;
  amountRiel: number;
  paidAt: string;
  note?: string | null;
}

export interface OrderRefundItemRecord {
  id: number;
  saleOrderItemId: number;
  quantity: number;
  processReturn: boolean;
  processRefund: boolean;
  isResellable?: boolean | null;
  returnAction: "RETURN_TO_STOCK" | "SCRAP" | "NO_RETURN";
  refundPercentage: number;
  refundAmountInUsd: number;
  reason?: string | null;
  note?: string | null;
  productName?: string;
}

export interface OrderRefundRecord {
  id: number;
  refundNo: string;
  refundType: "CASH_REFUND" | "PARTIAL_REFUND" | "DISCOUNT_COMPENSATION";
  refundMethod: "CASH" | "BANK_TRANSFER" | "STORE_CREDIT" | "DISCOUNT_COMPENSATION";
  reasonType: "PRODUCT_ISSUE" | "CUSTOMER_SATISFACTION" | "COMPENSATION" | "OTHER";
  reason: string;
  totalRefundAmountInUsd: number;
  totalRefundAmountInRiel: number;
  processedAt: string;
  items: OrderRefundItemRecord[];
}

export interface OrderTotals {
  subtotal: number;
  discountVal: number;
  taxVal: number;
  total: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface RefundItem extends OrderItem {
  quantity: number;
  maxReturnQty: number;
  maxRefundQty: number;
  processReturn: boolean;
  processRefund: boolean;
  isResellable: boolean;
  returnAction: "RETURN_TO_STOCK" | "SCRAP" | "NO_RETURN";
  refundPercentage: number;
  refundAmountOverride?: number;
  reason: string;
  refundNote: string;
}

export interface RefundData {
  orderId: number | null;
  refundType: "CASH_REFUND" | "PARTIAL_REFUND" | "DISCOUNT_COMPENSATION";
  refundMethod: "CASH" | "BANK_TRANSFER" | "STORE_CREDIT" | "DISCOUNT_COMPENSATION";
  reasonType: "PRODUCT_ISSUE" | "CUSTOMER_SATISFACTION" | "COMPENSATION" | "OTHER";
  reason: string;
  items: RefundItem[];
}

export interface HistoryStats {
  completed: number;
  cancelled: number;
  refunded: number;
  earnings: number;
}

export interface RefundRecordListItem {
  id: number;
  refundNo: string;
  saleOrderDbId: number;
  saleOrderNo: string;
  customerName?: string;
  amountUsd: number;
  amountRiel: number;
  reason?: string;
  refundedItemsCount?: number;
  refundType: "CASH_REFUND" | "PARTIAL_REFUND" | "DISCOUNT_COMPENSATION";
  refundMethod: "CASH" | "BANK_TRANSFER" | "STORE_CREDIT" | "DISCOUNT_COMPENSATION";
  processedAt: string;
}

export interface OrderFormState {
  id: string | null;
  dbId: number | null;
  customerId: string;
  orderDate: string;
  returnWindowDays: number;
  items: OrderItem[];
  discount: number; // Percentage
  tax: number;
  note: string;
  useCategoryDiscount: boolean;
  isEdit: boolean;
}
