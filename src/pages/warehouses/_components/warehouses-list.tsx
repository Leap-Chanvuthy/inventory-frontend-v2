import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { MapPin, Eye, SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useWarehouses } from "@/api/warehouses/warehouses.query";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import { Warehouse } from "@/api/warehouses/warehouses.types";

// Sort Options
const SORT_OPTIONS = [
  { value: "warehouse_name", label: "Warehouse Name" },
  { value: "warehouse_address", label: "Location" },
  { value: "capacity_units", label: "Capacity" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
];

// Define table columns
const columns: DataTableColumn<Warehouse>[] = [
  {
    key: "warehouse_name",
    header: "Warehouse Name",
    className: "whitespace-nowrap py-4",
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
      <div className="flex items-center gap-3">
        <Link
          to={`/warehouses/view/${warehouse.id}`}
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          <Eye className="h-5 w-5" />
        </Link>
        <Link
          to={`/warehouses/update/${warehouse.id}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <SquarePen className="h-5 w-5" />
        </Link>
        <button className="text-red-500 hover:text-red-700 transition-colors">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    ),
  },
];

export default function WarehousesList() {
  const { page, setPage, setSearch, filter, apiParams } = useTableQueryParams();

  const { data, isLoading, isError } = useWarehouses({
    ...apiParams,
    "filter[status]": filter,
  });

  const warehouses = data?.data || [];
  const totalPages = data?.last_page || 1;

  if (isError) {
    return (
      <p className="text-center text-red-500">Failed to load warehouses</p>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">Warehouse Inventory</h1>

        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search warehouses...."
          onSearch={setSearch}
          sortOptions={SORT_OPTIONS}
          onSortChange={() => {}}
          createHref="/warehouses/create"
        />

        {/* Table */}
        <DataTable<Warehouse>
          columns={columns}
          data={warehouses}
          isLoading={isLoading}
          emptyText="No warehouses found."
        />

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <GlobalPagination
              currentPage={page}
              lastPage={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
