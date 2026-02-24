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
import { useReorderRawMaterial } from "@/api/raw-materials/raw-material.mutation";
import { DatePickerInput } from "@/components/reusable/partials/input";
import { ReorderRawMaterialPayload } from "@/api/raw-materials/raw-material.types";

interface ReorderDialogProps {
  rawMaterialId: number;
  materialName: string;
}

export function ReorderDialog({ rawMaterialId, materialName }: ReorderDialogProps) {
  const reorderMutation = useReorderRawMaterial(rawMaterialId);

  const INITIAL_FORM = useMemo(
    () => ({
      quantity: "",
      unit_price_in_usd: "",
      exchange_rate_from_usd_to_riel: "4100",
      movement_date: "",
      expiry_date: "",
      note: "",
    }),
    []
  );

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const resetForm = () => setForm(INITIAL_FORM);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  };

  const isValid = useMemo(() => {
    const quantity = Number(form.quantity);
    const unitPrice = Number(form.unit_price_in_usd);
    const exchangeRate = Number(form.exchange_rate_from_usd_to_riel);
    return quantity > 0 && unitPrice > 0 && exchangeRate > 0 && form.movement_date !== "";
  }, [form]);

  const handleSubmit = () => {
    if (!isValid || reorderMutation.isPending) return;

    const payload: ReorderRawMaterialPayload = {
      quantity: Number(form.quantity),
      unit_price_in_usd: Number(form.unit_price_in_usd),
      exchange_rate_from_usd_to_riel: Number(form.exchange_rate_from_usd_to_riel),
      movement_date: form.movement_date,
      expiry_date: form.expiry_date,
      ...(form.note.trim() ? { note: form.note.trim() } : {}),
    };

    reorderMutation.mutate(payload, {
      onSuccess: () => {
        resetForm();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reorder Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reorder Raw Material</DialogTitle>
          <DialogDescription>
            Create a reorder stock movement for <strong>{materialName}</strong>.
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
            disabled={!isValid || reorderMutation.isPending}
          >
            {reorderMutation.isPending ? (
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
