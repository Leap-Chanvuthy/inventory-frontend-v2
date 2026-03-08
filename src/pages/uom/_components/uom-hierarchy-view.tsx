import { UOM } from "@/api/uom/uom.types";
import { Link } from "react-router-dom";
import { ArrowRightLeft } from "lucide-react";
import { UomKindBadge } from "../utils/table-feature";
import { UOMStatusBadge } from "../utils/uom-status";

interface HierarchyNodeProps {
  uom: UOM;
  allUoms: UOM[];
  depth?: number;
}

function HierarchyNode({ uom, allUoms, depth = 0 }: HierarchyNodeProps) {
  const children = allUoms.filter(u => u.base_uom_id === uom.id && !u.is_base_unit);

  const indent = depth * 20;

  return (
    <div>
      <div
        className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/40 transition-colors group"
        style={{ marginLeft: indent }}
      >
        {/* Tree connector */}
        {depth > 0 && (
          <span className="text-muted-foreground/40 font-mono text-sm select-none shrink-0">
            {"└─"}
          </span>
        )}

        {/* UOM info */}
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
          <Link
            to={`/unit-of-measurement/view/${uom.id}`}
            className="font-medium text-sm hover:text-primary hover:underline truncate"
          >
            {uom.name}
          </Link>
          {uom.symbol && (
            <span className="text-xs text-muted-foreground">({uom.symbol})</span>
          )}
          <UomKindBadge isBaseUnit={uom.is_base_unit} />
          <UOMStatusBadge isActive={uom.is_active} />
        </div>

        {/* Conversion factor */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <ArrowRightLeft className="h-3 w-3" />
          <span className="font-mono">
            {uom.is_base_unit
              ? "1 (base)"
              : `× ${Number(uom.conversion_factor).toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Recurse into children */}
      {children.map(child => (
        <HierarchyNode
          key={child.id}
          uom={child}
          allUoms={allUoms}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

interface UomHierarchyViewProps {
  /** Flat list of all UOMs (ideally from a single category) */
  uoms: UOM[];
}

export function UomHierarchyView({ uoms }: UomHierarchyViewProps) {
  if (!uoms.length) return null;

  // Top of each hierarchy = base units
  const baseUnits = uoms.filter(u => u.is_base_unit);

  // If no explicit base units, fall back to rendering all roots
  const roots =
    baseUnits.length > 0
      ? baseUnits
      : uoms.filter(u => !u.base_uom_id);

  return (
    <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
      {roots.map(root => (
        <HierarchyNode key={root.id} uom={root} allUoms={uoms} depth={0} />
      ))}
    </div>
  );
}
