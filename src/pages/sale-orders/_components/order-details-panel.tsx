import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  FileText,
  MoreVertical,
  PauseCircle,
  Printer,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer, Order, OrderStatus } from "../types";
import { formatDate } from "../utils/order-utils";
import { CustomerInfoCard } from "./customer-info-card";
import { OrderStatusBadge } from "./order-status-badge";
import { PriceSummary } from "./price-summary";
import { ProductTable } from "./product-table";

interface OrderDetailsPanelProps {
  order: Order;
  customer?: Customer;
  customers: Customer[];
  onEdit: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onOpenRefund: (order: Order) => void;
}

export function OrderDetailsPanel({
  order,
  customer,
  customers,
  onEdit,
  onUpdateStatus,
  onOpenRefund,
}: OrderDetailsPanelProps) {
  return (
    <div className="flex h-full flex-1 flex-col animate-in slide-in-from-right-4 duration-300">
      <header className="z-10 flex h-16 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-blue-500/10 p-1.5">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight">{order.id}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Placed on {formatDate(order.createdAt, true)}</p>
          </div>
          <div className="ml-1">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto bg-background p-4">
        <CustomerInfoCard order={order} customer={customer} />
        <ProductTable order={order} />
        <PriceSummary order={order} customers={customers} />
      </div>

      <footer className="z-10 flex justify-end gap-2 border-t border-border bg-card p-2">
        {order.status === "DRAFT" && (
          <>
            <button
              onClick={() => onUpdateStatus(order.id, "CANCELLED")}
              className="rounded-md px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onEdit(order)}
              className="rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              Edit Order
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, "PROCESSING")}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Process Order <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </>
        )}

        {order.status === "PROCESSING" && (
          <>
            <button
              onClick={() => onUpdateStatus(order.id, "CANCELLED")}
              className="rounded-md px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, "ON_HOLD")}
              className="flex items-center gap-2 rounded-md bg-amber-500/90 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-amber-500"
            >
              <PauseCircle className="h-3.5 w-3.5" />
              Move to On Hold
            </button>
          </>
        )}

        {order.status === "ON_HOLD" && (
          <>
            <button
              onClick={() => onUpdateStatus(order.id, "CANCELLED")}
              className="rounded-md px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, "COMPLETED")}
              className="flex items-center gap-2 rounded-md bg-green-600/90 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-green-600"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Complete Order
            </button>
          </>
        )}

        {order.status === "COMPLETED" && (
          <button
            onClick={() => onOpenRefund(order)}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Refund Items
          </button>
        )}

        {(["CANCELLED", "REFUNDED"] as OrderStatus[]).includes(order.status) && (
          <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[11px] uppercase tracking-wide text-amber-700">
            <AlertCircle className="h-3.5 w-3.5" />
            Read-only archive
          </div>
        )}
      </footer>
    </div>
  );
}
