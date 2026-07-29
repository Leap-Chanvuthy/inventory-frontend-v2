import type { OrderItem, Product } from "../types";
import type { SaleAllocationPreview } from "@/api/product/product.type";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "../utils/order-utils";
import { QuantityInput } from "../utils/table-feature";

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
    <div className="space-y-3">
      {items.map(item => {
        const product = products.find(p => p.id === item.productId);
        const preview = allocationPreviewByProductId[item.productId];
        const isPreviewLoading = isPreviewLoadingByProductId[item.productId];
        const previewMessage = previewMessageByProductId[item.productId];
        const stockQty = Number(preview?.available_quantity ?? product?.stockQty ?? 0);
        const quantityType = product?.quantityType ?? "DECIMAL";
        const hasStockError = preview !== undefined && !preview?.can_fulfill;
        const hasError = !!itemErrors[item.productId] || hasStockError;
        const estimatedUnitPrice =
          preview && item.qty > 0
            ? Number(preview.estimated_average_unit_price_usd ?? 0)
            : item.priceAtSale;
        const estimatedLineTotal = preview
          ? Number(preview.estimated_total_usd ?? 0)
          : item.qty * item.priceAtSale;
        const saleMethodHelp =
          preview?.sale_method === "LIFO"
            ? "LIFO: newest stock sold first"
            : "FIFO: oldest stock sold first";

        return (
          <div
            key={item.productId}
            className="rounded-md border border-border bg-card p-3"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground">
                  {item.productName ?? product?.name ?? item.productId}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {item.productSku ? `SKU: ${item.productSku}` : "SKU: -"}
                  {item.productCategory ? ` · ${item.productCategory}` : ""}
                </div>
                {preview?.sale_method ? (
                  <p className="mt-1 text-[11px] text-muted-foreground">{saleMethodHelp}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onRemoveItem(item.productId)}
                className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remove ${item.productName ?? product?.name ?? "item"}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_0.9fr_0.9fr_1fr]">
              <div className="rounded-md bg-muted/30 px-3 py-2">
                <div className="text-[11px] font-medium uppercase text-muted-foreground">Stock</div>
                <div className="mt-1 font-semibold text-foreground">{stockQty}</div>
              </div>
              <div className="rounded-md bg-muted/30 px-3 py-2">
                <div className="text-[11px] font-medium uppercase text-muted-foreground">UOM</div>
                <div className="mt-1 font-semibold text-foreground">{product?.uomName || "-"}</div>
              </div>
              <div className="rounded-md bg-muted/30 px-3 py-2">
                <div className="text-[11px] font-medium uppercase text-muted-foreground">Qty</div>
                <div className="mt-1">
                  <QuantityInput
                    value={item.qty}
                    quantityType={quantityType}
                    hasError={hasError}
                    onChange={value => onUpdateQty(item.productId, value)}
                  />
                </div>
              </div>
              <div className="rounded-md bg-muted/30 px-3 py-2">
                <div className="text-[11px] font-medium uppercase text-muted-foreground">Price / Total</div>
                <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-sm text-muted-foreground">
                    {isPreviewLoading
                      ? "Calculating..."
                      : estimatedUnitPrice > 0
                        ? formatCurrency(estimatedUnitPrice)
                        : item.priceAtSale > 0
                          ? formatCurrency(item.priceAtSale)
                          : "Auto"}
                  </span>
                  <span className="font-semibold text-foreground">
                    {isPreviewLoading
                      ? "Calculating..."
                      : estimatedLineTotal > 0
                        ? formatCurrency(estimatedLineTotal)
                        : item.priceAtSale > 0
                          ? formatCurrency(item.qty * item.priceAtSale)
                          : "Auto"}
                  </span>
                </div>
              </div>
            </div>

            {itemErrors[item.productId] ? (
              <p className="mt-2 text-[11px] text-destructive">{itemErrors[item.productId]}</p>
            ) : null}

            <div className="mt-3 rounded-md border border-border/70 px-3 py-2">
              {isPreviewLoading ? (
                <p className="text-[11px] text-muted-foreground">Calculating stock batch usage...</p>
              ) : preview?.can_fulfill ? (
                <details className="text-[11px] text-muted-foreground">
                  <summary className="cursor-pointer select-none text-foreground">
                    {preview.lots.length} lot{preview.lots.length > 1 ? "s" : ""} · Estimated total {formatCurrency(Number(preview.estimated_total_usd ?? 0))}
                  </summary>
                  <div className="mt-2 space-y-1">
                    {preview.lots.map(lot => (
                      <div key={`${item.productId}-${lot.source_movement_id}`} className="flex flex-wrap items-center gap-x-2">
                        <span>Batch #{lot.source_movement_id}</span>
                        <span>{lot.allocated_quantity} x {formatCurrency(Number(lot.selling_unit_price_in_usd ?? 0))}</span>
                        <span>= {formatCurrency(Number(lot.line_total_usd ?? 0))}</span>
                      </div>
                    ))}
                  </div>
                </details>
              ) : !preview?.can_fulfill && previewMessage ? (
                <p className="text-[11px] text-destructive">{previewMessage}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground">Allocation preview will appear after quantity is entered.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
