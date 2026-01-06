import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { useWarehouses } from "@/api/warehouses/warehouses.query";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { Warehouse } from "@/api/warehouses/warehouses.types";
import { useEffect } from "react";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { columns, SORT_OPTIONS } from "../utils/table-feature";

interface WarehousesListProps {
  onWarehousesChange: (warehouses: Warehouse[]) => void;
}

export default function WarehousesList({
  onWarehousesChange,
}: WarehousesListProps) {
  const { page, setPage, setPerPage, setSearch, setSort, filter, apiParams } =
    useTableQueryParams();

  const { data, isLoading, isError } = useWarehouses({
    ...apiParams,
    "filter[status]": filter,
  });

  const warehouses = data?.data || [];
  const totalPages = data?.last_page || 1;

  /* callback to give warehouse data to map */
  useEffect(() => {
    onWarehousesChange(warehouses);
  }, [warehouses, onWarehousesChange]);

  if (isError) {
    return (
      <p className="text-center text-red-500">Failed to load warehouses</p>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">Warehouse Inventory</h1>

        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search warehouses...."
          onSearch={setSearch}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          createHref="/warehouses/create"
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          onPerPageChange={setPerPage}
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
