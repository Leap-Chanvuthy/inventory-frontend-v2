import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-format";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { RawMaterialStockLot } from "@/api/raw-materials/raw-material.types";
import { Link } from "react-router-dom";

export type RawMaterialStockLotRow = RawMaterialStockLot;

const statusBadgeClass = (status?: string) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized.includes("EXPIRED")) return "border-red-500 text-red-600";
  if (normalized.includes("FULLY")) return "border-slate-500 text-slate-600";
  if (normalized.includes("PARTIAL")) return "border-amber-500 text-amber-600";
  return "border-green-500 text-green-600";
};

export const RAW_MATERIAL_STOCK_LOT_COLUMNS = (
  expanded: Record<number, boolean>,
  onToggle: (lotId: number) => void,
): DataTableColumn<RawMaterialStockLotRow>[] => [
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
    render: lot => <span className="font-medium">{lot.batch_code ?? `RM-${lot.id}`}</span>,
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
    key: "used_in_production_quantity",
    header: "Used",
    className: "text-right",
    render: lot => Number(lot.used_in_production_quantity || 0).toFixed(2),
  },
  {
    key: "scrapped_quantity",
    header: "Scrapped",
    className: "text-right",
    render: lot => Number(lot.scrapped_quantity || 0).toFixed(2),
  },
  {
    key: "unit_cost_usd",
    header: "Unit Cost (USD)",
    className: "text-right",
    render: lot => `$${Number(lot.unit_cost_usd || 0).toFixed(4)}`,
  },
  {
    key: "status",
    header: "Status",
    render: lot => (
      <Badge variant="outline" className={statusBadgeClass(lot.status)}>
        {String(lot.status || "AVAILABLE").replace(/_/g, " ")}
      </Badge>
    ),
  },
];

export const renderRawMaterialStockLotHistory = (lot: RawMaterialStockLotRow) => {
  const children = lot.children ?? [];
  // const batchCode = lot.batch_code ?? `RM-${lot.id}`;
  if (children.length === 0) {
    return (
      <div className="py-2 pl-12">
        {/* <p className="text-xs font-semibold text-foreground mb-1">{batchCode}</p> */}
        <p className="text-xs font-semibold text-foreground">Batch History</p>
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
              <th className="px-3 py-2 text-left font-medium">Product</th>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-right font-medium">Quantity</th>
              <th className="px-3 py-2 text-right font-medium">Unit Cost</th>
              <th className="px-3 py-2 text-right font-medium">Line Cost</th>
              <th className="px-3 py-2 text-left font-medium w-[140px]">Reason</th>
            </tr>
          </thead>
          <tbody>
            {children.map(child => (
              <tr key={`${lot.id}-${child.id}`} className="border-t">
                <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">
                  {String(child.type || "").replace(/_/g, " ")}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{child.reference || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {child.product_id && child.product_name ? (
                    <Link
                      to={`/products/view/${child.product_id}`}
                      className="text-primary hover:underline"
                    >
                      {child.product_name}
                    </Link>
                  ) : (
                    child.product_name || "—"
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {child.date ? formatDate(child.date) : "—"}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {Number(child.quantity || 0).toFixed(2)}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {child.unit_cost_usd !== undefined ? `$${Number(child.unit_cost_usd).toFixed(2)}` : "—"}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {child.line_cost_usd !== undefined ? `$${Number(child.line_cost_usd).toFixed(2)}` : "—"}
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
