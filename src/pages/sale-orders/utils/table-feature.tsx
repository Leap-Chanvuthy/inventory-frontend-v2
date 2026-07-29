import { useEffect, useState } from "react";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "./order-utils";
import type { OrderItem, Product } from "../types";
import type { SaleAllocationPreview } from "@/api/product/product.type";

export function QuantityInput({
  value,
  quantityType,
  hasError,
  onChange,
}: {
  value: number;
  quantityType: Product["quantityType"];
  hasError: boolean;
  onChange: (value: number) => void;
}) {
  const [draftValue, setDraftValue] = useState(String(value || 1));
  const isInteger = quantityType === "INTEGER";
  const step = isInteger ? 1 : 0.01;
  const min = isInteger ? 1 : 0.0001;

  useEffect(() => {
    setDraftValue(String(value || 1));
  }, [value]);

  const commitValue = (rawValue: string) => {
    const parsed = Number(rawValue);

    if (Number.isFinite(parsed) && parsed > 0) {
      onChange(parsed);
      return;
    }

    setDraftValue(String(value || 1));
  };

  return (
    <Input
      type="number"
      min={min}
      step={step}
      className={`h-8 w-20 text-center ${hasError ? "border-destructive focus-visible:ring-destructive" : ""}`}
      value={draftValue}
      onFocus={event => event.currentTarget.select()}
      onChange={event => {
        const rawValue = event.target.value;
        setDraftValue(rawValue);

        if (rawValue.trim() === "" || rawValue.endsWith(".")) {
          return;
        }

        const parsed = Number(rawValue);
        if (Number.isFinite(parsed) && parsed > 0) {
          onChange(parsed);
        }
      }}
      onBlur={() => commitValue(draftValue)}
      onKeyDown={event => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        }
      }}
    />
  );
}

export const buildOrderItemsViewColumns = (): DataTableColumn<OrderItem>[] => [
  {
    key: "product",
    header: "Product Details",
    className: "min-w-[280px]",
    render: item => (
      <div>
        <Link to={`/products/view/${item.productDbId}`} className="font-medium text-primary hover:underline">
          {item.productName ?? item.productId}
        </Link>
        <div className="mt-0.5 text-xs text-muted-foreground">
          SKU: {item.productSku || item.productId}
          {item.productCategory ? ` · ${item.productCategory}` : ""}
        </div>
      </div>
    ),
  },
  {
    key: "qty",
    header: "Qty",
    className: "text-center",
    render: item => <span className="font-medium text-foreground">{item.qty}</span>,
  },
  {
    key: "unit_price",
    header: "Unit Price",
    className: "text-right",
    render: item => (
      <span className="text-muted-foreground">
        {item.priceAtSale > 0 ? formatCurrency(item.priceAtSale) : "Auto"}
      </span>
    ),
  },
  {
    key: "line_total",
    header: "Total",
    className: "text-right",
    render: item => (
      <span className="font-semibold text-foreground">
        {item.priceAtSale > 0 ? formatCurrency(item.qty * item.priceAtSale) : "Auto"}
      </span>
    ),
  },
  {
    key: "allocation",
    header: "Stock Batch Used",
    className: "min-w-[360px]",
    render: item => {
      const lots = item.allocationSummary?.lots ?? [];
      if (!lots.length) {
        return <span className="text-xs text-muted-foreground">No allocation details.</span>;
      }

      return (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer select-none text-foreground">
            {lots.length} lot{lots.length > 1 ? "s" : ""} · {item.allocationSummary?.saleMethod === "LIFO" ? "LIFO" : "FIFO"}
          </summary>
          <div className="mt-2 space-y-1">
            {lots.map((lot, idx) => (
              <div key={`${item.productId}-${lot.sourceMovementId}-${idx}`} className="flex flex-wrap items-center gap-x-2">
                <span>Batch #{lot.sourceMovementId}</span>
                <span>{lot.allocatedQuantity} × {formatCurrency(Number(lot.sellingUnitPriceInUsd ?? 0))}</span>
                <span>= {formatCurrency(Number(lot.lineTotalUsd ?? 0))}</span>
              </div>
            ))}
          </div>
        </details>
      );
    },
  },
];

type BuildOrderItemsFormColumnsParams = {
  products: Product[];
  onRemoveItem: (productId: string) => void;
  onUpdateQty: (productId: string, qty: number) => void;
  itemErrors: Record<string, string>;
  allocationPreviewByProductId: Record<string, SaleAllocationPreview | undefined>;
  isPreviewLoadingByProductId: Record<string, boolean>;
  previewMessageByProductId: Record<string, string | undefined>;
};

export const buildOrderItemsFormColumns = ({
  products,
  onRemoveItem,
  onUpdateQty,
  itemErrors,
  allocationPreviewByProductId,
  isPreviewLoadingByProductId,
  previewMessageByProductId,
}: BuildOrderItemsFormColumnsParams): DataTableColumn<OrderItem>[] => [
  {
    key: "product",
    header: "Product",
    className: "min-w-[280px]",
    render: item => {
      const saleMethod = allocationPreviewByProductId[item.productId]?.sale_method;
      const saleMethodHelp =
        saleMethod === "LIFO"
          ? "LIFO: newest stock sold first"
          : "FIFO: oldest stock sold first";

      return (
        <div>
          <div>{item.productName ?? products.find(p => p.id === item.productId)?.name ?? item.productId}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {item.productSku ? `SKU: ${item.productSku}` : "SKU: -"}
            {item.productCategory ? ` · ${item.productCategory}` : ""}
          </div>
          {saleMethod ? <p className="mt-1 text-[11px] text-muted-foreground">{saleMethodHelp}</p> : null}
        </div>
      );
    },
  },
  {
    key: "stock",
    header: "Stock",
    className: "text-right",
    render: item => {
      const product = products.find(p => p.id === item.productId);
      const preview = allocationPreviewByProductId[item.productId];
      const stockQty = Number(preview?.available_quantity ?? product?.stockQty ?? 0);
      return <span className="font-medium text-foreground">{stockQty}</span>;
    },
  },
  {
    key: "uom",
    header: "UOM",
    render: item => products.find(p => p.id === item.productId)?.uomName || "-",
  },
  {
    key: "qty",
    header: "Qty",
    className: "min-w-[160px]",
    render: item => {
      const product = products.find(p => p.id === item.productId);
      const quantityType = product?.quantityType ?? "DECIMAL";
      const preview = allocationPreviewByProductId[item.productId];
      const hasStockError = preview !== undefined && !preview?.can_fulfill;
      const hasError = !!itemErrors[item.productId] || hasStockError;

      return (
        <div>
          <QuantityInput
            value={item.qty}
            quantityType={quantityType}
            hasError={hasError}
            onChange={value => onUpdateQty(item.productId, value)}
          />
          {itemErrors[item.productId] ? (
            <p className="mt-1 text-[11px] text-destructive">{itemErrors[item.productId]}</p>
          ) : null}
        </div>
      );
    },
  },
  {
    key: "price",
    header: "Price",
    className: "text-right",
    render: item => {
      const preview = allocationPreviewByProductId[item.productId];
      const isPreviewLoading = isPreviewLoadingByProductId[item.productId];
      const estimatedUnitPrice =
        preview && item.qty > 0
          ? Number(preview.estimated_average_unit_price_usd ?? 0)
          : item.priceAtSale;
      const hasResolvedPrice = item.priceAtSale > 0;

      if (isPreviewLoading) return "Calculating...";
      if (estimatedUnitPrice > 0) return formatCurrency(estimatedUnitPrice);
      return hasResolvedPrice ? formatCurrency(item.priceAtSale) : "Auto";
    },
  },
  {
    key: "total",
    header: "Total",
    className: "text-right",
    render: item => {
      const preview = allocationPreviewByProductId[item.productId];
      const isPreviewLoading = isPreviewLoadingByProductId[item.productId];
      const estimatedLineTotal = preview
        ? Number(preview.estimated_total_usd ?? 0)
        : item.qty * item.priceAtSale;
      const hasResolvedPrice = item.priceAtSale > 0;

      if (isPreviewLoading) return "Calculating...";
      if (estimatedLineTotal > 0) return <span className="font-semibold text-foreground">{formatCurrency(estimatedLineTotal)}</span>;
      return hasResolvedPrice ? <span className="font-semibold text-foreground">{formatCurrency(item.qty * item.priceAtSale)}</span> : "Auto";
    },
  },
  {
    key: "allocation_preview",
    header: "Allocation Preview",
    className: "min-w-[360px]",
    render: item => {
      const preview = allocationPreviewByProductId[item.productId];
      const isPreviewLoading = isPreviewLoadingByProductId[item.productId];
      const previewMessage = previewMessageByProductId[item.productId];

      if (isPreviewLoading) {
        return <p className="text-[11px] text-muted-foreground">Calculating stock batch usage...</p>;
      }

      if (preview?.can_fulfill) {
        return (
          <details className="text-[11px] text-muted-foreground">
            <summary className="cursor-pointer select-none text-foreground">
              {preview.lots.length} lot{preview.lots.length > 1 ? "s" : ""} · Estimated total {formatCurrency(Number(preview.estimated_total_usd ?? 0))}
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
        );
      }

      if (!preview?.can_fulfill && previewMessage) {
        return <p className="text-[11px] text-destructive">{previewMessage}</p>;
      }

      return <span className="text-[11px] text-muted-foreground">-</span>;
    },
  },
  {
    key: "action",
    header: "Action",
    className: "text-center",
    render: item => (
      <button
        onClick={() => onRemoveItem(item.productId)}
        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    ),
  },
];

export const ORDER_ITEMS_COLUMNS = buildOrderItemsViewColumns;
