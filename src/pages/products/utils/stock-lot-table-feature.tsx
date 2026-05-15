import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-format";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { ProductStockLot } from "@/api/product/product.type";

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
  if (children.length === 0) {
    return <span className="text-xs text-muted-foreground">No child activity for this batch yet.</span>;
  }

  return (
    <div className="space-y-2 py-1">
      <p className="text-xs font-semibold text-foreground">Batch History</p>
      <div className="space-y-1">
        {children.map(child => (
          <div key={`${lot.id}-${child.id}`} className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground mr-2">{String(child.type || "").replace(/_/g, " ")}</span>
            <span>{child.reference || "—"}</span>
            <span className="mx-2">·</span>
            <span>{child.date ? formatDate(child.date) : "—"}</span>
            <span className="mx-2">·</span>
            <span>{Number(child.quantity || 0).toFixed(2)}</span>
            {child.total !== undefined ? (
              <>
                <span className="mx-2">·</span>
                <span>${Number(child.total).toFixed(2)}</span>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
