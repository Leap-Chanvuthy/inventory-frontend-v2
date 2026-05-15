import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-format";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { ProductStockLot } from "@/api/product/product.type";
import { Link } from "react-router-dom";

export type ProductStockLotRow = ProductStockLot;

const statusBadgeClass = (status?: string) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized.includes("EXPIRED")) return "border-red-500 text-red-600";
  if (normalized.includes("FULLY")) return "border-slate-500 text-slate-600";
  if (normalized.includes("PARTIAL")) return "border-amber-500 text-amber-600";
  return "border-green-500 text-green-600";
};

export const PRODUCT_STOCK_LOT_COLUMNS = (
  expanded: Record<number, boolean>,
  onToggle: (lotId: number) => void,
): DataTableColumn<ProductStockLotRow>[] => [
  {
    key: "expand",
    header: "",
    className: "w-10",
    render: lot => {
      const isOpen = !!expanded[lot.id];
      return (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onToggle(lot.id)}
        >
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      );
    },
  },
  {
    key: "batch_code",
    header: "Batch",
    render: lot => <span className="font-medium">{lot.batch_code ?? `PM-${lot.id}`}</span>,
  },
  {
    key: "movement_type",
    header: "Type",
    render: lot => String(lot.movement_type || "").replace(/_/g, " "),
  },
  {
    key: "movement_date",
    header: "Date",
    render: lot => (lot.movement_date ? formatDate(lot.movement_date) : "—"),
  },
  {
    key: "expiry_date",
    header: "Expiry",
    render: lot => (lot.expiry_date ? formatDate(lot.expiry_date) : "—"),
  },
  {
    key: "quantity",
    header: "Original",
    className: "text-right",
    render: lot => Number(lot.quantity || 0).toFixed(2),
  },
  {
    key: "remaining_quantity",
    header: "Remaining",
    className: "text-right",
    render: lot => <span className="font-semibold">{Number(lot.remaining_quantity || 0).toFixed(2)}</span>,
  },
  {
    key: "sold_quantity",
    header: "Sold",
    className: "text-right",
    render: lot => Number(lot.sold_quantity || lot.allocated_quantity || 0).toFixed(2),
  },
  {
    key: "scrapped_quantity",
    header: "Scrapped",
    className: "text-right",
    render: lot => Number(lot.scrapped_quantity || 0).toFixed(2),
  },
  {
    key: "status",
    header: "Status",
    render: lot => (
      <Badge variant="outline" className={statusBadgeClass(lot.status || lot.lot_status)}>
        {String(lot.status || lot.lot_status || "AVAILABLE").replace(/_/g, " ")}
      </Badge>
    ),
  },
];

export const renderProductStockLotHistory = (lot: ProductStockLotRow) => {
  const children = lot.children ?? [];
  // const batchCode = lot.batch_code ?? `PM-${lot.id}`;
  if (children.length === 0) {
    return (
      <div className="py-2 pl-12">
        {/* <p className="text-xs font-semibold text-foreground mb-1">{batchCode}</p> */}
        <p className="text-xs text-muted-foreground">Batch History</p>
        <span className="text-xs text-muted-foreground">No child activity for this batch yet.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-2 pl-12">
      <div className="space-y-0.5">
        {/* <p className="text-xs font-semibold text-foreground">{batchCode}</p> */}
        <p className="text-xs font-semibold text-foreground">Batch History</p>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full text-xs">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Type</th>
              <th className="px-3 py-2 text-left font-medium">Reference</th>
              <th className="px-3 py-2 text-left font-medium">Customer</th>
              <th className="px-3 py-2 text-left font-medium">Sale Order</th>
              <th className="px-3 py-2 text-left font-medium">Raw Materials</th>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-right font-medium">Quantity</th>
              <th className="px-3 py-2 text-right font-medium">Unit Price</th>
              <th className="px-3 py-2 text-right font-medium">Total</th>
              <th className="px-3 py-2 text-left font-medium w-[140px]">Reason</th>
            </tr>
          </thead>
          <tbody>
            {children.map(child => (
              <tr key={`${lot.id}-${child.id}`} className="border-t">
                <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">
                  {String(child.type || "").replace(/_/g, " ")}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {child.reference || "—"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {child.customer_id && child.customer_name ? (
                    <Link
                      to={`/customer/view/${child.customer_id}`}
                      className="text-primary hover:underline"
                    >
                      {child.customer_name}
                    </Link>
                  ) : (
                    child.customer_name || "—"
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {child.sale_order_number ? (
                    <Link to="/sale-orders" className="text-primary hover:underline">
                      {child.sale_order_number}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2">
                  {Array.isArray(child.related_raw_materials) && child.related_raw_materials.length > 0 ? (
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {child.related_raw_materials.map(rawMaterial => (
                        <Link
                          key={`${child.id}-rm-${rawMaterial.raw_material_id}`}
                          to={`/raw-materials/view/${rawMaterial.raw_material_id}`}
                          className="text-primary hover:underline whitespace-nowrap"
                        >
                          {rawMaterial.raw_material_name || `RM #${rawMaterial.raw_material_id}`}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {child.date ? formatDate(child.date) : "—"}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {Number(child.quantity || 0).toFixed(2)}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {child.unit_price !== undefined ? `$${Number(child.unit_price).toFixed(2)}` : "—"}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {child.total !== undefined ? `$${Number(child.total).toFixed(2)}` : "—"}
                </td>
                <td className="px-3 py-2 w-[140px] max-w-[140px]">
                  <span
                    className="block truncate"
                    title={child.reason || "—"}
                  >
                    {child.reason || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
