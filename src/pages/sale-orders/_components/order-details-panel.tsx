import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Edit3,
  FileText,
  MoreVertical,
  PauseCircle,
  Printer,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  onDownloadInvoice: (order: Order) => Promise<void> | void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
  onUpdatePayment: (
    orderId: number,
    payload: {
      payment_status: PaymentStatus;
      payment_percentage?: number;
      installment_note?: string;
    },
  ) => Promise<void>;
  onUpdateLatestInstallment: (
    orderId: number,
    payload: {
      payment_percentage: number;
      note?: string;
      paid_at?: string;
    },
  ) => Promise<void>;
  onOpenRefund: (order: Order) => void;
  onViewRefundRecords?: () => void;
  onViewRefundDetail?: (refundId: number) => void;
}

export function OrderDetailsPanel({
  order,
  customer,
  customers,
  onEdit,
  onDownloadInvoice,
  onUpdateStatus,
  onUpdatePayment,
  onUpdateLatestInstallment,
  onOpenRefund,
  onViewRefundRecords,
  onViewRefundDetail,
}: OrderDetailsPanelProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("INSTALLMENT");
  const [paymentPercentage, setPaymentPercentage] = useState("0");
  const [installmentNote, setInstallmentNote] = useState("");
  const [latestInstallmentPercentage, setLatestInstallmentPercentage] = useState("0");
  const [latestInstallmentNote, setLatestInstallmentNote] = useState("");
  const [isEditingLatestInstallment, setIsEditingLatestInstallment] = useState(false);

  useEffect(() => {
    setPaymentStatus((order.paymentStatus as PaymentStatus) || "INSTALLMENT");
    setInstallmentNote("");
  }, [order]);

  useEffect(() => {
    const remainingPercentage = Math.max(0, 100 - Number(order.paidPercentage ?? 0));
    setPaymentPercentage(
      paymentStatus === "PAID"
        ? String(remainingPercentage > 0 ? remainingPercentage : 0)
        : String(remainingPercentage > 0 ? Math.min(remainingPercentage, 10) : 0),
    );
  }, [order, paymentStatus]);

  const installments = Array.isArray(order.installments) ? order.installments : [];
  const latestInstallment = installments.length > 0 ? installments[installments.length - 1] : null;

  useEffect(() => {
    if (!latestInstallment) {
      setLatestInstallmentPercentage("0");
      setLatestInstallmentNote("");
      return;
    }

    setLatestInstallmentPercentage(String(Number(latestInstallment.percentage ?? 0)));
    setLatestInstallmentNote(latestInstallment.note || "");
  }, [latestInstallment?.id, latestInstallment?.percentage, latestInstallment?.note]);

  const canChangePaymentType = order.status === "DRAFT";
  const canRecordPayment = !["CANCELLED", "REFUNDED"].includes(order.status);
  const currentPaidPercentage = Number(order.paidPercentage ?? 0);
  const remainingPercentage = Math.max(0, 100 - currentPaidPercentage);
  const isFullyPaid = remainingPercentage <= 0;
  const canEditLatestInstallment =
    canRecordPayment &&
    !!latestInstallment &&
    !isFullyPaid &&
    Number(latestInstallment?.cumulativePercentage ?? 0) < 100;

  const handleSavePayment = async () => {
    const nextPaymentPercentage =
      paymentStatus === "PAID"
        ? remainingPercentage
        : Number(paymentPercentage || 0);
    if (nextPaymentPercentage <= 0) {
      return;
    }

    await onUpdatePayment(order.dbId, {
      payment_status: paymentStatus,
      payment_percentage: nextPaymentPercentage,
      installment_note: installmentNote || undefined,
    });
  };

  const handleUpdateLatestInstallment = async () => {
    if (!latestInstallment || !canEditLatestInstallment) return;

    const nextPercentage = Number(latestInstallmentPercentage || 0);
    if (nextPercentage <= 0) return;

    await onUpdateLatestInstallment(order.dbId, {
      payment_percentage: nextPercentage,
      note: latestInstallmentNote || undefined,
    });
    setIsEditingLatestInstallment(false);
  };

  const installmentPreviewUsd = (Number(order.grandTotalInUsd || 0) * Number(paymentPercentage || 0)) / 100;
  const installmentPreviewRiel = (Number(order.grandTotalInRiel || 0) * Number(paymentPercentage || 0)) / 100;

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
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-blue-600"
            onClick={() => onDownloadInvoice(order)}
          >
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
              <Select
                value={paymentStatus}
                onValueChange={value => setPaymentStatus(value as PaymentStatus)}
                disabled={!canChangePaymentType || isFullyPaid}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="INSTALLMENT">Installment</SelectItem>
                  <SelectItem value="DEBT">Debt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">New Payment Percentage (%)</p>
              <div className="space-y-2 rounded-md border border-border/70 bg-muted/25 px-2.5 py-2">
                {paymentStatus === "PAID" ? (
                  <div className="rounded-md border border-green-500/25 bg-green-500/10 px-2.5 py-2 text-[11px] text-green-700">
                    PAID selected. Remaining {remainingPercentage.toFixed(2)}% will be settled automatically.
                  </div>
                ) : (
                  <Input
                    type="number"
                    min={0.01}
                    max={remainingPercentage}
                    step="0.01"
                    value={paymentPercentage}
                    disabled={!canRecordPayment || remainingPercentage <= 0}
                    className="h-8"
                    onChange={event => setPaymentPercentage(event.target.value)}
                  />
                )}
                <p className="text-[10px] text-muted-foreground">
                  Enter payment percentage. The system will calculate USD and KHR automatically.
                </p>
                <p className="text-[10px] text-muted-foreground">
                  New Amount: USD {installmentPreviewUsd.toFixed(2)} · KHR {Math.round(installmentPreviewRiel).toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Total Paid: {currentPaidPercentage.toFixed(2)}% · Remaining: {remainingPercentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Installment Note</p>
            <Input
              value={installmentNote}
              onChange={event => setInstallmentNote(event.target.value)}
              disabled={!canRecordPayment || remainingPercentage <= 0}
              className="h-8"
              placeholder="Optional note for this installment"
            />
          </div>

          {canRecordPayment && (
            <div className="mt-3 flex justify-end">
              <Button size="sm" className="h-8 text-xs" onClick={handleSavePayment} disabled={remainingPercentage <= 0}>
                Record Payment
              </Button>
            </div>
          )}

          {Array.isArray(order.installments) && order.installments.length > 0 && (
            <div className="mt-3 rounded-md border border-border/70 bg-muted/20 p-2.5">
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
                <span>Installment History</span>
                <span>
                  Paid {Number(order.paidPercentage ?? 0).toFixed(2)}% · Remaining {Math.max(0, 100 - Number(order.paidPercentage ?? 0)).toFixed(2)}%
                </span>
              </div>
              <div className="space-y-1.5">
                {installments.map(installment => {
                  const isLatest = latestInstallment?.id === installment.id;
                  return (
                    <div key={installment.id} className="rounded-md bg-card/70 px-2 py-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-foreground">
                          {installment.percentage.toFixed(2)}% ({installment.cumulativePercentage.toFixed(2)}% total)
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            ${installment.amountUsd.toFixed(2)} · {formatDate(installment.paidAt)}
                          </span>
                          {isLatest && canEditLatestInstallment && !isEditingLatestInstallment && (
                            <TooltipProvider delayDuration={150}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                    onClick={() => setIsEditingLatestInstallment(true)}
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Edit latest installment</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                      {isLatest && (
                        <div className="mt-2 rounded border border-border/70 bg-muted/30 p-2">
                          {canEditLatestInstallment ? (
                            <>
                              {isEditingLatestInstallment ? (
                                <>
                                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    Edit Latest Installment
                                  </p>
                                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                    <Input
                                      type="number"
                                      min={0.01}
                                      max={100}
                                      step="0.01"
                                      value={latestInstallmentPercentage}
                                      className="h-7"
                                      onChange={event => setLatestInstallmentPercentage(event.target.value)}
                                    />
                                    <Input
                                      value={latestInstallmentNote}
                                      className="h-7 md:col-span-2"
                                      onChange={event => setLatestInstallmentNote(event.target.value)}
                                      placeholder="Optional note"
                                    />
                                  </div>
                                  <div className="mt-2 flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-[11px]"
                                      onClick={() => setIsEditingLatestInstallment(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button size="sm" className="h-7 text-[11px]" onClick={handleUpdateLatestInstallment}>
                                      Update Latest Installment
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <p className="text-[10px] text-muted-foreground">
                                  Click the edit icon on this row to modify the latest installment.
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-[10px] text-muted-foreground">
                              Latest installment cannot be edited once payment reaches 100%.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
        <ProductTable order={order} />
        {Array.isArray(order.refunds) && order.refunds.length > 0 && (
          <section className="space-y-3 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Refund History</h3>
              {onViewRefundRecords && (
                <button
                  type="button"
                  onClick={onViewRefundRecords}
                  className="text-[11px] font-medium text-amber-700 hover:underline"
                >
                  View refund records
                </button>
              )}
            </div>
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
                <p className="mt-1 text-xs text-muted-foreground">
                  Refunded items: {refund.items.length}
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
                {onViewRefundDetail && (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px]"
                      onClick={() => onViewRefundDetail(refund.id)}
                    >
                      View Refund Detail
                    </Button>
                  </div>
                )}
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
              onClick={() => onUpdateStatus(order.dbId, "CANCELLED")}
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
              onClick={() => onUpdateStatus(order.dbId, "PROCESSING")}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Process Order <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </>
        )}

        {order.status === "PROCESSING" && (
          <>
            <button
              onClick={() => onUpdateStatus(order.dbId, "CANCELLED")}
              className="rounded-md px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onUpdateStatus(order.dbId, "ON_HOLD")}
              className="flex items-center gap-2 rounded-md bg-amber-500/90 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-amber-500"
            >
              <PauseCircle className="h-3.5 w-3.5" />
              Move to On Hold
            </button>
            <button
              onClick={() => onUpdateStatus(order.dbId, "COMPLETED")}
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
              onClick={() => onUpdateStatus(order.dbId, "CANCELLED")}
              className="rounded-md px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              Cancel Order
            </button>
            <button
              onClick={() => onUpdateStatus(order.dbId, "COMPLETED")}
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
