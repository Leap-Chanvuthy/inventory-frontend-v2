/**
 * CreateUomModal — Natural-language UOM creation dialog.
 *
 * Instead of "Conversion Factor = 200", the user fills in:
 *   "1 Box contains  [20]  Blisters"
 * and the dialog shows a live preview:
 *   "1 Box = 20 Blisters = 200 Tablets (base)"
 *
 * The actual conversion_factor is computed automatically.
 */
import { useState, useEffect, useMemo } from "react";
import { useCreateUOM } from "@/api/uom/uom.mutation";
import { UOM } from "@/api/uom/uom.types";
import { parseApiError } from "@/api/uom/uom-error.utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Inline field error message displayed beneath a form input. */
function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-destructive mt-1">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {error}
    </p>
  );
}

interface CreateUomModalProps {
  open: boolean;
  onClose: () => void;
  /** All UOMs already in this category — used to populate parent dropdown */
  categoryUoms: UOM[];
  /** Pre-selected parent (when clicking "+ Add Child" on a card) */
  defaultParent?: UOM;
  /** Category ID for the new UOM */
  categoryId: number;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getBaseUnit(uoms: UOM[]): UOM | undefined {
  return uoms.find(u => u.is_base_unit);
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CreateUomModal({
  open,
  onClose,
  categoryUoms,
  defaultParent,
  categoryId,
}: CreateUomModalProps) {
  const mutation = useCreateUOM();
  const baseUnit = getBaseUnit(categoryUoms);

  // Parse structured server-side validation errors from the last failed attempt
  const serverErrors = useMemo(
    () => (mutation.error ? parseApiError(mutation.error) : { fields: {} as Record<string, string> }),
    [mutation.error]
  );

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isBase, setIsBase] = useState(categoryUoms.length === 0); // auto-base if category is empty
  const [parentId, setParentId] = useState<string>(
    defaultParent ? String(defaultParent.id) : ""
  );
  const [qty, setQty] = useState(""); // "contains N parent units"

  // Reset on open
  useEffect(() => {
    if (open) {
      setName("");
      setSymbol("");
      setIsBase(categoryUoms.length === 0);
      setParentId(defaultParent ? String(defaultParent.id) : "");
      setQty("");
    }
  }, [open, defaultParent, categoryUoms.length]);

  // Derived computations
  const selectedParent = categoryUoms.find(u => String(u.id) === parentId);
  const qtyNum = parseFloat(qty) || 0;

  /**
   * Computed conversion_factor (relative to category base unit).
   * If parent is the base unit:  conversion_factor = qty
   * Otherwise:                   conversion_factor = qty × parent.conversion_factor
   */
  const computedFactor =
    selectedParent && qtyNum > 0
      ? qtyNum * Number(selectedParent.conversion_factor)
      : 0;

  // Preview sentence: "1 Box = 20 Blisters = 200 Tablets"
  const previewLine =
    name && selectedParent && qtyNum > 0
      ? buildPreview(name, symbol, qtyNum, selectedParent, baseUnit)
      : null;

  // Validation
  const canSubmit =
    name.trim() &&
    (isBase || (selectedParent && qtyNum > 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    mutation.mutate(
      {
        name: name.trim(),
        symbol: symbol.trim() || undefined,
        is_active: true,
        category_id: categoryId,
        is_base_unit: isBase,
        base_uom_id: isBase || !selectedParent ? null : selectedParent.id,
        conversion_factor: isBase ? 1 : computedFactor,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  // Dropdown options: any unit in the category (not self, since we don't have an id yet)
  const parentOptions = categoryUoms;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isBase ? "Create Base Unit" : "Create Unit"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">

          {/* ── Global / business-logic error alert ───────────────────── */}
          {serverErrors.global && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/8 p-3">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive leading-snug">{serverErrors.global}</p>
            </div>
          )}

          {/* ── Name / Symbol row ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="cu-name">Unit Name *</Label>
              <Input
                id="cu-name"
                placeholder="e.g., Kilogram, Box, Blister"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                className={cn(serverErrors.fields.name && "border-destructive focus-visible:ring-destructive")}
              />
              <FieldError error={serverErrors.fields.name} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cu-symbol">Symbol</Label>
              <Input
                id="cu-symbol"
                placeholder="e.g., kg, pc"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                className={cn(serverErrors.fields.symbol && "border-destructive focus-visible:ring-destructive")}
              />
              <FieldError error={serverErrors.fields.symbol} />
            </div>

            {/* UOM Code — auto-generated by backend, displayed read-only after save */}
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Code</Label>
              <div className="h-9 px-3 flex items-center rounded-md border bg-muted/40 text-sm text-muted-foreground select-none">
                Auto-generated
              </div>
            </div>
          </div>

          {/* ── Base unit toggle ───────────────────────────────────────── */}
          {categoryUoms.length > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border">
              <div>
                <p className="text-sm font-medium">This is the base unit</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The smallest reference unit — all others derive from this.
                </p>
              </div>
              <Switch
                checked={isBase}
                onCheckedChange={checked => {
                  setIsBase(checked);
                  if (checked) {
                    setParentId("");
                    setQty("");
                  }
                }}
              />
            </div>
          )}

          {/* ── Natural-language relationship input ────────────────────── */}
          {!isBase && (
            <div className="space-y-3">
              <Label>
                Relationship{" "}
                <span className="text-muted-foreground font-normal">(required)</span>
              </Label>

              {/* Sentence: "1 [name] contains [qty] [parent]" */}
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-background">
                <span className="text-sm text-muted-foreground whitespace-nowrap">1</span>
                <span
                  className={cn(
                    "text-sm font-semibold whitespace-nowrap",
                    name ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {name || "this unit"}
                </span>
                <span className="text-sm text-muted-foreground whitespace-nowrap">contains</span>
                <Input
                  type="number"
                  min="0.001"
                  step="any"
                  placeholder="?"
                  className={cn(
                    "w-20 h-8 text-center font-mono text-sm",
                    serverErrors.fields.conversion_factor && "border-destructive"
                  )}
                  value={qty}
                  onChange={e => setQty(e.target.value)}
                />
                <Select
                  value={parentId}
                  onValueChange={setParentId}
                >
                  <SelectTrigger
                    className={cn(
                      "flex-1 h-8 text-sm",
                      serverErrors.fields.base_uom_id && "border-destructive"
                    )}
                  >
                    <SelectValue placeholder="select parent unit…" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentOptions.map(u => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        <span>{u.name}</span>
                        {u.symbol && (
                          <span className="ml-1 text-muted-foreground">({u.symbol})</span>
                        )}
                        {!!u.is_base_unit && (
                          <Badge className="ml-2 text-[10px] py-0 bg-green-100 text-green-800 hover:bg-green-100">
                            base
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Relationship field errors */}
              {(serverErrors.fields.conversion_factor || serverErrors.fields.base_uom_id) && (
                <div className="space-y-1">
                  <FieldError error={serverErrors.fields.conversion_factor} />
                  <FieldError error={serverErrors.fields.base_uom_id} />
                </div>
              )}

              {/* Live preview ─────────────────────────────────────────── */}
              {previewLine && (
                <div className="rounded-lg border border-[#5c52d6]/20 bg-[#5c52d6]/5 p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Eye className="h-3.5 w-3.5 text-[#5c52d6]" />
                    <span className="text-xs font-medium text-[#5c52d6]">Preview</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{previewLine}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Base unit info banner ─────────────────────────────────── */}
          {isBase && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800 p-3">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                <span className="font-semibold">Base unit:</span> This will be the reference
                unit. All other units in this category will express their value relative to this one.
              </p>
            </div>
          )}

          {/* ── Actions ─────────────────────────────────────────────── */}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || mutation.isPending}
              className="bg-[#5c52d6] hover:bg-[#4a41c9]"
            >
              {mutation.isPending ? "Saving…" : "Create Unit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Preview sentence builder ─────────────────────────────────────────────────

function buildPreview(
  name: string,
  symbol: string,
  qty: number,
  parent: UOM,
  baseUnit?: UOM
): string {
  const selfLabel = symbol ? `${name} (${symbol})` : name;
  const parentLabel = parent.symbol ? `${parent.name} (${parent.symbol})` : parent.name;

  let str = `1 ${selfLabel} = ${qty.toLocaleString()} ${pluralise(parentLabel, qty)}`;

  // If parent is NOT the base, also show chain to base
  if (baseUnit && !parent.is_base_unit) {
    const factorToBase = qty * Number(parent.conversion_factor);
    const baseLabel = baseUnit.symbol
      ? `${baseUnit.name} (${baseUnit.symbol})`
      : baseUnit.name;
    str += ` = ${factorToBase.toLocaleString()} ${pluralise(baseLabel, factorToBase)}`;
  }

  return str;
}

/** Very basic pluralisation for preview text */
function pluralise(label: string, n: number): string {
  return n === 1 ? label : label;
}
