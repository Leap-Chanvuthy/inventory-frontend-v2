import { useState } from "react";
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
  CalendarClock,
  FileText,
} from "lucide-react";
import { useReorderRawMaterial } from "@/api/raw-materials/raw-material.mutation";

interface ReorderDialogProps {
  rawMaterialId: number;
  materialName: string;
}

export function ReorderDialog({ rawMaterialId, materialName }: ReorderDialogProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [unitPriceInUsd, setUnitPriceInUsd] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [movementDate, setMovementDate] = useState("");
  const [note, setNote] = useState("");

  const reorderMutation = useReorderRawMaterial(rawMaterialId);

  const resetForm = () => {
    setQuantity("");
    setUnitPriceInUsd("");
    setExchangeRate("");
    setMovementDate("");
    setNote("");
  };

  const handleSubmit = async () => {
    const payload = {
      quantity: Number(quantity),
      unit_price_in_usd: Number(unitPriceInUsd),
      exchange_rate_from_usd_to_riel: Number(exchangeRate),
      movement_date: movementDate,
      ...(note && { note }),
    };

    reorderMutation.mutate(payload, {
      onSuccess: () => {
        resetForm();
        setOpen(false);
      },
    });
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) resetForm();
  };

  const isValid =
    Number(quantity) > 0 &&
    Number(unitPriceInUsd) > 0 &&
    Number(exchangeRate) > 0 &&
    movementDate !== "";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reorder
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
          {/* Quantity */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              Quantity <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min={0}
            />
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
                  value={unitPriceInUsd}
                  onChange={e => setUnitPriceInUsd(e.target.value)}
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
                  value={exchangeRate}
                  onChange={e => setExchangeRate(e.target.value)}
                  min={0}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-muted-foreground">USD to Riel</p>
            </div>
          </div>

          {/* Movement Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5 text-muted-foreground" />
              Movement Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={movementDate}
              onChange={e => setMovementDate(e.target.value)}
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
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
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
