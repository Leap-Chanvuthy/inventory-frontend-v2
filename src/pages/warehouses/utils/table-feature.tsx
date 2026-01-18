import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Warehouse } from "@/api/warehouses/warehouses.types";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import TableActions from "@/components/reusable/partials/table-actions";

// Sort Options
export const SORT_OPTIONS = [
  { value: "warehouse_manager", label: "Manager Name" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "-updated_at", label: "Recently Updated" },
  { value: "updated_at", label: "Least Recently Updated" },
];

// Define table columns
export const columns: DataTableColumn<Warehouse>[] = [
  {
    key: "warehouse_name",
    header: "Warehouse Name",
    className: "whitespace-nowrap py-6",
    render: warehouse => (
      <div className="flex items-center gap-3">
        <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <Link
          to={`/warehouses/view/${warehouse.id}`}
          className="font-semibold text-foreground hover:text-primary transition-colors"
        >
          {warehouse.warehouse_name}
        </Link>
      </div>
    ),
  },
  {
    key: "warehouse_address",
    header: "Location",
    className: "whitespace-nowrap py-6 text-muted-foreground",
  },
  {
    key: "updated_at",
    header: "Last Updated",
    className: "whitespace-nowrap py-6 text-muted-foreground",
    render: warehouse => new Date(warehouse.updated_at).toLocaleDateString(),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: warehouse => (
      <TableActions
        viewDetailPath={`/warehouses/view/${warehouse.id}`}
        editPath={`/warehouses/update/${warehouse.id}`}
        deleteHeading="Delete Warehouse"
        deleteSubheading={`Are you sure you want to delete ${warehouse.warehouse_name}?`}
        deleteTooltip="Delete this warehouse"
        onDelete={() => console.log("Delete warehouse:", warehouse.id)}
        showDelete={false}
      />
    ),
  },
];
