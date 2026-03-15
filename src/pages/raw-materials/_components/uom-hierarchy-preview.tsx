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

import { useMemo, useState } from "react";
import { useUOMs } from "@/api/uom/uom.query";
import { UOM } from "@/api/uom/uom.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  /** Optional row highlight (e.g. currently assigned UOM/base UOM) */
  highlightUomId?: number;
  /** default view mode */
  defaultViewMode?: "hierarchy" | "card";
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
  highlightUomId,
  defaultViewMode = "hierarchy",
}: UomHierarchyPreviewProps) {
  const { data, isLoading } = useUOMs({
    "filter[category_id]": categoryId,
    per_page: 100,
  } as any);

  // getUOMs returns PaginatedData<UOM> — extract the array
  const uoms: UOM[] = (data as any)?.data ?? [];
  const flatTree = buildFlatTree(uoms);
  const baseUnit =
    uoms.find(u => !!u.is_base_unit) ||
    [...uoms].sort(
      (a, b) => Number(a.conversion_factor || 0) - Number(b.conversion_factor || 0),
    )[0];

  const [viewMode, setViewMode] = useState<"hierarchy" | "card">(defaultViewMode);

  const hasQty =
    quantity != null && !isNaN(quantity) && isFinite(quantity) && quantity > 0;

  const nonBaseUoms = useMemo(
    () => uoms.filter(u => !baseUnit || u.id !== baseUnit.id),
    [uoms, baseUnit],
  );

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
      {baseUnit && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50/70 p-3 mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
            Base Unit (Smallest)
          </p>
          <p className="text-sm font-semibold text-emerald-900 mt-0.5">
            {baseUnit.name}
            {baseUnit.symbol ? ` (${baseUnit.symbol})` : ""}
          </p>
        </div>
      )}

      <div className="flex items-center rounded-md border p-0.5 w-fit mb-2">
        <Button
          type="button"
          size="sm"
          variant={viewMode === "hierarchy" ? "default" : "ghost"}
          className={viewMode === "hierarchy" ? "h-7 px-2 bg-[#5c52d6] hover:bg-[#4c43c0]" : "h-7 px-2"}
          onClick={() => setViewMode("hierarchy")}
        >
          Hierarchy
        </Button>
        <Button
          type="button"
          size="sm"
          variant={viewMode === "card" ? "default" : "ghost"}
          className={viewMode === "card" ? "h-7 px-2 bg-[#5c52d6] hover:bg-[#4c43c0]" : "h-7 px-2"}
          onClick={() => setViewMode("card")}
        >
          Card
        </Button>
      </div>

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

      {viewMode === "hierarchy" &&
        flatTree.map((node, idx) => {
        const factor = Number(node.uom.conversion_factor) || 1;
        const isBase = !!node.uom.is_base_unit;
        const indented = node.depth > 0;
        const isHighlighted = highlightUomId === node.uom.id;

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
                isHighlighted && "ring-1 ring-[#5c52d6]/40 bg-[#5c52d6]/5",
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
                {isHighlighted && (
                  <Badge className="bg-[#5c52d6]/10 text-[#5c52d6] border border-[#5c52d6]/30 hover:bg-[#5c52d6]/10 text-[10px]">
                    Selected
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

      {viewMode === "card" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {nonBaseUoms.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
              This category currently has only a base unit.
            </div>
          ) : (
            nonBaseUoms.map(unit => {
              const baseFactor = Number(baseUnit?.conversion_factor || 1) || 1;
              const unitFactor = Number(unit.conversion_factor || 0);
              const multiplier = baseFactor > 0 ? unitFactor / baseFactor : unitFactor;
              const isHighlighted = highlightUomId === unit.id;

              return (
                <div
                  key={unit.id}
                  className={cn(
                    "rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
                    isHighlighted && "ring-1 ring-[#5c52d6]/40 bg-[#5c52d6]/5",
                  )}
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Conversion
                  </p>
                  <p className="mt-3 text-lg font-semibold leading-tight">
                    1 {unit.name}
                  </p>
                  <p className="mt-1 text-base font-bold text-[#5c52d6] leading-tight">
                    = {formatNum(multiplier)} {baseUnit?.name}
                  </p>

                  {hasQty && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      For {formatNum(quantity!)} {baseUnit?.symbol || baseUnit?.name}: {formatNum(quantity! / (unitFactor || 1))} {unit.symbol || unit.name}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
