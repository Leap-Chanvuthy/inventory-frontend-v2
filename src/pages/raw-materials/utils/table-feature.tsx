import { useState } from "react";
import {
  RawMaterial,
  RawMaterialStockMovement,
} from "@/api/raw-materials/raw-material.types";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import TableActions from "@/components/reusable/partials/table-actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Package,
  Warehouse,
  User,
  Ruler,
  RotateCcw,
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  LockOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/date-format";
import { Text } from "@/components/ui/text/app-text";
import { UpdateReorderDialog } from "../_components/update-reorder-dialog";
import { CategoryBadge, StockStatusBadge } from "./raw-material-status";
import { Badge } from "@/components/ui/badge";
import {
  useDeleteRawMaterial,
  useRecoverRawMaterial,
} from "@/api/raw-materials/raw-material.mutation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const isInUsed = (value: unknown): boolean =>
  value === true || value === 1 || value === "1" || value === "true";

// Actions Component
const RawMaterialActions = ({ rawMaterial }: { rawMaterial: RawMaterial }) => {
  const deleteMutation = useDeleteRawMaterial();

  return (
    <div className="flex items-center gap-2">
      <TableActions
        viewDetailPath={`/raw-materials/view/${rawMaterial.id}`}
        editPath={`/raw-materials/update/${rawMaterial.id}`}
        deleteHeading="Delete This Raw Material"
        deleteSubheading="Are you sure you want to delete this raw material? This action cannot be undone."
        deleteTooltip="Delete Raw Material"
        onDelete={() => deleteMutation.mutate(rawMaterial.id)}
      />
    </div>
  );
};

// Recover Action Component (for deleted raw materials)
export const RecoverAction = ({
  rawMaterial,
}: {
  rawMaterial: RawMaterial;
}) => {
  const recoverMutation = useRecoverRawMaterial();
  const [open, setOpen] = useState(false);

  const handleConfirmRecover = () => {
    recoverMutation.mutate(rawMaterial.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button type="button" className="inline-flex items-center">
                <RotateCcw className="w-4 h-4 text-emerald-500 cursor-pointer" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Recover Raw Material</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Recover This Raw Material</DialogTitle>
          <DialogDescription>
            Are you sure you want to recover "{rawMaterial.material_name}"? It
            will be restored to the active raw materials list.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>

          <Button type="button" onClick={handleConfirmRecover}>
            Recover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Filter Options
export const FILTER_OPTIONS = [{ value: " ", label: "All" }];

// Sort Options
export const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "material_name", label: "Name (A-Z)" },
  { value: "-material_name", label: "Name (Z-A)" },
];

// Table Columns
export const COLUMNS: DataTableColumn<RawMaterial>[] = [
  {
    key: "material_name",
    header: "Name",
    className: "whitespace-nowrap py-6",
    render: (rawMaterial) => (
      <span className="font-medium whitespace-nowrap">
        {rawMaterial.material_name}
      </span>
    ),
  },
  {
    key: "material_sku_code",
    header: "Code",
    className: "whitespace-nowrap py-6",
    render: (rawMaterial) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {rawMaterial.material_sku_code}
      </span>
    ),
  },
  {
    key: "category",
    header: "Category",
    className: "whitespace-nowrap py-6",
    render: (rawMaterial) => (
      <CategoryBadge
        category={rawMaterial.raw_material_category_name}
        color={rawMaterial.rm_category?.label_color}
      />
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "whitespace-nowrap py-6",
    render: (rawMaterial) => (
      <StockStatusBadge
        quantity={rawMaterial.minimum_stock_level}
        minimumStock={50} // You might want to make this configurable
      />
    ),
  },
  {
    key: "production_method",
    header: "Production Method",
    className: "whitespace-nowrap py-6",
    render: (rawMaterial) => (
      <div>
        {rawMaterial.production_method == "FIFO" && "FIFO (First In First Out)"}
        {rawMaterial.production_method == "LIFO" && "LIFO (Last In First Out)"}
      </div>
    ),
  },
  {
    key: "quantity",
    header: "Quantity",
    className: "whitespace-nowrap py-6",
    render: (rawMaterial) => (
      <span>
        {rawMaterial.minimum_stock_level}{" "}
        {rawMaterial.uom?.symbol || rawMaterial.uom_name || ""}
      </span>
    ),
  },
  {
    key: "uom",
    header: "Unit of Measure",
    className: "whitespace-nowrap py-6",
    render: (rawMaterial) => (
      <span className="text-muted-foreground">{rawMaterial.uom_name}</span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: (rawMaterial) => <RawMaterialActions rawMaterial={rawMaterial} />,
  },
];

// Card Component for Grid View
interface RawMaterialCardProps {
  rawMaterial?: RawMaterial;
  isDeleted?: boolean;
}

export function RawMaterialCard({
  rawMaterial,
  isDeleted = false,
}: RawMaterialCardProps) {
  if (!rawMaterial) return null;

  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-md">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between gap-3 sm:gap-4 pb-3">
        <Link
          to={`/raw-materials/view/${rawMaterial.id}`}
          className="flex items-center gap-3 min-w-0 hover:text-primary"
        >
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <Text.Small color="default" fontWeight="medium" overflow="ellipsis">
              {rawMaterial.material_name}
            </Text.Small>
          </div>
        </Link>
        {isDeleted && <RecoverAction rawMaterial={rawMaterial} />}
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 space-y-2.5 sm:space-y-3">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge
            category={rawMaterial.raw_material_category_name}
            color={rawMaterial.rm_category?.label_color}
          />
          <StockStatusBadge
            quantity={rawMaterial.minimum_stock_level}
            minimumStock={50}
          />
        </div>

        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-blue-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {rawMaterial.material_sku_code}
          </Text.Small>
        </div>

        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-green-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {rawMaterial.minimum_stock_level}{" "}
            {rawMaterial.uom?.symbol || rawMaterial.uom_name}
          </Text.Small>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-purple-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {rawMaterial.official_name}
          </Text.Small>
        </div>

        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-orange-500 shrink-0" />
          <Text.Small color="muted" overflow="ellipsis">
            {rawMaterial.warehouse_name}
          </Text.Small>
        </div>
      </CardContent>

      {!isDeleted && (
        <CardFooter className="flex justify-end pt-0 pb-4">
          <RawMaterialActions rawMaterial={rawMaterial} />
        </CardFooter>
      )}
    </Card>
  );
}

// Raw Material Stock Movement Table Columns (for DataTable-style usage)
// Note: UOM is a property of the Raw Material, so we pass it in.
export const RM_STOCK_MOVEMENT_COLUMNS = (
  materialName: string,
  rawMaterialId: number,
  uomLabel?: string,
): DataTableColumn<RawMaterialStockMovement>[] => [
  {
    key: "movement_date",
    header: "Movement Date",
    className: "whitespace-nowrap py-6",
    render: (movement) => (
      <Text.Small
        color="muted"
        fontWeight="medium"
        className="whitespace-nowrap"
      >
        {formatDate(movement.movement_date)}
      </Text.Small>
    ),
  },
  {
    key: "movement_type",
    header: "Movement Type",
    className: "whitespace-nowrap py-6",
    render: (movement) => {
      const IS_IN_USED = isInUsed(movement.in_used as unknown);
      const IS_RE_ORDER_PURCHASED =
        movement.movement_type === "RE_ORDER" ||
        movement.movement_type === "PURCHASE";

      return (
        <Text.Small
          color="muted"
          fontWeight="semibold"
          letterSpacing="wide"
          className="flex items-center gap-1.5 whitespace-nowrap capitalize"
        >
          {movement.movement_type.replace(/_/g, " ")}
          {IS_RE_ORDER_PURCHASED &&
            (IS_IN_USED ? (
              <Badge
                variant="destructive"
                className="flex items-center gap-1.5 text-white"
              >
                <Lock className="w-3 h-3" />
                WIP (In Used)
              </Badge>
            ) : (
              <Badge
                variant="default"
                className="flex items-center gap-1.5 text-white"
              >
                <LockOpen className="w-3 h-3" />
                Not In Used
              </Badge>
            ))}
        </Text.Small>
      );
    },
  },
  {
    key: "direction",
    header: "Direction",
    className: "whitespace-nowrap py-6",
    render: (movement) => {
      const isStockIn = movement.direction === "IN";

      return (
        <div
          className={`flex items-center gap-1.5 font-bold ${
            isStockIn ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isStockIn ? (
            <ArrowDownLeft className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5" />
          )}
          <Text.Small
            fontWeight="bold"
            letterSpacing="wide"
            className="uppercase"
          >
            {movement.direction}
          </Text.Small>
        </div>
      );
    },
  },
  {
    key: "quantity",
    header: "Quantity",
    className: "whitespace-nowrap py-6 text-right",
    render: (movement) => {
      const isStockIn = movement.direction === "IN";
      const formattedQty = movement.quantity.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
      const label = uomLabel ? ` ${uomLabel}` : "";

      return (
        <Text.Small color="default" fontWeight="medium">
          {isStockIn ? "+" : "-"}
          {formattedQty}
          {label}
        </Text.Small>
      );
    },
  },
  {
    key: "unit_price_in_usd",
    header: "Purchasing Unit Price",
    className: "whitespace-nowrap py-6 text-right",
    render: (movement) => (
      <Text.Small color="muted">
        ${movement.unit_price_in_usd.toFixed(2)}
      </Text.Small>
    ),
  },
  {
    key: "total_value_in_usd",
    header: "Purchasing Total Value",
    className: "whitespace-nowrap py-6 text-right",
    render: (movement) => (
      <Text.Small color="default" fontWeight="semibold">
        $
        {movement.total_value_in_usd.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}
      </Text.Small>
    ),
  },
  {
    key: "created_by",
    header: "Created By",
    className: "whitespace-nowrap py-6",
    render: (movement) => (
      <Link
        to={`/users/update/${movement.created_by?.id}`}
        className="flex items-center gap-3"
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={movement?.created_by?.profile_picture || ""}
              alt="movement avatar"
            />
            <AvatarFallback>
              {movement?.created_by?.name
                ? movement.created_by.name
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0].toUpperCase())
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
          {movement?.created_by?.name && (
            <Text.Small color="muted">{movement.created_by.name}</Text.Small>
          )}
        </div>
      </Link>
    ),
  },
  {
    key: "last_updated_by",
    header: "Last Updated By",
    className: "whitespace-nowrap py-6",
    render: (movement) => (
      <Link
        to={`/users/update/${movement.last_updated_by?.id}`}
        className="flex items-center gap-3"
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={movement?.last_updated_by?.profile_picture || ""}
              alt="movement avatar"
            />
            <AvatarFallback>
              {movement?.last_updated_by?.name
                ? movement.last_updated_by.name
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0].toUpperCase())
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
          {movement?.last_updated_by?.name && (
            <Text.Small color="muted">
              {movement.last_updated_by.name}
            </Text.Small>
          )}
        </div>
      </Link>
    ),
  },
  {
    key: "note",
    header: "Notes",
    className: "whitespace-nowrap py-6",
    render: (movement) => (
      <Text.Small color="muted" fontStyle="italic" maxLines={1}>
        {movement.note || "No notes"}
      </Text.Small>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: (movement) => {
      const IS_RE_ORDER = movement.movement_type === "RE_ORDER";

      const payload = {
        quantity: movement.quantity,
        unit_price_in_usd: movement.unit_price_in_usd,
        exchange_rate_from_usd_to_riel: movement.exchange_rate_from_usd_to_riel,
        movement_date: movement.movement_date,
        note: movement.note ?? undefined,
      };

      return (
        <span>
          {IS_RE_ORDER && (
            <UpdateReorderDialog
              isDisabled={isInUsed(movement.in_used as unknown)}
              rawMaterialId={rawMaterialId}
              movementId={movement.id}
              materialName={materialName}
              payload={payload}
            />
          )}
        </span>
      );
    },
  },
];
