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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentStatus } from "@/api/sale-orders/sale-order.types";
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
  onUpdatePayment: (
    orderId: string,
    payload: { payment_status: PaymentStatus; paid_amount_in_usd?: number; paid_amount_in_riel?: number },
  ) => Promise<void>;
  onOpenRefund: (order: Order) => void;
}

export function OrderDetailsPanel({
  order,
  customer,
  customers,
  onEdit,
  onUpdateStatus,
  onUpdatePayment,
  onOpenRefund,
}: OrderDetailsPanelProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("UNPAID");
  const [paidUsd, setPaidUsd] = useState("0");
  const [paidRiel, setPaidRiel] = useState("0");

  useEffect(() => {
    setPaymentStatus((order.paymentStatus as PaymentStatus) || "UNPAID");
    setPaidUsd(String(Number(order.paidAmountInUsd ?? 0)));
    setPaidRiel(String(Number(order.paidAmountInRiel ?? 0)));
  }, [order]);

  const canEditPayment = ["PROCESSING", "ON_HOLD", "COMPLETED"].includes(order.status);

  const handleSavePayment = async () => {
    await onUpdatePayment(order.id, {
      payment_status: paymentStatus,
      paid_amount_in_usd: Number(paidUsd || 0),
      paid_amount_in_riel: Number(paidRiel || 0),
    });
  };

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

      <div className="flex-1 space-y-4 overflow-y-auto bg-muted/20 p-4">
        <CustomerInfoCard order={order} customer={customer} />
        <section className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Payment Tracking
            </h3>
            <span className="text-[11px] text-muted-foreground">
              Remaining: {Number(order.remainingBalanceInUsd ?? 0).toFixed(2)} USD
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Payment Status</p>
              <Select value={paymentStatus} onValueChange={value => setPaymentStatus(value as PaymentStatus)} disabled={!canEditPayment}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                  <SelectItem value="DEBT">Debt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Paid (USD)</p>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={paidUsd}
                disabled={!canEditPayment}
                className="h-8"
                onChange={event => setPaidUsd(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Paid (KHR)</p>
              <Input
                type="number"
                min="0"
                step="1"
                value={paidRiel}
                disabled={!canEditPayment}
                className="h-8"
                onChange={event => setPaidRiel(event.target.value)}
              />
            </div>
          </div>
          {canEditPayment && (
            <div className="mt-3 flex justify-end">
              <Button size="sm" className="h-8 text-xs" onClick={handleSavePayment}>
                Save Payment
              </Button>
            </div>
          )}
        </section>
        <ProductTable order={order} />
        {Array.isArray(order.refunds) && order.refunds.length > 0 && (
          <section className="space-y-3 rounded-lg border border-border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Refund History</h3>
            {order.refunds.map(refund => (
              <article key={refund.id} className="rounded-md border border-border bg-muted/30 p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{refund.refundNo}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDate(refund.processedAt, true)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      {Number(refund.totalRefundAmountInUsd).toFixed(2)} USD
                    </p>
                    <p className="text-[11px] text-muted-foreground">{refund.refundMethod}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Type: {refund.refundType.replace(/_/g, " ")} • Reason: {refund.reason}
                </p>
                <div className="mt-2 space-y-1">
                  {refund.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">
                        {item.productName || `Item #${item.saleOrderItemId}`} • Qty {item.quantity}
                      </span>
                      <span className="text-muted-foreground">
                        {item.processReturn
                          ? item.isResellable
                            ? "Returned to stock"
                            : "Scrapped"
                          : "No return"}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}
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
            <button
              onClick={() => onUpdateStatus(order.id, "COMPLETED")}
              className="flex items-center gap-2 rounded-md bg-green-600/90 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-green-600"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Complete Order
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
