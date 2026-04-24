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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  Package,
  DollarSign,
  ArrowRightLeft,
  FileText,
} from "lucide-react";
import { DatePickerInput } from "@/components/reusable/partials/input";
import {
  useReorderExternalPurchase,
  useReorderInternalManufacturing,
} from "@/api/product/product.mutation";
import {
  ReorderExternalPurchasePayload,
  ReorderInternalManufacturingPayload,
  ProductRawMaterial,
  InsufficientStockError,
  ProductValidationErrors,
} from "@/api/product/product.type";
import { AxiosError } from "axios";


interface ReorderDialogProps {
  productId: number;
  productName: string;
  productType: "INTERNAL_PRODUCED" | "EXTERNAL_PURCHASED" | string;
  productRawMaterials?: ProductRawMaterial[];
}

export function ReorderDialog({
  productId,
  productName,
  productType,
  productRawMaterials = [],
}: ReorderDialogProps) {
  const isInternal = productType === "INTERNAL_PRODUCED";

  const externalMutation = useReorderExternalPurchase(productId);
  const internalMutation = useReorderInternalManufacturing(productId);
  const isPending = externalMutation.isPending || internalMutation.isPending;

  const internalErrors = (internalMutation.error as AxiosError<ProductValidationErrors> | null)
    ?.response?.data?.errors;
  const stockErrors = Array.isArray(internalErrors)
    ? (internalErrors as InsufficientStockError[])
    : undefined;

  const INITIAL_EXTERNAL = useMemo(
    () => ({
      quantity: "",
      purchase_unit_price_in_usd: "",
      exchange_rate_from_usd_to_riel: "4100",
      selling_unit_price_in_usd: "",
      selling_exchange_rate_from_usd_to_riel: "4100",
      movement_date: "",
      note: "",
    }),
    [],
  );

  const INITIAL_INTERNAL = useMemo(
    () => ({
      quantity: "",
      selling_unit_price_in_usd: "",
      selling_exchange_rate_from_usd_to_riel: "4100",
      movement_date: "",
      note: "",
    }),
    [],
  );

  const [open, setOpen] = useState(false);
  const [external, setExternal] = useState(INITIAL_EXTERNAL);
  const [internal, setInternal] = useState(INITIAL_INTERNAL);
  const [bomEntries, setBomEntries] = useState<{ raw_material_id: number; name: string; quantity: number }[]>([]);

  const resetForms = () => {
    setExternal(INITIAL_EXTERNAL);
    setInternal(INITIAL_INTERNAL);
    setBomEntries(
      productRawMaterials.map(rm => ({
        raw_material_id: rm.raw_material_id,
        name: rm.raw_material?.material_name ?? `#${rm.raw_material_id}`,
        quantity: Number(rm.quantity),
      })),
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) resetForms();
    else {
      setExternal(INITIAL_EXTERNAL);
      setInternal(INITIAL_INTERNAL);
    }
  };

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
      internal.movement_date !== "" &&
      bomEntries.length > 0,
    [internal, bomEntries],
  );

  const handleSubmit = () => {
    if (isPending) return;

    if (isInternal) {
      if (!isInternalValid) return;
      const payload: ReorderInternalManufacturingPayload = {
        movement_date: internal.movement_date,
        product_status: "COMPLETED",
        quantity: Number(internal.quantity),
        selling_unit_price_in_usd: Number(internal.selling_unit_price_in_usd),
        selling_exchange_rate_from_usd_to_riel: Number(internal.selling_exchange_rate_from_usd_to_riel),
        raw_materials: bomEntries.map(e => ({ raw_material_id: e.raw_material_id, quantity: e.quantity })),
        ...(internal.note.trim() ? { note: internal.note.trim() } : {}),
      };
      internalMutation.mutate(payload, { onSuccess: () => { resetForms(); setOpen(false); } });
    } else {
      if (!isExternalValid) return;
      const payload: ReorderExternalPurchasePayload = {
        movement_date: external.movement_date,
        quantity: Number(external.quantity),
        purchase_unit_price_in_usd: Number(external.purchase_unit_price_in_usd),
        exchange_rate_from_usd_to_riel: Number(external.exchange_rate_from_usd_to_riel),
        selling_unit_price_in_usd: Number(external.selling_unit_price_in_usd),
        selling_exchange_rate_from_usd_to_riel: Number(external.selling_exchange_rate_from_usd_to_riel),
        ...(external.note.trim() ? { note: external.note.trim() } : {}),
      };
      externalMutation.mutate(payload, { onSuccess: () => { resetForms(); setOpen(false); } });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reorder Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reorder Product</DialogTitle>
          <DialogDescription>
            Create a reorder stock movement for <strong>{productName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {isInternal ? (
            <>
              {/* Quantity */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-muted-foreground" />
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={internal.quantity}
                  onChange={e => setInternal(p => ({ ...p, quantity: e.target.value }))}
                  min={0}
                />
              </div>

              {/* Selling Price + Exchange Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                    Selling Price (USD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={internal.selling_unit_price_in_usd}
                      onChange={e => setInternal(p => ({ ...p, selling_unit_price_in_usd: e.target.value }))}
                      min={0}
                      step="0.01"
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                    Exchange Rate <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">៛</span>
                    <Input
                      type="number"
                      placeholder="e.g. 4100"
                      value={internal.selling_exchange_rate_from_usd_to_riel}
                      onChange={e => setInternal(p => ({ ...p, selling_exchange_rate_from_usd_to_riel: e.target.value }))}
                      min={0}
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">USD to Riel</p>
                </div>
              </div>

              {/* Movement Date */}
              <DatePickerInput
                id="movement_date_internal"
                required
                label="Reorder Date"
                value={internal.movement_date}
                onChange={value => setInternal(p => ({ ...p, movement_date: value }))}
              />

              {/* Raw Materials (BOM) */}
              {bomEntries.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-muted-foreground" />
                    Raw Materials (BOM)
                  </Label>
                  <div className="border rounded-md divide-y">
                    {bomEntries.map((entry, idx) => {
                      const stockErr = stockErrors?.find(e => e.raw_material_id === entry.raw_material_id);
                      return (
                        <div key={entry.raw_material_id} className={`px-3 py-2 ${stockErr ? "bg-destructive/5" : ""}`}>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-5 shrink-0">{idx + 1}</span>
                            <span className="flex-1 text-sm">{entry.name}</span>
                            <Input
                              type="number"
                              className={`w-24 h-7 text-sm bg-muted cursor-not-allowed ${stockErr ? "border-destructive" : ""}`}
                              value={entry.quantity}
                              min={0}
                              disabled
                              readOnly
                            />
                          </div>
                          {stockErr && (
                            <p className="text-xs text-destructive mt-1 ml-8">
                              Need {stockErr.required_qty}, available {stockErr.available_qty} (short by {stockErr.shortfall_qty})
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Quantity + Movement Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-muted-foreground" />
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={external.quantity}
                    onChange={e => setExternal(p => ({ ...p, quantity: e.target.value }))}
                    min={0}
                  />
                </div>
                <DatePickerInput
                  id="movement_date_external"
                  required
                  label="Reorder Date"
                  value={external.movement_date}
                  onChange={value => setExternal(p => ({ ...p, movement_date: value }))}
                />
              </div>

              {/* Purchase Price + Exchange Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                    Purchase Price (USD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={external.purchase_unit_price_in_usd}
                      onChange={e => setExternal(p => ({ ...p, purchase_unit_price_in_usd: e.target.value }))}
                      min={0}
                      step="0.01"
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                    Exchange Rate <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">៛</span>
                    <Input
                      type="number"
                      placeholder="e.g. 4100"
                      value={external.exchange_rate_from_usd_to_riel}
                      onChange={e => setExternal(p => ({ ...p, exchange_rate_from_usd_to_riel: e.target.value }))}
                      min={0}
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">USD to Riel</p>
                </div>
              </div>

              {/* Selling Price + Selling Exchange Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                    Selling Price (USD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={external.selling_unit_price_in_usd}
                      onChange={e => setExternal(p => ({ ...p, selling_unit_price_in_usd: e.target.value }))}
                      min={0}
                      step="0.01"
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                    Selling Exchange Rate <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">៛</span>
                    <Input
                      type="number"
                      placeholder="e.g. 4100"
                      value={external.selling_exchange_rate_from_usd_to_riel}
                      onChange={e => setExternal(p => ({ ...p, selling_exchange_rate_from_usd_to_riel: e.target.value }))}
                      min={0}
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">USD to Riel</p>
                </div>
              </div>

            </>
          )}

          {/* Note */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              Note <span className="text-xs text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              placeholder="e.g. Reorder due to low stock"
              value={isInternal ? internal.note : external.note}
              onChange={e =>
                isInternal
                  ? setInternal(p => ({ ...p, note: e.target.value }))
                  : setExternal(p => ({ ...p, note: e.target.value }))
              }
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || (isInternal ? !isInternalValid : !isExternalValid)}
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Reordering...
              </>
            ) : (
              "Confirm Reorder"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
