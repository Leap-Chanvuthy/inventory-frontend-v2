import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { MapPin, Eye, SquarePen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "../utils/status-warehouser";
import { useWarehouses } from "@/api/warehouses/warehouses.query";

// Sort Options
const SORT_OPTIONS = [
  { value: "warehouse_name", label: "Warehouse Name" },
  { value: "warehouse_address", label: "Location" },
  { value: "capacity_units", label: "Capacity" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
];

// Filter Options
const FILTER_OPTIONS = [
  { value: " ", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Low Stock", label: "Low Stock" },
  { value: "Full", label: "Full" },
  { value: "Inactive", label: "Inactive" },
];

export default function WarehousesList() {
  const { page, setPage, setSearch, filter, setFilter, apiParams } =
    useTableQueryParams();

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
        {/* Breadcrumb */}
        <div className="mb-4">
          <BreadCrumb
            items={[
              { name: "catalog", label: "Catalog", link: "/catalog" },
              { name: "warehouses", label: "Warehouses", link: "/warehouses" },
              { name: "list", label: "List of Warehouses" },
            ]}
          />
        </div>

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
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 ">
                <TableHead className="whitespace-nowrap py-4">
                  Warehouse Name
                </TableHead>
                <TableHead className="whitespace-nowrap">Location</TableHead>

                <TableHead className="whitespace-nowrap">
                  Last Updated
                </TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading warehouses...
                  </TableCell>
                </TableRow>
              ) : warehouses.length > 0 ? (
                warehouses.map(warehouse => (
                  <TableRow key={warehouse.id} className="hover:bg-muted/30">
                    <TableCell className="py-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <Link
                          to={`/warehouses/update/${warehouse.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {warehouse.warehouse_name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 text-muted-foreground">
                      {warehouse.warehouse_address}
                    </TableCell>

                    <TableCell className="py-6 text-muted-foreground">
                      {new Date(warehouse.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/multi-warehouses/${warehouse.id}`}
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No warehouses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
