import { Package } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import type { Order } from "../types";
import { formatCurrency } from "../utils/order-utils";

interface ProductTableProps {
  order: Order;
}

export function ProductTable({ order }: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="rounded-md bg-blue-500/10 p-1 text-blue-600">
          <Package className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold">Order Items</h3>
      </div>
      <table className="w-full text-left">
        <thead className="border-b border-border bg-muted/40">
          <tr className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2.5">Product Details</th>
            <th className="px-4 py-2.5 text-center">Qty</th>
            <th className="px-4 py-2.5 text-right">Unit Price</th>
            <th className="px-4 py-2.5 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm">
          {order.items.map((item, index) => {
            return (
              <Fragment key={`${item.productId}-${index}`}>
                <tr className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link to={`/products/view/${item.productDbId}`} className="font-medium text-primary hover:underline">
                      {item.productName ?? item.productId}
                    </Link>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      SKU: {item.productSku || item.productId}
                      {item.productCategory ? ` · ${item.productCategory}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-foreground">{item.qty}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {item.priceAtSale > 0 ? formatCurrency(item.priceAtSale) : "Auto"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {item.priceAtSale > 0 ? formatCurrency(item.qty * item.priceAtSale) : "Auto"}
                  </td>
                </tr>
                {item.allocationSummary?.lots?.length ? (
                  <tr className="bg-muted/20">
                    <td colSpan={4} className="px-4 py-2.5">
                      <details className="text-xs text-muted-foreground">
                        <summary className="cursor-pointer select-none text-foreground">
                          Stock batch used: {item.allocationSummary.lots.length} lot{item.allocationSummary.lots.length > 1 ? "s" : ""} ·
                          {" "}Sale Method: {item.allocationSummary.saleMethod === "LIFO" ? "LIFO: newest stock sold first" : "FIFO: oldest stock sold first"}
                        </summary>
                        <div className="mt-2 space-y-1">
                          {item.allocationSummary.lots.map((lot, lotIndex) => (
                            <div key={`${item.productId}-${lot.sourceMovementId}-${lotIndex}`} className="flex flex-wrap items-center gap-x-2">
                              <span>Batch #{lot.sourceMovementId}</span>
                              <span>{lot.allocatedQuantity} × {formatCurrency(Number(lot.sellingUnitPriceInUsd ?? 0))}</span>
                              <span>= {formatCurrency(Number(lot.lineTotalUsd ?? 0))}</span>
                            </div>
                          ))}
                        </div>
                      </details>
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
