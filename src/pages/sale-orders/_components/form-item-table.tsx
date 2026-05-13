import { Trash2 } from "lucide-react";
import { Fragment } from "react";
import { Input } from "@/components/ui/input";
import type { OrderItem, Product } from "../types";
import { formatCurrency } from "../utils/order-utils";
import type { SaleAllocationPreview } from "@/api/product/product.type";

interface FormItemTableProps {
  items: OrderItem[];
  products: Product[];
  onRemoveItem: (productId: string) => void;
  onUpdateQty: (productId: string, qty: number) => void;
  itemErrors: Record<string, string>;
  allocationPreviewByProductId: Record<string, SaleAllocationPreview | undefined>;
  isPreviewLoadingByProductId: Record<string, boolean>;
  previewMessageByProductId: Record<string, string | undefined>;
}

export function FormItemTable({
  items,
  products,
  onRemoveItem,
  onUpdateQty,
  itemErrors,
  allocationPreviewByProductId,
  isPreviewLoadingByProductId,
  previewMessageByProductId,
}: FormItemTableProps) {
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
            <th className="px-4 py-2.5 text-right">Stock</th>
            <th className="px-4 py-2.5 text-left">UOM</th>
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
            const preview = allocationPreviewByProductId[item.productId];
            const stockQty = Number(preview?.available_quantity ?? product?.stockQty ?? 0);
            const uomName = product?.uomName || "-";
            const quantityType = product?.quantityType ?? "DECIMAL";
            const step = quantityType === "INTEGER" ? 1 : 0.01;
            const isPreviewLoading = isPreviewLoadingByProductId[item.productId];
            const previewMessage = previewMessageByProductId[item.productId];
            const estimatedUnitPrice =
              preview && item.qty > 0
                ? Number(preview.estimated_average_unit_price_usd ?? 0)
                : item.priceAtSale;
            const estimatedLineTotal =
              preview
                ? Number(preview.estimated_total_usd ?? 0)
                : item.qty * item.priceAtSale;
            const saleMethodHelp =
              preview?.sale_method === "LIFO"
                ? "LIFO: newest stock sold first"
                : "FIFO: oldest stock sold first";

            return (
              <Fragment key={item.productId}>
                <tr className="bg-card">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div>{item.productName ?? product?.name ?? item.productId}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {item.productSku ? `SKU: ${item.productSku}` : "SKU: -"}
                      {item.productCategory ? ` · ${item.productCategory}` : ""}
                    </div>
                    {preview?.sale_method ? (
                      <p className="mt-1 text-[11px] text-muted-foreground">{saleMethodHelp}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">{stockQty}</td>
                  <td className="px-4 py-3 text-muted-foreground">{uomName}</td>
                  <td className="px-4 py-3 text-center">
                    <Input
                      type="number"
                      min={1}
                      step={step}
                      className="h-8 w-20 text-center mx-auto"
                      value={item.qty}
                      onChange={event => onUpdateQty(item.productId, Number(event.target.value) || 1)}
                    />
                    {itemErrors[item.productId] ? (
                      <p className="mt-1 text-[11px] text-destructive text-left w-40">
                        {itemErrors[item.productId]}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {isPreviewLoading
                      ? "Calculating..."
                      : (estimatedUnitPrice > 0 ? formatCurrency(estimatedUnitPrice) : (hasResolvedPrice ? formatCurrency(item.priceAtSale) : "Auto"))}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {isPreviewLoading
                      ? "Calculating..."
                      : (estimatedLineTotal > 0 ? formatCurrency(estimatedLineTotal) : (hasResolvedPrice ? formatCurrency(item.qty * item.priceAtSale) : "Auto"))}
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

                {(isPreviewLoading || preview || previewMessage) ? (
                  <tr className="bg-muted/20">
                    <td colSpan={7} className="px-4 py-2.5">
                      {isPreviewLoading ? (
                        <p className="text-[11px] text-muted-foreground">Calculating stock batch usage...</p>
                      ) : null}

                      {!isPreviewLoading && preview?.can_fulfill ? (
                        <details className="text-[11px] text-muted-foreground">
                          <summary className="cursor-pointer select-none text-foreground">
                            Stock batch used preview: {preview.lots.length} lot{preview.lots.length > 1 ? "s" : ""} · Estimated total {formatCurrency(Number(preview.estimated_total_usd ?? 0))}
                          </summary>
                          <div className="mt-2 space-y-1">
                            {preview.lots.map(lot => (
                              <div key={`${item.productId}-${lot.source_movement_id}`} className="flex flex-wrap items-center gap-x-2">
                                <span>Batch #{lot.source_movement_id}</span>
                                <span>{lot.allocated_quantity} × {formatCurrency(Number(lot.selling_unit_price_in_usd ?? 0))}</span>
                                <span>= {formatCurrency(Number(lot.line_total_usd ?? 0))}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      ) : null}

                      {!isPreviewLoading && !preview?.can_fulfill && previewMessage ? (
                        <p className="text-[11px] text-destructive">{previewMessage}</p>
                      ) : null}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
