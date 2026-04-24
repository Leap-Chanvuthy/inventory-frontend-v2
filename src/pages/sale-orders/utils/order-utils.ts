import type {
  Customer,
  DateRange,
  Order,
  OrderFormState,
  OrderTotals,
} from "../types";
import { RIEL_RATE } from "../constants";

export function calculateOrderTotals(
  data: Pick<Order, "customerId" | "discount" | "tax" | "useCategoryDiscount" | "items"> | OrderFormState | null,
  customers: Customer[],
): OrderTotals {
  if (!data) return { subtotal: 0, discountVal: 0, taxVal: 0, total: 0 };

  const subtotal = data.items.reduce((acc, item) => acc + item.qty * item.priceAtSale, 0);
  const customer = customers.find(c => c.id === data.customerId);
  const discountVal = data.useCategoryDiscount
    ? (subtotal * (customer?.discount || 0)) / 100
    : Number(data.discount || 0);
  const taxVal = ((subtotal - discountVal) * Number(data.tax || 0)) / 100;
  const total = subtotal - discountVal + taxVal;

  return { subtotal, discountVal, taxVal, total };
}

export function formatCurrency(value: number, currency: "USD" | "KHR" = "USD"): string {
  if (currency === "KHR") {
    return `${Math.round(value).toLocaleString()} KHR`;
  }

  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(date: string | Date, withTime = false): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";

  if (!withTime) {
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  }

  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function filterOrdersByDate(orders: Order[], dateRange: DateRange): Order[] {
  if (!dateRange.start || !dateRange.end) return orders;

  const start = new Date(dateRange.start).getTime();
  const end = new Date(dateRange.end).getTime() + 86_400_000;

  return orders.filter(order => {
    const orderTime = new Date(order.createdAt).getTime();
    return orderTime >= start && orderTime <= end;
  });
}

export function convertUsdToRiel(usd: number): number {
  return usd * RIEL_RATE;
}
