import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SuppliersSummary } from "@/api/dashboard/dashboard.types";
import { Truck, Package, FlaskConical } from "lucide-react";

interface Props {
  data: SuppliersSummary["tables"]["top_10_suppliers_by_supplied_items"];
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

type SupplyType = "rm-only" | "products-only" | "mixed";

function getSupplyType(rm: number, prod: number): SupplyType {
  if (rm > 0 && prod > 0) return "mixed";
  if (rm > 0) return "rm-only";
  return "products-only";
}

const TYPE_CONFIG: Record<
  SupplyType,
  { label: string; className: string; dot: string }
> = {
  "rm-only": {
    label: "Raw Materials Only",
    className:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
    dot: "bg-orange-400",
  },
  "products-only": {
    label: "Products Only",
    className:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
    dot: "bg-violet-400",
  },
  mixed: {
    label: "RM + Products",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    dot: "bg-blue-400",
  },
};

export function DashboardTopSuppliersTable({ data }: Props) {
  // Summary counts by type
  const typeCounts = data.reduce(
    (acc, row) => {
      const type = getSupplyType(row.raw_materials_count, row.products_count);
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    },
    {} as Record<SupplyType, number>
  );

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          Top Suppliers
        </CardTitle>
        <CardDescription>By number of supplied items this period</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Summary strip ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          {(["mixed", "rm-only", "products-only"] as SupplyType[]).map((type) => {
            const cfg = TYPE_CONFIG[type];
            const count = typeCounts[type] ?? 0;
            return (
              <div
                key={type}
                className={`rounded-lg border px-3 py-2 text-center ${cfg.className}`}
              >
                <p className="text-base font-bold">{count}</p>
                <p className="text-[10px] leading-tight mt-0.5 opacity-80">{cfg.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Supplier rows ──────────────────────────────────── */}
        <div className="divide-y divide-border/40 -mx-6 px-0">
          {data.map((row, idx) => {
            const type = getSupplyType(row.raw_materials_count, row.products_count);
            const cfg = TYPE_CONFIG[type];
            const total = row.supplied_items_count;
            const rmPct = total > 0 ? (row.raw_materials_count / total) * 100 : 0;

            return (
              <div
                key={row.supplier_id}
                className="flex items-center gap-3 px-6 py-2.5 hover:bg-muted/30 transition-colors"
              >
                {/* Rank */}
                <span className="text-xs text-muted-foreground font-medium w-4 shrink-0 tabular-nums">
                  {idx + 1}
                </span>

                {/* Avatar */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                  {getInitials(row.supplier_name)}
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  {/* Name + type badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-foreground truncate max-w-[160px]">
                      {row.supplier_name}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0 text-[9px] font-semibold ${cfg.className}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>

                  </div>

                  {/* Split bar: RM (orange) vs Products (violet) */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden flex">
                      {row.raw_materials_count > 0 && (
                        <div
                          className="h-full bg-orange-400"
                          style={{ width: `${rmPct}%` }}
                        />
                      )}
                      {row.products_count > 0 && (
                        <div
                          className="h-full bg-violet-400"
                          style={{ width: `${100 - rmPct}%` }}
                        />
                      )}
                    </div>
                    {/* Inline counts */}
                    <div className="flex items-center gap-2 shrink-0 text-[10px] text-muted-foreground">
                      {row.raw_materials_count > 0 && (
                        <span className="flex items-center gap-0.5">
                          <FlaskConical className="h-2.5 w-2.5 text-orange-500" />
                          {row.raw_materials_count}
                        </span>
                      )}
                      {row.products_count > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Package className="h-2.5 w-2.5 text-violet-500" />
                          {row.products_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total badge */}
                <div className="shrink-0 text-center">
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {row.supplied_items_count}
                  </span>
                  <p className="text-[9px] text-muted-foreground leading-none mt-0.5">items</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Legend ────────────────────────────────────────── */}
        <div className="flex items-center gap-4 pt-1 border-t border-border/60">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Raw Materials
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            Products
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
