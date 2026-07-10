import { Receipt, Undo2 } from "lucide-react";
import { formatDate } from "@/utils/date-format";
import type { RefundRecordListItem } from "../types";
import { EmptyState } from "./empty-state";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";

interface RefundedRecordListProps {
  records: RefundRecordListItem[];
  selectedRefundId: number | null;
  onSelectRefund: (record: RefundRecordListItem) => void;
  onOpenOrder: (record: RefundRecordListItem) => void;
  isLoading?: boolean;
}

export function RefundedRecordList({
  records,
  selectedRefundId,
  onSelectRefund,
  onOpenOrder,
  isLoading = false,
}: RefundedRecordListProps) {
  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto bg-muted/25 px-2 py-2">
        <DataCardLoading text="Loading refund records..." className="min-h-[260px]" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-muted/25 px-2 py-2">
      <div className="space-y-1.5">
        {records.map(record => {
          const isActive = selectedRefundId === record.id;

          return (
            <div
              key={record.id}
              className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                isActive
                  ? "border-amber-500/35 bg-amber-500/10"
                  : "border-border/60 bg-card/90 hover:bg-muted/50"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectRefund(record)}
                className="block w-full text-left"
              >
                <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    <Undo2 className="h-3 w-3" />
                    {record.refundNo}
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">{record.customerName || "-"}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDate(record.processedAt)} · {record.refundType.replace(/_/g, " ")}
                  </p>
                  {record.reason && (
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground">Reason: {record.reason}</p>
                  )}
                  {record.items.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {record.items.slice(0, 2).map(item => (
                        <p
                          key={`${record.id}-${item.id}-${item.saleOrderItemId}`}
                          className="line-clamp-1 text-[10px] font-medium text-foreground/80"
                        >
                          {item.productName || `Item #${item.saleOrderItemId}`} · Qty {item.quantity}
                        </p>
                      ))}
                      {record.items.length > 2 && (
                        <p className="text-[10px] text-muted-foreground">
                          +{record.items.length - 2} more item{record.items.length - 2 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-700">${record.amountUsd.toFixed(2)}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {Math.round(record.amountRiel).toLocaleString()} KHR
                  </p>
                </div>
                </div>
              </button>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Receipt className="h-3 w-3" />
                  Refund ID #{record.id}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenOrder(record)}
                  className="text-primary hover:underline"
                >
                  Order {record.saleOrderNo}
                </button>
              </div>
            </div>
          );
        })}

        {records.length === 0 && (
          <EmptyState title="No refund records" description="No refunds match the current filters." />
        )}
      </div>
    </div>
  );
}
