import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { OrderItem, Product } from "../types";
import { formatCurrency } from "../utils/order-utils";

interface FormItemTableProps {
  items: OrderItem[];
  products: Product[];
  onRemoveItem: (productId: string) => void;
  onUpdateQty: (productId: string, qty: number) => void;
}

export function FormItemTable({ items, products, onRemoveItem, onUpdateQty }: FormItemTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-border rounded-md bg-muted/30">
        <p className="text-sm font-medium text-foreground">No items added yet</p>
        <p className="text-xs text-muted-foreground">Select a product above and click Add Item.</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-muted/40 border-b border-border">
          <tr className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            <th className="px-4 py-2.5">Product</th>
            <th className="px-4 py-2.5 text-center">Qty</th>
            <th className="px-4 py-2.5 text-right">Price</th>
            <th className="px-4 py-2.5 text-right">Total</th>
            <th className="px-4 py-2.5 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm">
          {items.map(item => {
            const product = products.find(productItem => productItem.id === item.productId);
            const hasResolvedPrice = item.priceAtSale > 0;
            return (
              <tr key={item.productId} className="bg-card">
                <td className="px-4 py-3 font-medium text-foreground">
                  <div>{item.productName ?? product?.name ?? item.productId}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.productSku ? `SKU: ${item.productSku}` : "SKU: -"}
                    {item.productCategory ? ` · ${item.productCategory}` : ""}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Input
                    type="number"
                    min={1}
                    className="h-8 w-20 text-center mx-auto"
                    value={item.qty}
                    onChange={event => onUpdateQty(item.productId, Number(event.target.value) || 1)}
                  />
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {hasResolvedPrice ? formatCurrency(item.priceAtSale) : "Auto"}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {hasResolvedPrice ? formatCurrency(item.qty * item.priceAtSale) : "Auto"}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onRemoveItem(item.productId)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
