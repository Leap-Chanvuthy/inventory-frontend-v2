import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePickerInput, TextAreaInput, TextInput } from "@/components/reusable/partials/input";
import { ProductMovement, UpdateScrapMovementPayload } from "@/api/product/product.type";
import { useUpdateScrapMovement } from "@/api/product/product.mutation";
import { AxiosError } from "axios";

interface EditScrapDialogProps {
  movement: ProductMovement;
  productId: number;
  open: boolean;
  onClose: () => void;
}

export function EditScrapDialog({
  movement,
  productId,
  open,
  onClose,
}: EditScrapDialogProps) {
  const mutation = useUpdateScrapMovement(productId, movement.id);

  const [form, setForm] = useState({
    quantity: String(parseFloat(movement.quantity)),
    movement_date: movement.movement_date.split("T")[0],
    note: movement.note ?? "",
  });

  useEffect(() => {
    setForm({
      quantity: String(parseFloat(movement.quantity)),
      movement_date: movement.movement_date.split("T")[0],
      note: movement.note ?? "",
    });
  }, [movement]);

  const handleChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const apiErrors = (mutation.error as AxiosError<{ errors?: { available_qty?: number } }> | null)
    ?.response?.data?.errors;
  const availableQty = apiErrors?.available_qty;
  const quantityError = availableQty !== undefined
    ? `Insufficient stock. Only ${availableQty} available.`
    : undefined;

  const isValid = form.quantity.trim() !== "" && form.movement_date !== "";

  const handleSubmit = () => {
    if (!isValid) return;
    const payload: UpdateScrapMovementPayload = {
      quantity: Number(form.quantity),
      movement_date: form.movement_date,
      ...(form.note.trim() ? { note: form.note.trim() } : {}),
    };
    mutation.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Scrap Movement</DialogTitle>
          <DialogDescription>Update the scrap movement details.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <TextInput
            id="edit-scrap-quantity"
            label="Quantity"
            value={form.quantity}
            onChange={e => { mutation.reset(); handleChange("quantity")(e); }}
            isNumberOnly
            required
            error={quantityError}
          />

          <DatePickerInput
            id="edit-scrap-movement-date"
            label="Scrap Date"
            value={form.movement_date}
            onChange={v => setForm(prev => ({ ...prev, movement_date: v }))}
            required
          />

          <TextAreaInput
            id="edit-scrap-note"
            label="Note"
            placeholder="e.g. Scrapped due to defect"
            value={form.note}
            onChange={handleChange("note")}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
