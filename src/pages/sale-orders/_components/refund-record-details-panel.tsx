import { ArrowRight, CalendarDays, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date-format";
import type { RefundRecordListItem } from "../types";

interface RefundRecordDetailsPanelProps {
  record: RefundRecordListItem | null;
  onOpenOrder: (record: RefundRecordListItem) => void;
}

export function RefundRecordDetailsPanel({ record, onOpenOrder }: RefundRecordDetailsPanelProps) {
  if (!record) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/25 p-4 text-center">
        <div>
          <p className="text-sm font-semibold text-foreground">No refund selected</p>
          <p className="mt-1 text-xs text-muted-foreground">Pick a refund record to view details and open the linked order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-muted/25 p-4">
      <div className="rounded-lg bg-card/90 p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              <ReceiptText className="h-3 w-3" />
              Refund #{record.id}
            </p>
            <h3 className="mt-0.5 text-sm font-semibold text-foreground">{record.refundNo}</h3>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold text-amber-700">${record.amountUsd.toFixed(2)}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {Math.round(record.amountRiel).toLocaleString()} KHR
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Sale Order</p>
            <p className="font-semibold text-foreground">{record.saleOrderNo}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Customer</p>
            <p className="font-semibold text-foreground">{record.customerName || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Refund Type</p>
            <p className="font-semibold text-foreground">{record.refundType.replace(/_/g, " ")}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Refund Method</p>
            <p className="font-semibold text-foreground">{record.refundMethod.replace(/_/g, " ")}</p>
          </div>
          <div className="col-span-2">
            <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              Refund Date
            </p>
            <p className="font-semibold text-foreground">
              {formatDate(record.processedAt, "dd MMM yyyy, hh:mm a")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Reason</p>
            <p className="font-semibold text-foreground">{record.reason || "-"}</p>
          </div>
        </div>

        <div className="mt-4">
          <Button size="sm" className="h-8 text-xs" onClick={() => onOpenOrder(record)}>
            Back to Completed Sale Order
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
