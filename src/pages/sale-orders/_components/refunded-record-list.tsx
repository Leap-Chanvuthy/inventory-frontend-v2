import { Receipt, Undo2 } from "lucide-react";
import { formatDate } from "@/utils/date-format";
import type { RefundRecordListItem } from "../types";
import { EmptyState } from "./empty-state";

interface RefundedRecordListProps {
  records: RefundRecordListItem[];
  selectedRefundId: number | null;
  onSelectRefund: (record: RefundRecordListItem) => void;
  onOpenOrder: (record: RefundRecordListItem) => void;
}

export function RefundedRecordList({
  records,
  selectedRefundId,
  onSelectRefund,
  onOpenOrder,
}: RefundedRecordListProps) {
  return (
    <div className="h-full overflow-y-auto bg-muted/25 px-2 py-2">
      <div className="space-y-1.5">
        {records.map(record => {
          const isActive = selectedRefundId === record.id;

          return (
            <button
              key={record.id}
              type="button"
              onClick={() => onSelectRefund(record)}
              className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                isActive
                  ? "border-amber-500/35 bg-amber-500/10"
                  : "border-border/60 bg-card/90 hover:bg-muted/50"
              }`}
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
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-700">${record.amountUsd.toFixed(2)}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {Math.round(record.amountRiel).toLocaleString()} KHR
                  </p>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Receipt className="h-3 w-3" />
                  Refund ID #{record.id}
                </span>
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    onOpenOrder(record);
                  }}
                  className="text-primary hover:underline"
                >
                  Order {record.saleOrderNo}
                </button>
              </div>
            </button>
          );
        })}

        {records.length === 0 && (
          <EmptyState title="No refund records" description="No refunds match the current filters." />
        )}
      </div>
    </div>
  );
}
