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
import {
  RefreshCw,
  Package,
  DollarSign,
  ArrowRightLeft,
  FileText,
  PenSquare,
} from "lucide-react";
import { useUpdateReorderRawMaterial } from "@/api/raw-materials/raw-material.mutation";
import { DatePickerInput } from "@/components/reusable/partials/input";
import { ReorderRawMaterialPayload } from "@/api/raw-materials/raw-material.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UpdateReorderDialogProps {
  isDisabled?: boolean;
  rawMaterialId: number;
  movementId: number;
  materialName: string;
  payload: ReorderRawMaterialPayload;
}

export function UpdateReorderDialog({ isDisabled , rawMaterialId , movementId , materialName , payload }: UpdateReorderDialogProps) {
  const reorderMutation = useUpdateReorderRawMaterial(rawMaterialId, movementId);
  const disabled = isDisabled === true;
  const tooltipText = disabled
    ? "This reorder qty is already in used. Data cannot be updated to avoid stock qty inconsistency. Please update before the qty is used."
    : "Update reorder";

  const INITIAL_FORM = useMemo(
    () => ({
      quantity: payload?.quantity != null ? String(payload.quantity) : "",
      unit_price_in_usd:
        payload?.unit_price_in_usd != null ? String(payload.unit_price_in_usd) : "",
      exchange_rate_from_usd_to_riel:
        payload?.exchange_rate_from_usd_to_riel != null
          ? String(payload.exchange_rate_from_usd_to_riel)
          : "4100",
      movement_date: payload?.movement_date ?? "",
      expiry_date: payload?.expiry_date ?? "",
      note: payload?.note ?? "",
    }),
    [payload]
  );

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const resetForm = () => setForm(INITIAL_FORM);

  const openDialog = () => {
    if (disabled) return;
    setForm(INITIAL_FORM);
    setOpen(true);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && isDisabled === true) return;
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  };

  const isValid = useMemo(() => {
    const quantity = Number(form.quantity);
    const unitPrice = Number(form.unit_price_in_usd);
    const exchangeRate = Number(form.exchange_rate_from_usd_to_riel);
    return quantity > 0 && unitPrice > 0 && exchangeRate > 0 && form.movement_date !== "";
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid || reorderMutation.isPending) return;

    const submitPayload: ReorderRawMaterialPayload = {
      quantity: Number(form.quantity),
      unit_price_in_usd: Number(form.unit_price_in_usd),
      exchange_rate_from_usd_to_riel: Number(form.exchange_rate_from_usd_to_riel),
      movement_date: form.movement_date,
      expiry_date: form.expiry_date,
      ...(form.note.trim() ? { note: form.note.trim() } : {}),
    };

    reorderMutation.mutate(submitPayload, {
      onSuccess: () => {
        resetForm();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {disabled ? (
              <span className="inline-flex cursor-not-allowed">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-disabled={true}
                  tabIndex={-1}
                  className="pointer-events-none opacity-50"
                >
                  <PenSquare className="w-4 h-4" />
                </Button>
              </span>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={openDialog}
              >
                <PenSquare className="w-4 h-4" />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent side="top">{tooltipText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Reorder Raw Material</DialogTitle>
          <DialogDescription>
            Update a reorder stock movement for <strong>{materialName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          
          <div className="grid grid-cols-2 gap-4">
            
          {/* Quantity */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={form.quantity}
                onChange={e => setForm(prev => ({ ...prev, quantity: e.target.value }))}
                min={0}
              />
            </div>
            
            {/* Expiry Date */}
            <div className="space-y-2">
              <DatePickerInput
                id="expiry_date"
                required={false}
                label="Expiry Date"
                value={form.expiry_date}
                onChange={value => setForm(prev => ({ ...prev, expiry_date: value }))}
              />
            </div>
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                Unit Price (USD) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.unit_price_in_usd}
                  onChange={e => setForm(prev => ({ ...prev, unit_price_in_usd: e.target.value }))}
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
                  value={form.exchange_rate_from_usd_to_riel}
                  onChange={e => setForm(prev => ({ ...prev, exchange_rate_from_usd_to_riel: e.target.value }))}
                  min={0}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground">USD to Riel</p>
            </div>
          </div>

          {/* Movement Date */}
          <div className="space-y-2">
            <DatePickerInput 
              id="movement_date"
              required={true}
              label="Reorder Date"
              value={form.movement_date}
              onChange={value => setForm(prev => ({ ...prev, movement_date: value }))}
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              Note <span className="text-xs text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              placeholder="e.g. Reorder due to low stock"
              value={form.note}
              onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
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
            type="submit"
            disabled={!isValid || reorderMutation.isPending || disabled}
          >
            {reorderMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
