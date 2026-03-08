/**
 * EditUomModal — Natural-language UOM edit dialog.
 *
 * Mirrors CreateUomModal but pre-fills all fields from the existing UOM
 * and uses useUpdateUOM instead of useCreateUOM.
 *
 * Qty pre-fill: uom.conversion_factor / parent.conversion_factor
 */
import { useState, useEffect, useMemo } from "react";
import { useUpdateUOM } from "@/api/uom/uom.mutation";
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

interface EditUomModalProps {
  open: boolean;
  onClose: () => void;
  /** The UOM being edited */
  uom: UOM;
  /** All UOMs in this category — used to populate parent dropdown (self excluded) */
  categoryUoms: UOM[];
  /** Category ID for validation / context */
  categoryId: number;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getBaseUnit(uoms: UOM[]): UOM | undefined {
  return uoms.find(u => !!u.is_base_unit);
}

function buildPreview(
  name: string,
  symbol: string,
  qty: number,
  parent: UOM,
  baseUnit?: UOM
): string {
  const selfLabel = symbol ? `${name} (${symbol})` : name;
  const parentLabel = parent.symbol ? `${parent.name} (${parent.symbol})` : parent.name;
  let str = `1 ${selfLabel} = ${qty.toLocaleString()} ${parentLabel}`;
  if (baseUnit && !parent.is_base_unit) {
    const factorToBase = qty * Number(parent.conversion_factor);
    const baseLabel = baseUnit.symbol
      ? `${baseUnit.name} (${baseUnit.symbol})`
      : baseUnit.name;
    str += ` = ${factorToBase.toLocaleString()} ${baseLabel}`;
  }
  return str;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EditUomModal({
  open,
  onClose,
  uom,
  categoryUoms,
  categoryId,
}: EditUomModalProps) {
  const mutation = useUpdateUOM(uom.id);

  const serverErrors = useMemo(
    () =>
      mutation.error
        ? parseApiError(mutation.error)
        : { fields: {} as Record<string, string> },
    [mutation.error]
  );

  // Exclude self from parent dropdown
  const parentOptions = categoryUoms.filter(u => u.id !== uom.id);
  const baseUnit = getBaseUnit(categoryUoms);

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isBase, setIsBase] = useState(false);
  const [parentId, setParentId] = useState<string>("");
  const [qty, setQty] = useState("");

  // Pre-fill when modal opens
  useEffect(() => {
    if (!open) return;
    setName(uom.name ?? "");
    setSymbol(uom.symbol ?? "");
    setIsBase(!!uom.is_base_unit);

    const pid = uom.base_uom_id ? String(uom.base_uom_id) : "";
    setParentId(pid);

    // Reverse-compute qty: uom.conversion_factor / parent.conversion_factor
    if (pid && !uom.is_base_unit) {
      const parent = categoryUoms.find(u => String(u.id) === pid);
      if (parent && Number(parent.conversion_factor) > 0) {
        const computed = Number(uom.conversion_factor) / Number(parent.conversion_factor);
        // Round to 6 decimal places and strip trailing zeros
        setQty(parseFloat(computed.toFixed(6)).toString());
      } else {
        setQty(String(uom.conversion_factor));
      }
    } else {
      setQty("");
    }
  }, [open, uom, categoryUoms]);

  // Derived computations
  const selectedParent = parentOptions.find(u => String(u.id) === parentId);
  const qtyNum = parseFloat(qty) || 0;

  const computedFactor =
    selectedParent && qtyNum > 0
      ? qtyNum * Number(selectedParent.conversion_factor)
      : 0;

  const previewLine =
    name && selectedParent && qtyNum > 0
      ? buildPreview(name, symbol, qtyNum, selectedParent, baseUnit)
      : null;

  const canSubmit =
    name.trim() && (isBase || (selectedParent && qtyNum > 0));

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Unit of Measurement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">

          {/* ── Global error alert ─────────────────────────────────────── */}
          {serverErrors.global && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/8 p-3">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive leading-snug">{serverErrors.global}</p>
            </div>
          )}

          {/* ── Name / Symbol / Code row ───────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="eu-name">Unit Name *</Label>
              <Input
                id="eu-name"
                placeholder="e.g., Kilogram, Box, Blister"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                className={cn(serverErrors.fields.name && "border-destructive focus-visible:ring-destructive")}
              />
              <FieldError error={serverErrors.fields.name} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="eu-symbol">Symbol</Label>
              <Input
                id="eu-symbol"
                placeholder="e.g., kg, pc"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                className={cn(serverErrors.fields.symbol && "border-destructive focus-visible:ring-destructive")}
              />
              <FieldError error={serverErrors.fields.symbol} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Code</Label>
              <div className="h-9 px-3 flex items-center rounded-md border bg-muted/40 text-sm text-muted-foreground select-none">
                {uom.uom_code || "Auto-generated"}
              </div>
            </div>
          </div>

          {/* ── Base unit toggle ───────────────────────────────────────── */}
          {parentOptions.length > 0 && (
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
                <Select value={parentId} onValueChange={setParentId}>
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

              {(serverErrors.fields.conversion_factor || serverErrors.fields.base_uom_id) && (
                <div className="space-y-1">
                  <FieldError error={serverErrors.fields.conversion_factor} />
                  <FieldError error={serverErrors.fields.base_uom_id} />
                </div>
              )}

              {/* Live preview */}
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
                <span className="font-semibold">Base unit:</span> This is the reference unit.
                All other units in this category express their value relative to this one.
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
              {mutation.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
