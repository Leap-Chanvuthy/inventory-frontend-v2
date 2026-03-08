/**
 * UomCard — Visual card for a single Unit of Measurement.
 *
 * Displays a natural-language relationship description instead of raw
 * conversion factors, making it easy for non-technical users to understand
 * the unit hierarchy.
 */
import { useState } from "react";
import { UOM } from "@/api/uom/uom.types";
import { useDeleteUOM, useRestoreUOM } from "@/api/uom/uom.mutation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Trash2, Plus, Equal, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UomCardProps {
  uom: UOM;
  allCategoryUoms: UOM[];   // flat list, used to compute parent label
  onAddChild: (parent: UOM) => void;
  /** Called when the user clicks the Edit button — opens edit modal in parent */
  onEdit?: (uom: UOM) => void;
  /** When true, renders in archived/trash mode: restore button, no edit/delete */
  isTrash?: boolean;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function formatNum(n: number) {
  return n % 1 === 0 ? n.toLocaleString() : n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function uomLabel(uom: UOM) {
  return uom.symbol ? `${uom.name} (${uom.symbol})` : uom.name;
}

// ── Sub-component: Relationship line ─────────────────────────────────────────

function RelationshipLine({ uom, allUoms }: { uom: UOM; allUoms: UOM[] }) {
  const base = allUoms.find(u => !!u.is_base_unit);

  if (uom.is_base_unit) {
    return (
      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
        Reference unit — all others are measured relative to this
      </p>
    );
  }

  const parent = allUoms.find(u => u.id === uom.base_uom_id);
  if (!parent) return null;

  const parentFactor = Number(parent.conversion_factor);
  const selfFactor = Number(uom.conversion_factor);

  // How many parent units are in one of this unit
  const qtyRelativeToParent =
    parentFactor > 0 ? selfFactor / parentFactor : selfFactor;

  const lines: string[] = [
    `1 ${uomLabel(uom)} = ${formatNum(qtyRelativeToParent)} ${uomLabel(parent)}`,
  ];

  // Also show chain to base if parent is not the base
  if (base && !parent.is_base_unit) {
    lines.push(`= ${formatNum(selfFactor)} ${uomLabel(base)}`);
  }

  return (
    <div className="space-y-0.5 min-w-0">
      {lines.map((line, i) => (
        <p
          key={i}
          className={cn(
            "text-xs font-mono break-words",
            i === 0 ? "text-foreground font-semibold" : "text-muted-foreground"
          )}
        >
          {i > 0 && <Equal className="inline h-3 w-3 mr-1 opacity-50" />}
          {line}
        </p>
      ))}
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

export function UomCard({ uom, allCategoryUoms, onAddChild, onEdit, isTrash = false }: UomCardProps) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteUOM();
  const restoreMutation = useRestoreUOM();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isBase = !!uom.is_base_unit;
  const isActive = !!uom.is_active;

  return (
    <>
      <Card
        className={cn(
          "relative w-full transition-shadow hover:shadow-md",
          isBase && !isTrash && "border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/10",
          isTrash && "opacity-60 bg-muted/20 border-dashed"
        )}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Left: name, symbol, badge */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-base leading-tight break-words min-w-0">{uom.name}</h3>
                {uom.symbol && (
                  <span className="text-sm text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                    {uom.symbol}
                  </span>
                )}

                {/* BASE UNIT badge */}
                {isBase && !isTrash && (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px] font-semibold uppercase tracking-wide border border-emerald-300">
                    Base Unit
                  </Badge>
                )}

                {/* Archived badge */}
                {isTrash && (
                  <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300 bg-amber-50">
                    Archived
                  </Badge>
                )}

                {/* Inactive badge */}
                {!isActive && !isTrash && (
                  <Badge variant="secondary" className="text-[10px]">
                    Inactive
                  </Badge>
                )}
              </div>

              {/* Natural language relationship */}
              <RelationshipLine uom={uom} allUoms={allCategoryUoms} />
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1 shrink-0">
              {isTrash ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"
                      onClick={() => restoreMutation.mutate(uom.id)}
                      disabled={restoreMutation.isPending}
                      aria-label="Restore"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Restore</TooltipContent>
                </Tooltip>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit?.(uom)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteOpen(true)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Archive</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>

          {/* Add Child / View details — hidden in trash mode */}
          {!isTrash && (
            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-[#5c52d6] hover:bg-[#5c52d6]/5"
                onClick={() => onAddChild(uom)}
              >
                <Plus className="h-3 w-3" />
                Add child unit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={() => navigate(`/unit-of-measurement/view/${uom.id}`)}
              >
                View details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Archive / Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Archive "{uom.name}"?</DialogTitle>
            <DialogDescription>
              This unit will be archived and hidden from active use. You can
              restore it later from the archived units view.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteMutation.mutate(uom.id);
                setDeleteOpen(false);
              }}
            >
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
