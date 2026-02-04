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
  const updatedText = formatDate(warehouse.updated_at);

  const shortenWarehouseName = (name: string) => {
    if (name.length <= 20) return name;
    return name.slice(0, 20) + "...";
  }

  return (
    <Card
      className={
        interactive
          ? "transition-transform hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg"
          : "border border-gray-200 dark:border-gray-700 rounded-lg"
      }
    >
      {/* Header */}
      <CardHeader className="flex items-start justify-between gap-4 pb-3">
        {disableLink ? (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={getWarehouseImageSrc(warehouse)}
                alt={warehouse.warehouse_name}
                className="h-14 w-14 rounded-full border-2 border-indigo-300 object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="font-semibold text-lg truncate">
                  {shortenWarehouseName(warehouse.warehouse_name)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    ID: {warehouse.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link
            to={`/warehouses/view/${warehouse.id}`}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={getWarehouseImageSrc(warehouse)}
                alt={warehouse.warehouse_name}
                className="h-14 w-14 rounded-full border-2 border-indigo-300 object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="font-semibold text-lg truncate">
                  {shortenWarehouseName(warehouse.warehouse_name)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    ID: {warehouse.id}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3 text-sm">
        {/* Capacity */}

        {/* Manager + Contact */}
        <div className="flex flex-col gap-1">
          {warehouse.warehouse_manager && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <UserRound className="h-4 w-4 text-indigo-500" />
              {warehouse.warehouse_manager}
            </div>
          )}
          {warehouse.warehouse_manager_contact && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Phone className="h-4 w-4 text-blue-500" />
              {warehouse.warehouse_manager_contact}
            </div>
          )}
          {warehouse.warehouse_manager_email && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4 text-green-500" />
              {warehouse.warehouse_manager_email}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 text-red-400 mt-0.5" />
          <div
            className="text-xs leading-snug break-words"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              whiteSpace: "pre-line",
            }}
            title={addressText}
          >
            {addressText}
          </div>
        </div>

        {/* Meta */}
        <div className="text-xs text-muted-foreground">
          Last updated: {updatedText}
        </div>
      </CardContent>

      {!hideActions && (
        <CardFooter className="flex justify-end pt-0">
          <WarehouseActions warehouse={warehouse} />
        </CardFooter>
      )}
    </Card>
  );
}