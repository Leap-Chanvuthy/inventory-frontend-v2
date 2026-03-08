/**
 * UomHierarchyPreview
 *
 * Reusable component for raw material forms.
 * Displays the full UOM hierarchy for a given category and — when a quantity
 * is supplied — converts it in real time across every unit in the tree.
 *
 * Conversion rule (matches backend model):
 *   conversion_factor = "how many base units are in 1 of this unit"
 *   ⟹  displayQty = quantity / node.conversion_factor
 *
 * Usage:
 *   <UomHierarchyPreview categoryId={5} quantity={100} />
 */

import { useUOMs } from "@/api/uom/uom.query";
import { UOM } from "@/api/uom/uom.types";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Layers, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UomHierarchyPreviewProps {
  /** Category whose units should be displayed. */
  categoryId: number;
  /**
   * Quantity entered by the user, expressed in the base unit.
   * When provided (> 0), each row shows the proportional amount.
   * When omitted, each row shows its conversion ratio instead.
   */
  quantity?: number;
}

interface FlatNode {
  uom: UOM;
  depth: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a depth-first ordered flat list from a potentially unordered UOM array. */
function buildFlatTree(uoms: UOM[]): FlatNode[] {
  const allIds = new Set(uoms.map(u => u.id));

  // Roots = base unit flag OR no parent in the current set
  const roots = uoms.filter(
    u => !!u.is_base_unit || !u.base_uom_id || !allIds.has(u.base_uom_id),
  );

  function descendants(parentId: number, depth: number): FlatNode[] {
    const direct = uoms.filter(
      u => u.base_uom_id === parentId && u.id !== parentId,
    );
    const result: FlatNode[] = [];
    for (const child of direct) {
      result.push({ uom: child, depth });
      result.push(...descendants(child.id, depth + 1));
    }
    return result;
  }

  const flat: FlatNode[] = [];
  for (const root of roots) {
    flat.push({ uom: root, depth: 0 });
    flat.push(...descendants(root.id, 1));
  }
  return flat;
}

function formatNum(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1_000)
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (n % 1 === 0) return n.toLocaleString();
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export function UomHierarchyPreview({
  categoryId,
  quantity,
}: UomHierarchyPreviewProps) {
  const { data, isLoading } = useUOMs({
    "filter[category_id]": categoryId,
    per_page: 100,
  } as any);

  // getUOMs returns PaginatedData<UOM> — extract the array
  const uoms: UOM[] = (data as any)?.data ?? [];
  const flatTree = buildFlatTree(uoms);
  const baseUnit = uoms.find(u => !!u.is_base_unit);

  const hasQty =
    quantity != null && !isNaN(quantity) && isFinite(quantity) && quantity > 0;

  // ── Loading ──────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading unit hierarchy…
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────

  if (uoms.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2 italic">
        No units found for this category.
      </p>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-1 w-full">

      {/* Contextual header when a quantity is entered */}
      {hasQty && baseUnit && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <Layers className="h-3.5 w-3.5 shrink-0" />
          <span>
            Showing conversions for{" "}
            <strong className="text-foreground">
              {formatNum(quantity!)} {baseUnit.symbol ?? baseUnit.name}
            </strong>
          </span>
        </div>
      )}

      {flatTree.map((node, idx) => {
        const factor = Number(node.uom.conversion_factor) || 1;
        const isBase = !!node.uom.is_base_unit;
        const indented = node.depth > 0;

        // Converted quantity: how much of *this* unit equals the input base qty
        const convertedQty = hasQty ? quantity! / factor : null;

        // Ratio label shown when no quantity is set (non-base rows only)
        const ratioLabel = !isBase ? `× ${formatNum(factor)}` : null;

        return (
          <div key={node.uom.id}>
            {/* Connector arrow between rows */}
            {idx > 0 && (
              <div
                className={cn(
                  "flex items-center py-0.5",
                  indented ? "ml-6" : "ml-2",
                )}
              >
                <ArrowDown className="h-3 w-3 text-muted-foreground/40" />
              </div>
            )}

            {/* UOM Row */}
            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors",
                isBase
                  ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/40"
                  : "border-border bg-card",
                indented && "ml-4",
              )}
            >
              {/* Left: unit name + symbol tag + badge */}
              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                <span className={cn("font-medium leading-tight", isBase && "text-emerald-800 dark:text-emerald-300")}>
                  {node.uom.name}
                </span>
                {node.uom.symbol && (
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {node.uom.symbol}
                  </span>
                )}
                {isBase && (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px] font-semibold uppercase tracking-wide border border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800">
                    Base Unit
                  </Badge>
                )}
              </div>

              {/* Right: converted qty or ratio */}
              <div className="ml-3 shrink-0 text-right">
                {convertedQty !== null ? (
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      isBase
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-foreground",
                    )}
                  >
                    {formatNum(convertedQty)}
                    {node.uom.symbol && (
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        {node.uom.symbol}
                      </span>
                    )}
                  </span>
                ) : ratioLabel ? (
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {ratioLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
