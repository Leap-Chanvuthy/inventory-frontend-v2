import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Warehouse } from "@/api/warehouses/warehouses.types";
import TableActions from "@/components/reusable/partials/table-actions";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteWarehouse } from "@/api/warehouses/warehouses.mutation";
import { Text } from "@/components/ui/text/app-text";

// Sort Options
export const SORT_OPTIONS = [
  { value: "warehouse_manager", label: "Manager Name" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "-updated_at", label: "Recently Updated" },
  { value: "updated_at", label: "Least Recently Updated" },
];

function WarehouseActions({ warehouse }: { warehouse: Warehouse }) {

  const deleteMutation = useDeleteWarehouse();

  return (
    <TableActions
      viewDetailPath={`/warehouses/view/${warehouse.id}`}
      editPath={`/warehouses/update/${warehouse.id}`}
      deleteHeading="Delete This Warehouse"
      deleteSubheading="Are you sure want to delete this warehouse? This action cannot be undone."
      deleteTooltip="Delete Warehouse"
      onDelete={() => deleteMutation.mutate(warehouse.id)}
    />
  );
}


function getWarehouseImageSrc(warehouse: Warehouse) {
  const first = warehouse.images?.[0]?.image;
  return first || "/warehouse-placeholder.png";
}

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}

// Define table columns (kept for table view)
export const COLUMNS : DataTableColumn<Warehouse>[] = [
  {
    key: "warehouse_name",
    header: "Warehouse",
    className: "whitespace-nowrap py-6",
    render: warehouse => (
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={getWarehouseImageSrc(warehouse)}
          alt={warehouse.warehouse_name}
          className="h-10 w-10 rounded-full border object-cover shrink-0"
        />
        <div className="min-w-0">
          <Link
            to={`/warehouses/view/${warehouse.id}`}
            className="font-semibold text-foreground hover:text-primary transition-colors truncate block"
            title={warehouse.warehouse_name}
          >
            {warehouse.warehouse_name}
          </Link>
        </div>
      </div>
    ),
  },
  {
    key: "warehouse_manager",
    header: "Manager",
    className: "whitespace-nowrap py-6",
    render: warehouse => (
      <span className="text-foreground">
        {warehouse.warehouse_manager || "-"}
      </span>
    ),
  },
  {
    key: "warehouse_address",
    header: "Location",
    className: "whitespace-nowrap py-6 text-muted-foreground",
    render: warehouse => (
      <span title={warehouse.warehouse_address || "-"}>
        {warehouse.warehouse_address || "-"}
      </span>
    ),
  },
  {
    key: "updated_at",
    header: "Last Updated",
    className: "whitespace-nowrap py-6 text-muted-foreground",
    render: warehouse => formatDate(warehouse.updated_at),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: warehouse => <WarehouseActions warehouse={warehouse} />, // ✅
  },
];

interface WarehouseCardProps {
  warehouse?: Warehouse;
  hideActions?: boolean;
  disableLink?: boolean;
  interactive?: boolean;
}

export function WarehouseCard({
  warehouse,
  hideActions = false,
  disableLink = false,
  interactive = true,
}: WarehouseCardProps) {
  if (!warehouse) return null;

  const addressText = warehouse.warehouse_address || "-";

  return (
    <Card className={`h-full flex flex-col transition-shadow ${interactive ? "hover:shadow-md" : ""}`}>
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between gap-3 sm:gap-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {disableLink ? (
            <>
              <img
                src={getWarehouseImageSrc(warehouse)}
                alt={warehouse.warehouse_name}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <Text.Small color="default" fontWeight="medium" overflow="ellipsis">
                  {warehouse.warehouse_name}
                </Text.Small>
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <Text.Small color="muted" overflow="ellipsis">
                    ID: {warehouse.id}
                  </Text.Small>
                </div>
              </div>
            </>
          ) : (
            <Link to={`/warehouses/view/${warehouse.id}`} className="flex items-center gap-3 min-w-0 hover:text-primary">
              <img
                src={getWarehouseImageSrc(warehouse)}
                alt={warehouse.warehouse_name}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <Text.Small color="default" fontWeight="medium" overflow="ellipsis">
                  {warehouse.warehouse_name}
                </Text.Small>
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <Text.Small color="muted" overflow="ellipsis">
                    ID: {warehouse.id}
                  </Text.Small>
                </div>
              </div>
            </Link>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 space-y-2.5 sm:space-y-3 min-h-[120px]">
        {warehouse.warehouse_manager && (
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-indigo-500 shrink-0" />
            <Text.Small color="muted" overflow="ellipsis">
              {warehouse.warehouse_manager}
            </Text.Small>
          </div>
        )}

        {warehouse.warehouse_manager_contact && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-500 shrink-0" />
            <Text.Small color="muted" overflow="ellipsis">
              {warehouse.warehouse_manager_contact}
            </Text.Small>
          </div>
        )}

        {warehouse.warehouse_manager_email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-green-500 shrink-0" />
            <Text.Small color="muted" overflow="ellipsis">
              {warehouse.warehouse_manager_email}
            </Text.Small>
          </div>
        )}

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <Text.Small color="muted" maxLines={2}>
            {addressText}
          </Text.Small>
        </div>
      </CardContent>

      {!hideActions && (
        <CardFooter className="flex justify-end pt-0 pb-4">
          <WarehouseActions warehouse={warehouse} />
        </CardFooter>
      )}
    </Card>
  );
}