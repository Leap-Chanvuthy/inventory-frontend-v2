import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { DatePickerInput, TextAreaInput, TextInput } from "@/components/reusable/partials/input";
import { useCreateScrapMovement } from "@/api/product/product.mutation";
import { CreateScrapMovementPayload } from "@/api/product/product.type";
import { AxiosError } from "axios";

interface ScrapDialogProps {
  productId: number;
  productName: string;
}

const INITIAL = {
  quantity: "",
  movement_date: "",
  note: "",
};

export function ScrapDialog({ productId, productName }: ScrapDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);

  const mutation = useCreateScrapMovement(productId);

  const apiErrors = (mutation.error as AxiosError<{ errors?: { available_qty?: number } }> | null)
    ?.response?.data?.errors;
  const availableQty = apiErrors?.available_qty;
  const quantityError = availableQty !== undefined
    ? `Insufficient stock. Only ${availableQty} available.`
    : undefined;

  const handleChange = (field: keyof typeof INITIAL) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const reset = () => setForm(INITIAL);

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      reset();
      mutation.reset();
    }
    setOpen(v);
  };

  const isValid = form.quantity.trim() !== "" && form.movement_date !== "";

  const handleSubmit = () => {
    if (!isValid) return;
    const payload: CreateScrapMovementPayload = {
      quantity: Number(form.quantity),
      movement_date: form.movement_date,
      ...(form.note.trim() ? { note: form.note.trim() } : {}),
    };
    mutation.mutate(payload, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Scrap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scrap Product</DialogTitle>
          <DialogDescription>
            Record a scrap movement for <strong>{productName}</strong>. This will deduct the quantity from stock.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <TextInput
            id="scrap-quantity"
            label="Quantity"
            placeholder="e.g. 5"
            value={form.quantity}
            onChange={e => { mutation.reset(); handleChange("quantity")(e); }}
            isNumberOnly
            required
            error={quantityError}
          />

          <DatePickerInput
            id="scrap-movement-date"
            label="Scrap Date"
            value={form.movement_date}
            onChange={v => setForm(prev => ({ ...prev, movement_date: v }))}
            required
          />

          <TextAreaInput
            id="scrap-note"
            label="Note"
            placeholder="e.g. Scrapped due to defect"
            value={form.note}
            onChange={handleChange("note")}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!isValid || mutation.isPending}
          >
            {mutation.isPending ? "Scrapping..." : "Confirm Scrap"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
