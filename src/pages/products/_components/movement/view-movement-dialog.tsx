import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { formatDate } from "@/utils/date-format";
import { ProductMovement } from "@/api/product/product.type";
import {
  useExternalReorderMovement,
  useInternalReorderMovement,
} from "@/api/product/product.query";

interface ViewMovementDialogProps {
  movement: ProductMovement;
  productId: number;
  productType: string;
  open: boolean;
  onClose: () => void;
}

export function ViewMovementDialog({
  movement,
  productId,
  productType,
  open,
  onClose,
}: ViewMovementDialogProps) {
  const isInternal = productType === "INTERNAL_PRODUCED";

  const { data: externalDetail, isLoading: externalLoading } =
    useExternalReorderMovement(
      !isInternal ? productId : 0,
      !isInternal ? movement.id : 0,
    );
  const { data: internalDetail, isLoading: internalLoading } =
    useInternalReorderMovement(
      isInternal ? productId : 0,
      isInternal ? movement.id : 0,
    );

  const isLoading = isInternal ? internalLoading : externalLoading;
  const mv =
    (isInternal
      ? internalDetail?.data?.movement
      : externalDetail?.data?.movement) ?? movement;

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Movement Type", value: mv.movement_type.replace(/_/g, " ") },
    {
      label: "Direction",
      value: (
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold ${mv.direction === "IN" ? "text-green-600" : "text-red-600"}`}
        >
          {mv.direction === "IN" ? (
            <ArrowDownToLine className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpFromLine className="h-3.5 w-3.5" />
          )}
          {mv.direction}
        </span>
      ),
    },
    { label: "Quantity", value: parseFloat(mv.quantity).toFixed(2) },
    { label: "Status", value: mv.product_status ?? "—" },
    {
      label: "Selling Price (USD)",
      value: `$${Number(mv.selling_unit_price_in_usd).toLocaleString()}`,
    },
    {
      label: "Selling Price (KHR)",
      value: `៛${mv.selling_unit_price_in_riel?.toLocaleString() ?? "—"}`,
    },
    ...(mv.purchase_unit_price_in_usd != null &&
    Number(mv.purchase_unit_price_in_usd) > 0
      ? [
          {
            label: "Purchase Price (USD)",
            value: `$${Number(mv.purchase_unit_price_in_usd).toLocaleString()}`,
          },
          {
            label: "Purchase Price (KHR)",
            value: `៛${mv.purchase_unit_price_in_riel?.toLocaleString() ?? "—"}`,
          },
        ]
      : []),
    { label: "Movement Date", value: formatDate(mv.movement_date) },
    { label: "Created By", value: mv.created_by?.name ?? "—" },
    ...(mv.note ? [{ label: "Note", value: mv.note }] : []),
  ];

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Movement Detail</DialogTitle>
          <DialogDescription>Stock movement record</DialogDescription>
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
