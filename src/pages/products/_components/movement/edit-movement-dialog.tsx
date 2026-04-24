import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DollarSign, ArrowRightLeft, Package, RefreshCw } from "lucide-react";
import {
  ProductMovement,
  ReorderExternalPurchasePayload,
  ReorderInternalManufacturingPayload,
} from "@/api/product/product.type";
import {
  DatePickerInput,
  SelectInput,
} from "@/components/reusable/partials/input";
import {
  useUpdateExternalReorderMovement,
  useUpdateInternalReorderMovement,
} from "@/api/product/product.mutation";

const PRODUCT_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "WORK_IN_PROGRESS", label: "Work In Progress" },
  { value: "PARTIALLY_COMPLETED", label: "Partially Completed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "BLOCKED", label: "Blocked" },
];

interface EditMovementDialogProps {
  movement: ProductMovement;
  productId: number;
  productType: string;
  open: boolean;
  onClose: () => void;
}

export function EditMovementDialog({
  movement,
  productId,
  productType,
  open,
  onClose,
}: EditMovementDialogProps) {
  const isInternal = productType === "INTERNAL_PRODUCED";

  const externalMutation = useUpdateExternalReorderMovement(
    productId,
    movement.id,
  );
  const internalMutation = useUpdateInternalReorderMovement(
    productId,
    movement.id,
  );
  const isPending = externalMutation.isPending || internalMutation.isPending;

  const [external, setExternal] = useState({
    quantity: String(movement.quantity ?? ""),
    purchase_unit_price_in_usd: String(
      movement.purchase_unit_price_in_usd ?? "",
    ),
    exchange_rate_from_usd_to_riel: String(
      movement.exchange_rate_from_usd_to_riel ?? "4100",
    ),
    selling_unit_price_in_usd: String(movement.selling_unit_price_in_usd ?? ""),
    selling_exchange_rate_from_usd_to_riel: String(
      movement.selling_exchange_rate_from_usd_to_riel ?? "4100",
    ),
    movement_date: movement.movement_date
      ? movement.movement_date.substring(0, 10)
      : "",
    note: movement.note ?? "",
  });

  const [internal, setInternal] = useState({
    quantity: String(movement.quantity ?? ""),
    product_status: movement.product_status ?? "COMPLETED",
    selling_unit_price_in_usd: String(movement.selling_unit_price_in_usd ?? ""),
    selling_exchange_rate_from_usd_to_riel: String(
      movement.selling_exchange_rate_from_usd_to_riel ?? "4100",
    ),
    movement_date: movement.movement_date
      ? movement.movement_date.substring(0, 10)
      : "",
    note: movement.note ?? "",
  });

  const isExternalValid = useMemo(
    () =>
      Number(external.quantity) > 0 &&
      Number(external.purchase_unit_price_in_usd) > 0 &&
      Number(external.exchange_rate_from_usd_to_riel) > 0 &&
      Number(external.selling_unit_price_in_usd) > 0 &&
      Number(external.selling_exchange_rate_from_usd_to_riel) > 0 &&
      external.movement_date !== "",
    [external],
  );

  const isInternalValid = useMemo(
    () =>
      Number(internal.quantity) > 0 &&
      Number(internal.selling_unit_price_in_usd) > 0 &&
      Number(internal.selling_exchange_rate_from_usd_to_riel) > 0 &&
      internal.movement_date !== "",
    [internal],
  );

  const handleSubmit = () => {
    if (isPending) return;
    if (isInternal) {
      if (!isInternalValid) return;
      const payload: ReorderInternalManufacturingPayload = {
        movement_date: internal.movement_date,
        product_status: internal.product_status,
        quantity: Number(internal.quantity),
        selling_unit_price_in_usd: Number(internal.selling_unit_price_in_usd),
        selling_exchange_rate_from_usd_to_riel: Number(
          internal.selling_exchange_rate_from_usd_to_riel,
        ),
        raw_materials: [],
        ...(internal.note.trim() ? { note: internal.note.trim() } : {}),
      };
      internalMutation.mutate(payload, { onSuccess: onClose });
    } else {
      if (!isExternalValid) return;
      const payload: ReorderExternalPurchasePayload = {
        movement_date: external.movement_date,
        quantity: Number(external.quantity),
        purchase_unit_price_in_usd: Number(external.purchase_unit_price_in_usd),
        exchange_rate_from_usd_to_riel: Number(
          external.exchange_rate_from_usd_to_riel,
        ),
        selling_unit_price_in_usd: Number(external.selling_unit_price_in_usd),
        selling_exchange_rate_from_usd_to_riel: Number(
          external.selling_exchange_rate_from_usd_to_riel,
        ),
        ...(external.note.trim() ? { note: external.note.trim() } : {}),
      };
      externalMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Movement</DialogTitle>
          <DialogDescription>
            Update this stock movement record.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {isInternal ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-muted-foreground" />
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={internal.quantity}
                    onChange={e =>
                      setInternal(p => ({ ...p, quantity: e.target.value }))
                    }
                  />
                </div>
                <SelectInput
                  id="product_status"
                  label="Product Status"
                  options={PRODUCT_STATUS_OPTIONS}
                  value={internal.product_status}
                  onChange={v =>
                    setInternal(p => ({ ...p, product_status: v }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                    Selling Price (USD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className="pl-7"
                      value={internal.selling_unit_price_in_usd}
                      onChange={e =>
                        setInternal(p => ({
                          ...p,
                          selling_unit_price_in_usd: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                    Exchange Rate <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                      ៛
                    </span>
                    <Input
                      type="number"
                      min={0}
                      className="pl-7"
                      value={internal.selling_exchange_rate_from_usd_to_riel}
                      onChange={e =>
                        setInternal(p => ({
                          ...p,
                          selling_exchange_rate_from_usd_to_riel:
                            e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <DatePickerInput
                id="movement_date_edit"
                required
                label="Movement Date"
                value={internal.movement_date}
                onChange={v => setInternal(p => ({ ...p, movement_date: v }))}
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-muted-foreground" />
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={external.quantity}
                    onChange={e =>
                      setExternal(p => ({ ...p, quantity: e.target.value }))
                    }
                  />
                </div>
                <DatePickerInput
                  id="movement_date_edit"
                  required
                  label="Movement Date"
                  value={external.movement_date}
                  onChange={v => setExternal(p => ({ ...p, movement_date: v }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                    Purchase Price (USD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className="pl-7"
                      value={external.purchase_unit_price_in_usd}
                      onChange={e =>
                        setExternal(p => ({
                          ...p,
                          purchase_unit_price_in_usd: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                    Exchange Rate <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                      ៛
                    </span>
                    <Input
                      type="number"
                      min={0}
                      className="pl-7"
                      value={external.exchange_rate_from_usd_to_riel}
                      onChange={e =>
                        setExternal(p => ({
                          ...p,
                          exchange_rate_from_usd_to_riel: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                    Selling Price (USD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      className="pl-7"
                      value={external.selling_unit_price_in_usd}
                      onChange={e =>
                        setExternal(p => ({
                          ...p,
                          selling_unit_price_in_usd: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                    Selling Exchange Rate{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                      ៛
                    </span>
                    <Input
                      type="number"
                      min={0}
                      className="pl-7"
                      value={external.selling_exchange_rate_from_usd_to_riel}
                      onChange={e =>
                        setExternal(p => ({
                          ...p,
                          selling_exchange_rate_from_usd_to_riel:
                            e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Note{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              rows={2}
              placeholder="Optional note..."
              value={isInternal ? internal.note : external.note}
              onChange={e =>
                isInternal
                  ? setInternal(p => ({ ...p, note: e.target.value }))
                  : setExternal(p => ({ ...p, note: e.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isPending || (isInternal ? !isInternalValid : !isExternalValid)
            }
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
