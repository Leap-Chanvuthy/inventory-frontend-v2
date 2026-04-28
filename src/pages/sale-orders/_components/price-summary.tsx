import { BadgeDollarSign } from "lucide-react";
import type { Customer, Order } from "../types";
import { calculateOrderTotals, convertUsdToRiel, formatCurrency } from "../utils/order-utils";

interface PriceSummaryProps {
  order: Order;
  customers: Customer[];
}

export function PriceSummary({ order, customers }: PriceSummaryProps) {
  const totals = calculateOrderTotals(order, customers);
  const totalRiel = order.grandTotalInRiel > 0 ? order.grandTotalInRiel : convertUsdToRiel(totals.total);

  const rows: Array<{ key: string; value: number; isDiscount: boolean; isMuted?: boolean }> = [
    { key: "Subtotal", value: totals.subtotal, isDiscount: false },
    { key: "Discount", value: totals.discountVal, isDiscount: true },
    { key: `Tax (${order.tax}%)`, value: totals.taxVal, isDiscount: false },
    { key: "Paid", value: Number(order.paidAmountInUsd ?? 0), isDiscount: false },
    { key: "Refunded", value: Number(order.totalRefundedAmountInUsd ?? 0), isDiscount: true },
    { key: "Remaining", value: Number(order.remainingBalanceInUsd ?? 0), isDiscount: false, isMuted: true },
  ];

  return (
    <div className="flex justify-end">
      <div className="w-80 space-y-3 rounded-lg border border-border bg-card p-4">
        {rows.map(row => (
          <div key={row.key} className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">{row.key}</span>
            <span className={`text-sm font-medium ${row.isDiscount ? "text-red-500" : row.isMuted ? "text-amber-600" : "text-foreground"}`}>
              {row.isDiscount ? "-" : ""}
              {formatCurrency(row.value)}
            </span>
          </div>
        ))}

        <div className="my-2 h-px w-full bg-border" />

        <div className="flex items-end justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-green-600">
            <BadgeDollarSign className="h-3.5 w-3.5" />
            Total Amount
          </span>
          <div className="text-right">
            <div className="text-2xl font-semibold text-foreground">{formatCurrency(totals.total)}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              {formatCurrency(totalRiel, "KHR")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
