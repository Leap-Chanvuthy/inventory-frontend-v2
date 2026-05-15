import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CustomersSummary } from "@/api/dashboard/dashboard.types";
import { UserCheck, ShoppingBag } from "lucide-react";

interface Props {
  data: CustomersSummary["tables"]["top_10_customers_by_revenue"];
}

const AVATAR_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
];

const RANK_STYLES: Record<number, { ring: string; rank: string }> = {
  0: { ring: "ring-amber-400 text-amber-500", rank: "text-amber-500" },
  1: { ring: "ring-slate-300 text-slate-500", rank: "text-slate-500" },
  2: { ring: "ring-amber-600/60 text-amber-700", rank: "text-amber-700" },
};

function getInitials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function fmtRevenue(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function DashboardTopCustomersTable({ data }: Props) {
  return (
    <Card className="border-border/60 shadow-sm self-start w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-emerald-500" />
          Top Customers by Revenue
        </CardTitle>
        <CardDescription>Highest revenue-generating customers</CardDescription>
      </CardHeader>

      {/* Column header */}
      <div className="grid grid-cols-[2rem_1fr_auto] border-b border-border/60 bg-muted/30 px-4 py-2.5">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">#</span>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Customer</span>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Revenue</span>
      </div>

      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {data.slice(0, 8).map((row, idx) => {
            const isTop3 = idx < 3;
            const rankStyle = RANK_STYLES[idx];
            return (
              <div
                key={row.customer_id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                {/* Rank badge */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 bg-background
                    ${isTop3 ? rankStyle.ring : "ring-border text-muted-foreground"}`}
                >
                  {idx + 1}
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
                  >
                    {getInitials(row.customer_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate leading-tight">{row.customer_name}</p>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                      <ShoppingBag className="h-2.5 w-2.5" />
                      {row.orders_count} {row.orders_count === 1 ? "order" : "orders"}
                    </span>
                  </div>
                </div>

                {/* Revenue */}
                <span className={`text-sm font-bold tabular-nums shrink-0 ${isTop3 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                  {fmtRevenue(row.total_revenue)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
