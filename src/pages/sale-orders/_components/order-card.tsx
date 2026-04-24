import { Clock } from "lucide-react";
import type { Customer, Order, OrderStatus } from "../types";
import { calculateOrderTotals, convertUsdToRiel, formatCurrency } from "../utils/order-utils";
import { OrderStatusBadge } from "./order-status-badge";

interface OrderCardProps {
  order: Order;
  customer?: Customer;
  isActive: boolean;
  onClick: () => void;
  customers: Customer[];
}

const STATUS_STRIP: Record<OrderStatus, string> = {
  DRAFT: "bg-muted-foreground/60",
  PROCESSING: "bg-blue-500",
  ON_HOLD: "bg-amber-500",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-red-500",
  REFUNDED: "bg-purple-500",
};

function getCustomerInitial(customerName: string) {
  return customerName.trim().charAt(0).toUpperCase() || "?";
}

export function OrderCard({ order, customer, isActive, onClick, customers }: OrderCardProps) {
  const { total } = calculateOrderTotals(order, customers);
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
  const customerName = customer?.name ?? order.customerId;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-lg border px-3 py-2.5 text-left transition-all duration-200 ${
        isActive
          ? "border-primary/30 bg-primary/5 shadow-md"
          : "border-border bg-card shadow-sm hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${STATUS_STRIP[order.status]}`} />

      <div className="flex items-start justify-between gap-2 pl-1">
        <div className="min-w-0 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {getCustomerInitial(customerName)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{order.id}</p>
            <p className="truncate text-sm font-semibold text-foreground">{customerName}</p>
          </div>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-2 flex items-end justify-between gap-3 pl-1">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{itemCount} items</p>
          <p className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {new Date(order.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
            {" · "}
            {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{formatCurrency(total)}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {formatCurrency(convertUsdToRiel(total), "KHR")}
          </p>
        </div>
      </div>
    </button>
  );
}
