import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SaleOrdersSummary } from "@/api/dashboard/dashboard.types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingBag } from "lucide-react";

interface Props {
  data: SaleOrdersSummary["metrics"]["sale_orders_by_status"];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; fill: string }> = {
  completed: { label: "Completed", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", fill: "#10b981" },
  processing: { label: "Processing", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", fill: "#3b82f6" },
  draft: { label: "Draft", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/40", fill: "#94a3b8" },
  on_hold: { label: "On Hold", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", fill: "#f59e0b" },
  cancelled: { label: "Cancelled", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", fill: "#ef4444" },
  refunded: { label: "Refunded", color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30", fill: "#a855f7" },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const cfg = STATUS_CONFIG[name.toLowerCase()] ?? { label: name, fill: "#888" };
  return (
    <div className="rounded-lg border border-border bg-popover/95 backdrop-blur-sm p-2.5 shadow-xl text-xs">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ background: cfg.fill }} />
        <span className="font-semibold text-foreground">{cfg.label}</span>
      </div>
      <p className="mt-1 text-muted-foreground">{value} orders</p>
    </div>
  );
};

export function DashboardSaleOrderStatus({ data }: Props) {
  const total = data.reduce((s, d) => s + d.current, 0);
  const chartData = data
    .filter((d) => d.current > 0)
    .map((d) => ({ name: d.status, value: d.current }));

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-blue-500" />
          Order Status Breakdown
        </CardTitle>
        <CardDescription>{total} total orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-5">
          {/* Donut chart — top */}
          <div className="relative flex-shrink-0">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry) => {
                    const cfg = STATUS_CONFIG[entry.name.toLowerCase()];
                    return <Cell key={entry.name} fill={cfg?.fill ?? "#888"} />;
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-foreground">{total}</span>
              <span className="text-[10px] text-muted-foreground">Orders</span>
            </div>
          </div>

          {/* Legend list — bottom */}
          <div className="w-full space-y-2">
            {data.map((d) => {
              const cfg = STATUS_CONFIG[d.status.toLowerCase()];
              const pct = total > 0 ? ((d.current / total) * 100).toFixed(0) : "0";
              return (
                <div key={d.status} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ background: cfg?.fill ?? "#888" }}
                    />
                    <span className="text-xs text-muted-foreground truncate">
                      {cfg?.label ?? d.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-foreground tabular-nums">
                      {d.current}
                    </span>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
