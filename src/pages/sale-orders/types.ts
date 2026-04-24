export type OrderStatus =
  | "DRAFT"
  | "PROCESSING"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type TopTab = "ACTIVE" | "HISTORY";

export interface Customer {
  id: string;
  name: string;
  category: "VIP" | "Regular" | "Gold";
  discount: number;
  phone: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  productId: string;
  qty: number;
  priceAtSale: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  discount: number;
  tax: number;
  note: string;
  useCategoryDiscount: boolean;
  items: OrderItem[];
  createdAt: string;
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
  refundQty: number;
  maxQty: number;
}

export interface RefundData {
  orderId: string | null;
  items: RefundItem[];
}

export interface HistoryStats {
  completed: number;
  cancelled: number;
  refunded: number;
  earnings: number;
}

export interface OrderFormState {
  id: string | null;
  customerId: string;
  items: OrderItem[];
  discount: number;
  tax: number;
  note: string;
  useCategoryDiscount: boolean;
  isEdit: boolean;
}
