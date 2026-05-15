import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RawMaterialsSummary } from "@/api/dashboard/dashboard.types";
import { FlaskConical, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface TopUsedProps {
  data: RawMaterialsSummary["tables"]["top_10_most_used_raw_materials_in_production"];
}

export function DashboardTopUsedRmTable({ data }: TopUsedProps) {
  const max = Math.max(...data.map((r) => r.total_used_quantity), 1);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-orange-500" />
          Top Used Raw Materials
        </CardTitle>
        <CardDescription>By quantity used in production</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-1">
        {data.slice(0, 8).map((row, idx) => {
          const pct = (row.total_used_quantity / max) * 100;
          return (
            <div key={row.raw_material_id} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{idx + 1}</span>
                  <span className="text-xs font-medium text-foreground truncate">{row.raw_material_name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] text-muted-foreground">{row.uom_name}</span>
                  <span className="text-xs font-semibold text-foreground tabular-nums">
                    {row.total_used_quantity >= 1000
                      ? `${(row.total_used_quantity / 1000).toFixed(1)}K`
                      : row.total_used_quantity.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-500/70 group-hover:bg-orange-500 transition-colors"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

interface ExpensiveProps {
  data: RawMaterialsSummary["tables"]["top_10_expensive_raw_materials"];
}

export function DashboardExpensiveRmTable({ data }: ExpensiveProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-amber-500" />
          Most Expensive Raw Materials
        </CardTitle>
        <CardDescription>By latest unit price (USD)</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="text-left px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-6">#</th>
                <th className="text-left px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Material</th>
                <th className="text-right px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-right px-4 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.map((row, idx) => {
                const isUp = row.trend.direction === "up";
                const hasChange = row.trend.percentage_change !== null;
                return (
                  <tr key={row.raw_material_id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{idx + 1}</td>
                    <td className="px-4 py-2.5 max-w-[160px]">
                      <p className="font-medium text-xs truncate">{row.raw_material_name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{row.supplier_name}</p>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-amber-700 dark:text-amber-400 text-sm">
                      ${row.unit_price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {hasChange ? (
                        <span
                          className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
                            isUp
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {row.trend.percentage_change_display}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">New</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
