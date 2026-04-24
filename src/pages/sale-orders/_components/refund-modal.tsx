import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PRODUCTS } from "../constants";
import type { RefundData } from "../types";

interface RefundModalProps {
  open: boolean;
  refundData: RefundData;
  hasRefundSelection: boolean;
  onClose: () => void;
  onChangeQty: (index: number, qty: number) => void;
  onSubmit: () => void;
}

export function RefundModal({
  open,
  refundData,
  hasRefundSelection,
  onClose,
  onChangeQty,
  onSubmit,
}: RefundModalProps) {
  if (!open || !refundData.orderId) return null;

  return (
    <Dialog open={open} onOpenChange={nextOpen => (!nextOpen ? onClose() : undefined)}>
      <DialogContent className="max-w-2xl p-0 gap-0 max-h-[90vh] overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b border-border">
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-primary" />
            Refund Order Items
          </DialogTitle>
          <p className="text-xs text-muted-foreground">Order {refundData.orderId}</p>
        </DialogHeader>

        <div className="p-4 overflow-y-auto bg-muted/20 flex-1">
          <div className="bg-card border border-border rounded-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/40 border-b border-border">
                <tr className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  <th className="px-4 py-2.5">Product</th>
                  <th className="px-4 py-2.5 text-center">Purchased</th>
                  <th className="px-4 py-2.5 text-center">Refund Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {refundData.items.map((item, index) => {
                  const product = PRODUCTS.find(productItem => productItem.id === item.productId);
                  return (
                    <tr key={`${item.productId}-${index}`}>
                      <td className="px-4 py-3 text-foreground font-medium">{product?.name ?? item.productId}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{item.maxQty}</td>
                      <td className="px-4 py-3 flex justify-center">
                        <Input
                          type="number"
                          min="0"
                          max={item.maxQty}
                          className="w-20 h-8 text-center"
                          value={item.refundQty}
                          onChange={event => onChangeQty(index, Number(event.target.value) || 0)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="px-4 py-3 border-t border-border bg-card flex-row justify-between items-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />
            This action cannot be undone
          </p>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" size="sm">
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!hasRefundSelection}
              size="sm"
            >
              Process Refund
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
