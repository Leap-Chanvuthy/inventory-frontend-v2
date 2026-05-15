import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-format";
import { ProductsSummary } from "@/api/dashboard/dashboard.types";
import { ClipboardList } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; className: string; dot: string }> = {
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  DRAFT: {
    label: "Draft",
    className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700",
    dot: "bg-slate-400",
  },
  ON_HOLD: {
    label: "On Hold",
    className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    dot: "bg-red-500",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    dot: "bg-purple-500",
  },
};

interface Props {
  data: ProductsSummary["tables"]["last_10_sale_orders_with_customer"];
}

function getShortOrderNum(num: string) {
  const parts = num.split("-");
  return `${parts[0]}-${parts[parts.length - 1]}`;
}

export function DashboardRecentOrdersTable({ data }: Props) {
  return (
    <Card className="border-border/60 shadow-sm self-start w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-blue-500" />
          Recent Sale Orders
        </CardTitle>
        <CardDescription>Last 10 sale orders</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr] border-b border-border/60 bg-muted/30 px-4 py-2.5 gap-3">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Order</span>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Customer</span>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center">Status</span>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Amount</span>
        </div>
        <div className="divide-y divide-border/40">
          {data.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] ?? {
              label: order.status,
              className: "bg-muted text-muted-foreground",
              dot: "bg-muted-foreground",
            };
            return (
              <div
                key={order.sale_order_id}
                className="grid grid-cols-[1fr_2fr_1fr_1fr] items-center gap-3 px-4 py-2 min-h-[100px] hover:bg-muted/30 transition-colors"
              >
                <div>
                  <div className="font-mono text-xs font-semibold text-foreground whitespace-nowrap">
                    {getShortOrderNum(order.sale_order_number)}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
                    {formatDate(order.ordered_at)}
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground truncate">
                  {order.customer_name}
                </span>
                <div className="flex justify-center">
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2 py-0.5 flex items-center justify-center gap-1 w-full ${statusCfg.className}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                    {statusCfg.label}
                  </Badge>
                </div>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm text-right whitespace-nowrap">
                  ${order.total_amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
