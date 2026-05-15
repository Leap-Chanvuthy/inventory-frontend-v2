import type { OrderItem, Product } from "../types";
import type { SaleAllocationPreview } from "@/api/product/product.type";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { buildOrderItemsFormColumns } from "../utils/table-feature";

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
      <DataTable
        columns={buildOrderItemsFormColumns({
          products,
          onRemoveItem,
          onUpdateQty,
          itemErrors,
          allocationPreviewByProductId,
          isPreviewLoadingByProductId,
          previewMessageByProductId,
        })}
        data={items}
        emptyText="No items added yet."
      />
    </div>
  );
}
