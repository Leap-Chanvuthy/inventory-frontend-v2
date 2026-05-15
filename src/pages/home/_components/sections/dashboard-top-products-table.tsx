import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, User, ShoppingBasket } from "lucide-react";
import { ProductsSummary } from "@/api/dashboard/dashboard.types";

interface Props {
  data: ProductsSummary["tables"]["top_10_most_selling_products_with_customer"];
}

const fmtRevenue = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;


const fmtQty = (n: number) =>
  n % 1 === 0 ? `${n.toFixed(0)}` : `${n.toFixed(2)}`;

const RANK_RING = [
  "ring-amber-400 text-amber-500",   // 1st
  "ring-slate-300 text-slate-400",   // 2nd
  "ring-amber-600 text-amber-700",   // 3rd
];

export function DashboardTopProductsTable({ data }: Props) {


  return (
    <Card className="border-border/60 shadow-sm self-start w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ShoppingBasket className="h-4 w-4 text-amber-500" />
          Top Selling Products
        </CardTitle>
        <CardDescription>Ranked by quantity sold this period</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[2rem_1fr_auto] border-b border-border/60 bg-muted/30 px-4 py-2.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">#</span>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Product</span>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Revenue</span>
        </div>
        <div className="divide-y divide-border/40">
          {data.map((row, idx) => {
            const isUp = row.trend.direction === "up";
            const hasChange = row.trend.percentage_change !== null;
            const isTop3 = idx < 3;

            return (
              <div
                key={row.product_id}
                className="flex items-center gap-3 px-4 py-2 min-h-[100px] hover:bg-muted/30 transition-colors"
              >
                {/* ── Rank badge ── */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 bg-background
                    ${isTop3 ? RANK_RING[idx] : "ring-border text-muted-foreground"}`}
                >
                  {idx + 1}
                </div>

                {/* ── Main content ── */}
                <div className="flex-1 min-w-0">
                  {/* Product name */}
                  <Link
                    to={`/products/view/${row.product_id}`}
                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {row.product_name}
                  </Link>

                  {/* Qty + Revenue inline */}
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground">{fmtQty(row.total_quantity_sold)}</span> units sold
                    </span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-[11px] text-muted-foreground">
                      Revenue: <span className="font-medium text-foreground">{fmtRevenue(row.total_revenue)}</span>
                    </span>
                  </div>

                  {/* Top customer */}
                  {row.top_customer && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <User className="h-2.5 w-2.5 shrink-0 text-muted-foreground/50" />
                      <span className="text-[10px] text-muted-foreground/60 shrink-0">Top buyer:</span>
                      <span className="text-[11px] text-muted-foreground truncate">
                        {row.top_customer.customer_name}
                      </span>
                      <span className="text-[11px] text-muted-foreground/60 shrink-0 tabular-nums">
                        · spent {fmtRevenue(row.top_customer.revenue)}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Right: revenue + trend ── */}
                <div className="shrink-0 text-right flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {fmtRevenue(row.total_revenue)}
                  </span>

                  {hasChange ? (
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold
                        ${isUp
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                    >
                      {isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      {row.trend.percentage_change_display}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/50">New</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
