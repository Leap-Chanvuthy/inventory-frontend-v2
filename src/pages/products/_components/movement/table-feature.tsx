import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { ProductMovement } from "@/api/product/product.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/reusable/partials/delete-modal";
import { formatDate } from "@/utils/date-format";
import { ArrowDownToLine, ArrowUpFromLine, Eye, Pencil } from "lucide-react";

interface BuildMovementColumnsParams {
  onViewMovement: (mv: ProductMovement) => void;
  onEditMovement: (mv: ProductMovement) => void;
  onDeleteMovement: (movementId: number) => void;
  onViewScrap: (mv: ProductMovement) => void;
  onEditScrap: (mv: ProductMovement) => void;
}

const formatQuantity = (quantity: string | number) => Number(quantity ?? 0).toFixed(2);
const getLotStatusLabel = (mv: ProductMovement) => {
  if (mv.direction !== "IN") return "OUT";
  const qty = Number(mv.quantity ?? 0);
  const remaining = Number(mv.remaining_quantity ?? 0);
  if (remaining <= 0) return "SOLD_OUT";
  if (remaining < qty) return "PARTIALLY_SOLD";
  return "AVAILABLE";
};

const getCreatedByName = (createdBy: ProductMovement["created_by"]) =>
  createdBy && typeof createdBy === "object" ? createdBy.name : "—";

const getExpiryStatus = (expiryDate?: string | null): "EXPIRED" | "VALID" | "NO_EXPIRY" => {
  if (!expiryDate) return "NO_EXPIRY";
  const exp = new Date(expiryDate);
  if (Number.isNaN(exp.getTime())) return "NO_EXPIRY";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);
  return exp < today ? "EXPIRED" : "VALID";
};

export const buildProductMovementColumns = ({
  onViewMovement,
  onEditMovement,
  onDeleteMovement,
  onViewScrap,
  onEditScrap,
}: BuildMovementColumnsParams): DataTableColumn<ProductMovement>[] => [
  {
    key: "movement_type",
    header: "Type",
    render: mv => (
      <Badge variant="outline" className="text-xs whitespace-nowrap">
        {mv.movement_type.replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    key: "direction",
    header: "Dir",
    render: mv => (
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold ${mv.direction === "IN" ? "text-green-600" : "text-red-600"}`}
      >
        {mv.direction === "IN" ? (
          <ArrowDownToLine className="h-3.5 w-3.5" />
        ) : (
          <ArrowUpFromLine className="h-3.5 w-3.5" />
        )}
        {mv.direction}
      </span>
    ),
  },
  {
    key: "quantity",
    header: "Qty",
    render: mv => <span className="font-semibold">{formatQuantity(mv.quantity)}</span>,
  },
  {
    key: "remaining_quantity",
    header: "Remaining",
    render: mv => <span className="font-semibold">{formatQuantity(mv.remaining_quantity ?? 0)}</span>,
  },
  {
    key: "selling_unit_price_in_usd",
    header: "Sell (USD)",
    render: mv => `$${mv.selling_unit_price_in_usd.toLocaleString()}`,
  },
  {
    key: "lot_status",
    header: "Lot Status",
    render: mv => (
      <Badge
        variant="outline"
        className={
          getLotStatusLabel(mv) === "SOLD_OUT"
            ? "border-red-500 text-red-600 text-xs"
            : getLotStatusLabel(mv) === "PARTIALLY_SOLD"
              ? "border-amber-500 text-amber-600 text-xs"
              : getLotStatusLabel(mv) === "AVAILABLE"
                ? "border-green-500 text-green-600 text-xs"
                : "text-xs"
        }
      >
        {getLotStatusLabel(mv).replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    key: "movement_date",
    header: "Date",
    render: mv => <span className="text-muted-foreground text-xs whitespace-nowrap">{formatDate(mv.movement_date)}</span>,
  },
  {
    key: "expiry_date",
    header: "Expiry Date",
    render: mv => <span className="text-muted-foreground text-xs whitespace-nowrap">{formatDate(mv.expiry_date)}</span>,
  },
  {
    key: "expiry_status",
    header: "Expiry Status",
    render: mv => {
      const status = getExpiryStatus(mv.expiry_date);
      const className = status === "EXPIRED"
        ? "border-red-500 text-red-600 text-xs"
        : status === "VALID"
          ? "border-emerald-500 text-emerald-600 text-xs"
          : "text-xs";

      return (
        <Badge variant="outline" className={className}>
          {status === "NO_EXPIRY" ? "No Expiry" : status}
        </Badge>
      );
    },
  },
  {
    key: "created_by",
    header: "By",
    render: mv => <span className="text-muted-foreground text-xs whitespace-nowrap">{getCreatedByName(mv.created_by)}</span>,
  },
  {
    key: "action",
    header: "Action",
    render: mv => (
      <>
        {mv.movement_type.replace(/_/g, "").includes("REORDER") && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-teal-600 hover:bg-teal-50"
              onClick={() => onViewMovement(mv)}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            {!mv.is_sold && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => onEditMovement(mv)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <DeleteModal
                  heading="Delete Movement"
                  subheading="Are you sure you want to delete this reorder movement? This action cannot be undone."
                  onDelete={() => onDeleteMovement(mv.id)}
                />
              </>
            )}
          </div>
        )}
        {mv.movement_type === "SCRAP" && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-teal-600 hover:bg-teal-50"
              onClick={() => onViewScrap(mv)}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            {!mv.is_sold && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                onClick={() => onEditScrap(mv)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        )}
      </>
    ),
  },
];
