import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { ProductPnLDetailed } from "@/api/product/product.type";
import { DollarSign, Factory, Inbox, Layers, TrendingDown, TrendingUp } from "lucide-react";
import { PRODUCT_PNL_RAW_MATERIAL_SPEND_COLUMNS } from "../utils/product-pnl-table-feature";

interface ProductPnlCardProps {
  pnl: ProductPnLDetailed;
}

const money = (value?: number | null) =>
  typeof value === "number" ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";

const qty = (value?: number | null) =>
  typeof value === "number" ? value.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—";

export function ProductPnlCard({ pnl }: ProductPnlCardProps) {
  if (!pnl?.summary) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">P&L Summary</CardTitle>
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

  const isNetProfit = pnl.summary.net_profit_usd >= 0;
  const isGrossProfit = pnl.summary.gross_profit_usd >= 0;
  const isInternal = pnl.internal_manufacturing?.is_internal_product;
  const rmSpend = pnl.internal_manufacturing?.raw_material_spending;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-base">Detailed P&L</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Revenue, COGS, inventory valuation, and production spend
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{pnl.product?.sale_method || "FIFO"}</Badge>
            <Badge variant="outline">
              Rate: 1 USD = {money(pnl.currency?.usd_to_riel_rate)} Riel
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="rounded-lg border p-3 bg-blue-50/60 dark:bg-blue-950/40">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
              ${money(pnl.summary.revenue_usd)}
            </p>
            <p className="text-[11px] text-muted-foreground">៛{money(pnl.summary.revenue_riel)}</p>
          </div>

          <div className="rounded-lg border p-3 bg-amber-50/60 dark:bg-amber-950/40">
            <p className="text-xs text-muted-foreground">Sales COGS</p>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
              ${money(pnl.summary.sales_cogs_usd)}
            </p>
            <p className="text-[11px] text-muted-foreground">៛{money(pnl.summary.sales_cogs_riel)}</p>
          </div>

          <div
            className={`rounded-lg border p-3 ${
              isGrossProfit ? "bg-emerald-50/60 dark:bg-emerald-950/40" : "bg-rose-50/60 dark:bg-rose-950/40"
            }`}
          >
            <p className="text-xs text-muted-foreground">Gross Profit</p>
            <p className={`text-sm font-bold ${isGrossProfit ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
              ${money(pnl.summary.gross_profit_usd)}
            </p>
            <p className="text-[11px] text-muted-foreground">{money(pnl.summary.gross_margin_pct)}%</p>
          </div>

          <div
            className={`rounded-lg border p-3 ${
              isNetProfit ? "bg-green-50/60 dark:bg-green-950/40" : "bg-red-50/60 dark:bg-red-950/40"
            }`}
          >
            <p className="text-xs text-muted-foreground">Net Profit</p>
            <p className={`text-sm font-bold ${isNetProfit ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
              ${money(pnl.summary.net_profit_usd)}
            </p>
            <p className="text-[11px] text-muted-foreground">{money(pnl.summary.net_margin_pct)}%</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border p-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Inventory Valuation
            </p>
            <div className="text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Incoming Qty</span>
              <span className="font-semibold">{qty(pnl.inventory?.incoming_total_qty)}</span>
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Incoming Cost</span>
              <span className="font-semibold">${money(pnl.inventory?.incoming_total_cost_usd)}</span>
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Remaining Qty</span>
              <span className="font-semibold">{qty(pnl.inventory?.remaining_qty)}</span>
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Remaining Cost</span>
              <span className="font-semibold">${money(pnl.inventory?.remaining_cost_usd)}</span>
            </div>
          </div>

          <div className="rounded-lg border p-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              Cost Breakdown
            </p>
            <div className="text-sm flex items-center justify-between">
              <span className="text-muted-foreground">External Purchase</span>
              <span className="font-semibold">${money(pnl.cost_breakdown?.external_purchase?.cost_usd)}</span>
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Internal Production</span>
              <span className="font-semibold">${money(pnl.cost_breakdown?.internal_production?.cost_usd)}</span>
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Reorder</span>
              <span className="font-semibold">${money(pnl.cost_breakdown?.reorder?.cost_usd)}</span>
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Scrap Loss</span>
              <span className="font-semibold">${money(pnl.cost_breakdown?.scrap?.cost_usd)}</span>
            </div>
            <div className="text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Other Losses</span>
              <span className="font-semibold">${money(pnl.cost_breakdown?.other_losses?.cost_usd)}</span>
            </div>
          </div>
        </div>

        {isInternal && (
          <>
            <Separator />
            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5" />
                Internal Manufacturing Spend
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="rounded-md border p-2">
                  <p className="text-[11px] text-muted-foreground">Initial Production RM Cost</p>
                  <p className="text-sm font-semibold">${money(rmSpend?.initial_production_usd)}</p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="text-[11px] text-muted-foreground">Internal Reorder RM Cost</p>
                  <p className="text-sm font-semibold">${money(rmSpend?.reorder_usd)}</p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="text-[11px] text-muted-foreground">Total RM Spend</p>
                  <p className="text-sm font-semibold">${money(rmSpend?.total_usd)}</p>
                </div>
              </div>

              {Array.isArray(rmSpend?.by_raw_material) && rmSpend.by_raw_material.length > 0 && (
                <DataTable
                  columns={PRODUCT_PNL_RAW_MATERIAL_SPEND_COLUMNS}
                  data={rmSpend.by_raw_material.slice(0, 8)}
                  emptyText="No raw material spend rows."
                />
              )}
            </div>
          </>
        )}

        <div className="rounded-md border p-3 bg-muted/20">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>
              COGS is calculated from sale allocations and source-lot unit cost. For internal manufacturing lots,
              unit cost is derived from raw-material OUT movements linked by reference token.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
