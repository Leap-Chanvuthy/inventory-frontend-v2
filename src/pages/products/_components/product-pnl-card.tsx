import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Inbox } from "lucide-react";
import { ProductPnL } from "@/api/product/product.type";

interface ProductPnlCardProps {
  pnl: ProductPnL;
}

const fmt = (value: number | null | undefined) =>
  value != null ? value.toLocaleString() : "—";

export function ProductPnlCard({ pnl }: ProductPnlCardProps) {
  if (!pnl.costs) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-base">P&L Summary</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Revenue, costs and profit overview
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Inbox className="h-8 w-8" />
            <p className="text-sm">No P&L summary data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalCost =
    (pnl.costs.purchase.total_usd ?? 0) +
    (pnl.costs.reorder.total_usd ?? 0) +
    (pnl.costs.scrap.total_usd ?? 0);

  const totalCostRiel =
    (pnl.costs.purchase.total_riel ?? 0) +
    (pnl.costs.reorder.total_riel ?? 0) +
    (pnl.costs.scrap.total_riel ?? 0);

  const isProfit = pnl.net_profit_usd >= 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950">
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-base">P&L Summary</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Revenue, costs and profit overview
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key numbers */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Revenue</p>
            <p className="text-sm font-bold text-blue-600">
              ${fmt(pnl.revenue_usd)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              ៛{fmt(pnl.revenue_riel)}
            </p>
          </div>
          <div className="rounded-lg bg-orange-50 dark:bg-orange-950 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
            <p className="text-sm font-bold text-orange-600">
              ${fmt(totalCost)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              ៛{fmt(totalCostRiel)}
            </p>
          </div>
          <div
            className={`rounded-lg p-3 text-center ${
              isProfit
                ? "bg-green-50 dark:bg-green-950"
                : "bg-red-50 dark:bg-red-950"
            }`}
          >
            <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
            <p
              className={`text-sm font-bold ${
                isProfit ? "text-green-600" : "text-red-600"
              }`}
            >
              {isProfit ? "+" : ""}${fmt(pnl.net_profit_usd)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              ៛{fmt(pnl.net_profit_riel)}
            </p>
          </div>
        </div>

        {/* Cost breakdown */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Cost Breakdown
          </p>
          <div className="space-y-2">
            {[
              {
                label: "Purchase",
                count: pnl.costs.purchase.count,
                usd: pnl.costs.purchase.total_usd,
                riel: pnl.costs.purchase.total_riel,
              },
              {
                label: "Reorder",
                count: pnl.costs.reorder.count,
                usd: pnl.costs.reorder.total_usd,
                riel: pnl.costs.reorder.total_riel,
              },
              {
                label: "Scrap Loss",
                count: pnl.costs.scrap.count,
                usd: pnl.costs.scrap.total_usd,
                riel: pnl.costs.scrap.total_riel,
              },
              {
                label: "Sales COGS",
                count: pnl.costs.sales.count,
                usd: pnl.costs.sales.cogs_usd,
                riel: pnl.costs.sales.cogs_riel,
              },
            ].map(item => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{item.label}</span>
                  {item.count > 0 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {item.count}x
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      (item.usd ?? 0) > 0
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    ${fmt(item.usd)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    ៛{fmt(item.riel)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
