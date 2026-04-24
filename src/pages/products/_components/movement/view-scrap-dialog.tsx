import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUpFromLine } from "lucide-react";
import { formatDate } from "@/utils/date-format";
import { ProductMovement } from "@/api/product/product.type";
import { useScrapMovement } from "@/api/product/product.query";

interface ViewScrapDialogProps {
  movement: ProductMovement;
  productId: number;
  open: boolean;
  onClose: () => void;
}

export function ViewScrapDialog({
  movement,
  productId,
  open,
  onClose,
}: ViewScrapDialogProps) {
  const { data, isLoading } = useScrapMovement(productId, movement.id);
  const mv = data?.data?.movement;

  const rows: { label: string; value: React.ReactNode }[] = mv
    ? [
        { label: "Movement Type", value: "SCRAP" },
        {
          label: "Direction",
          value: (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
              <ArrowUpFromLine className="h-3.5 w-3.5" />
              OUT
            </span>
          ),
        },
        { label: "Quantity", value: Number(mv.quantity).toFixed(2) },
        { label: "Status", value: mv.product_status ?? "—" },
        { label: "Movement Date", value: formatDate(mv.movement_date) },
        { label: "Created By", value: data?.data?.product?.product_name ?? "—" },
        ...(mv.note ? [{ label: "Note", value: mv.note }] : []),
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scrap Movement Detail</DialogTitle>
          <DialogDescription>Scrap stock movement record</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="divide-y text-sm">
            {rows.map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center py-2.5 gap-4"
              >
                <span className="text-muted-foreground shrink-0">{label}</span>
                <span className="font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
