/**
 * UomHierarchyDisplay — Read-only compact tree for embedding in detail pages.
 *
 * Shows the full UOM hierarchy for a given category, optionally highlighting
 * the currently active unit.
 */
import { useUOMs } from "@/api/uom/uom.query";
import { UOM } from "@/api/uom/uom.types";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UomHierarchyDisplayProps {
  categoryId: number;
  /** ID of the currently selected UOM — will be highlighted */
  highlightUomId?: number;
}

// ── helpers ──────────────────────────────────────────────────────────────────

interface TreeNode {
  uom: UOM;
  children: TreeNode[];
}

function buildTree(uoms: UOM[]): TreeNode[] {
  const allIds = new Set(uoms.map(u => u.id));
  const roots = uoms.filter(u => {
    if (u.is_base_unit) return true;
    return !u.base_uom_id || !allIds.has(u.base_uom_id);
  });

  function getChildren(uom: UOM): TreeNode[] {
    return uoms
      .filter(u => u.base_uom_id === uom.id && u.id !== uom.id)
      .map(child => ({ uom: child, children: getChildren(child) }));
  }

  return roots.map(r => ({ uom: r, children: getChildren(r) }));
}

function formatNum(n: number) {
  return n % 1 === 0 ? n.toLocaleString() : n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

// ── Row renderer ─────────────────────────────────────────────────────────────

function UomRow({
  uom,
  allUoms,
  highlighted,
  depth = 0,
}: {
  uom: UOM;
  allUoms: UOM[];
  highlighted: boolean;
  depth?: number;
}) {
  const base = allUoms.find(u => !!u.is_base_unit);
  const parent = allUoms.find(u => u.id === uom.base_uom_id);

  const relationLine = (() => {
    if (uom.is_base_unit) return "Base unit — all others derive from this";

    if (!parent) return null;
    const parentFactor = Number(parent.conversion_factor);
    const selfFactor = Number(uom.conversion_factor);
    const qtyToParent = parentFactor > 0 ? selfFactor / parentFactor : selfFactor;
    const parentLabel = parent.symbol ? `${parent.name} (${parent.symbol})` : parent.name;
    let line = `1 ${uom.symbol ?? uom.name} = ${formatNum(qtyToParent)} ${parentLabel}`;
    if (base && !parent.is_base_unit) {
      const baseLabel = base.symbol ? `${base.name} (${base.symbol})` : base.name;
      line += `  ·  ${formatNum(selfFactor)} ${baseLabel}`;
    }
    return line;
  })();

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-colors",
        highlighted
          ? "border-[#5c52d6]/40 bg-[#5c52d6]/5"
          : "border-border bg-card",
        depth > 0 && "ml-4"
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm leading-tight">{uom.name}</span>
          {uom.symbol && (
            <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
              {uom.symbol}
            </span>
          )}
          {!!uom.is_base_unit && (
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px] font-semibold uppercase tracking-wide border border-emerald-300">
              Base Unit
            </Badge>
          )}
          {highlighted && (
            <Badge className="bg-[#5c52d6]/10 text-[#5c52d6] border-[#5c52d6]/30 text-[10px] font-semibold hover:bg-[#5c52d6]/10">
              Selected
            </Badge>
          )}
        </div>
        {relationLine && (
          <p
            className={cn(
              "text-xs font-mono",
              uom.is_base_unit ? "text-emerald-600" : "text-muted-foreground"
            )}
          >
            {relationLine}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Recursive tree renderer ───────────────────────────────────────────────────

function TreeDisplay({
  nodes,
  allUoms,
  highlightUomId,
  isFirst = true,
  depth = 0,
}: {
  nodes: TreeNode[];
  allUoms: UOM[];
  highlightUomId?: number;
  isFirst?: boolean;
  depth?: number;
}) {
  return (
    <div className="space-y-1 w-full">
      {nodes.map((node, idx) => (
        <div key={node.uom.id}>
          {(!isFirst || idx > 0) && (
            <div className="flex items-center justify-center py-0.5 ml-4">
              <ArrowDownIcon className="h-3.5 w-3.5 text-muted-foreground/40" />
            </div>
          )}
          <UomRow
            uom={node.uom}
            allUoms={allUoms}
            highlighted={node.uom.id === highlightUomId}
            depth={depth}
          />
          {node.children.length > 0 && (
            <>
              <div className="flex items-center justify-center py-0.5 ml-4">
                <ArrowDownIcon className="h-3.5 w-3.5 text-muted-foreground/40" />
              </div>
              <TreeDisplay
                nodes={node.children}
                allUoms={allUoms}
                highlightUomId={highlightUomId}
                isFirst={false}
                depth={depth + 1}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function UomHierarchyDisplay({ categoryId, highlightUomId }: UomHierarchyDisplayProps) {
  const { data, isLoading } = useUOMs({
    "filter[category_id]": categoryId,
    per_page: 100,
  } as any);

  const uoms: UOM[] = (data as any)?.data ?? data ?? [];
  const tree = buildTree(uoms);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading unit hierarchy…
      </div>
    );
  }

  if (uoms.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        No units found for this category.
      </p>
    );
  }

  return (
    <TreeDisplay
      nodes={tree}
      allUoms={uoms}
      highlightUomId={highlightUomId}
      isFirst={true}
    />
  );
}
