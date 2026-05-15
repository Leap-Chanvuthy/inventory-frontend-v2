import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UomsSummary } from "@/api/dashboard/dashboard.types";
import { Package, FlaskConical, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function TrendBadge({ direction, change }: { direction: string; change: number }) {
  if (direction === "up")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-400">
        <TrendingUp className="h-2.5 w-2.5" />+{change}
      </span>
    );
  if (direction === "down")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:text-red-400">
        <TrendingDown className="h-2.5 w-2.5" />{change}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      <Minus className="h-2.5 w-2.5" />0
    </span>
  );
}

// ─── UOM Activity Heatmap ─────────────────────────────────────────────────────

interface TrendTableProps {
  data: UomsSummary["charts"]["uoms_trend_overtime"];
}

export function DashboardUomsTrendTable({ data }: TrendTableProps) {
  const active = data.filter((d) => d.uoms_count > 0);
  const total = data.reduce((s, d) => s + d.uoms_count, 0);
  const peak = Math.max(...data.map((d) => d.uoms_count), 1);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-teal-500" />
              UOM Activity
            </CardTitle>
            <CardDescription className="mt-0.5">
              {active.length} active {active.length === 1 ? "day" : "days"} · {total.toLocaleString()} total UOMs
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total UOMs</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {active.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground gap-2">
            <FlaskConical className="h-8 w-8 opacity-20" />
            No UOM activity in this period
          </div>
        ) : (
          <>
            {/* Calendar heatmap */}
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
            >
              {data.map((day) => {
                const isPeak = day.uoms_count === peak && peak > 0;
                const hasData = day.uoms_count > 0;
                const shortDate = day.label.slice(8);
                return (
                  <div key={day.date} className="group relative flex flex-col items-center gap-1">
                    <div
                      className={`w-full aspect-square rounded-md transition-all cursor-default
                        ${isPeak
                          ? "bg-teal-500 ring-2 ring-teal-300 dark:ring-teal-700 shadow-lg shadow-teal-200 dark:shadow-teal-900/50"
                          : hasData
                          ? "bg-teal-200 dark:bg-teal-700"
                          : "bg-muted"
                        }`}
                    />
                    <span className={`text-[9px] tabular-nums ${isPeak ? "font-bold text-teal-600 dark:text-teal-400" : "text-muted-foreground"}`}>
                      {shortDate}
                    </span>
                    {/* Hover tooltip */}
                    <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10
                      opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                      rounded-lg border border-border bg-popover/95 backdrop-blur-sm px-2.5 py-1.5 shadow-xl text-xs">
                      <p className="font-semibold text-foreground">{day.label}</p>
                      <p className="text-muted-foreground">
                        {day.uoms_count > 0 ? `${day.uoms_count} UOMs` : "No activity"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span>Less</span>
              <span className="h-2.5 w-2.5 rounded-sm bg-muted" />
              <span className="h-2.5 w-2.5 rounded-sm bg-teal-200 dark:bg-teal-700" />
              <span className="h-2.5 w-2.5 rounded-sm bg-teal-500" />
              <span>More</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── UOM by Products ─────────────────────────────────────────────────────────

interface ProductsProps {
  data: UomsSummary["tables"]["top_10_uom_by_products_count"];
}

export function DashboardUomByProductsTable({ data }: ProductsProps) {
  const active = data.filter((r) => r.products_count > 0);
  const totalCount = active.reduce((s, r) => s + r.products_count, 0);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              UOM by Products
            </CardTitle>
            <CardDescription>How many products use each unit of measure</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-foreground">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total products</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {active.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground gap-2">
            <Package className="h-8 w-8 opacity-20" />
            No products data this period
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {active.map((row, idx) => {
              const sharePct = totalCount > 0 ? Math.round((row.products_count / totalCount) * 100) : 0;
              return (
                <div
                  key={row.uom_id}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-muted-foreground font-medium w-3.5 shrink-0">{idx + 1}</span>
                    <span className="text-xs font-semibold text-foreground truncate">{row.uom_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{sharePct}%</span>
                    <span className="text-sm font-bold text-foreground tabular-nums">{row.products_count}</span>
                    <span className="text-[10px] text-muted-foreground">products</span>
                    <TrendBadge direction={row.trend.direction} change={row.trend.change} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── UOM by Raw Materials ────────────────────────────────────────────────────

interface RmProps {
  data: UomsSummary["tables"]["top_10_uom_by_raw_materials_count"];
}

export function DashboardUomByRmTable({ data }: RmProps) {
  const active = data.filter((r) => r.raw_materials_count > 0);
  const totalCount = active.reduce((s, r) => s + r.raw_materials_count, 0);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
              UOM by Raw Materials
            </CardTitle>
            <CardDescription>How many raw materials use each unit of measure</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-foreground">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total raw materials</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {active.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground gap-2">
            <FlaskConical className="h-8 w-8 opacity-20" />
            No raw materials data this period
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {active.map((row, idx) => {
              const sharePct = totalCount > 0 ? Math.round((row.raw_materials_count / totalCount) * 100) : 0;
              return (
                <div
                  key={row.uom_id}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-muted-foreground font-medium w-3.5 shrink-0">{idx + 1}</span>
                    <span className="text-xs font-semibold text-foreground truncate">{row.uom_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{sharePct}%</span>
                    <span className="text-sm font-bold text-foreground tabular-nums">{row.raw_materials_count}</span>
                    <span className="text-[10px] text-muted-foreground">items</span>
                    <TrendBadge direction={row.trend.direction} change={row.trend.change} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
