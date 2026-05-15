import { Package } from "lucide-react";
import type { Order } from "../types";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { ORDER_ITEMS_COLUMNS } from "../utils/table-feature";

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
      <DataTable
        columns={ORDER_ITEMS_COLUMNS()}
        data={order.items}
        emptyText="No order items."
      />
    </div>
  );
}
