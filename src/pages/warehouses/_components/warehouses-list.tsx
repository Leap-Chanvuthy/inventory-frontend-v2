import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { useWarehouses } from "@/api/warehouses/warehouses.query";
import { Warehouse } from "@/api/warehouses/warehouses.types";
import { useEffect } from "react";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { columns, SORT_OPTIONS } from "../utils/table-feature";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import { WarehouseCard } from "../utils/warehouser-cart";

interface WarehousesListProps {
  onWarehousesChange: (warehouses: Warehouse[]) => void;
}

export default function WarehousesList({
  onWarehousesChange,
}: WarehousesListProps) {
  const {
    page,
    setPage,
    setPerPage,
    setSearch,
    setSort,
    perPage,
    search,
    filter,
    apiParams,
  } = useTableQueryParams();

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
    <div className="w-full p-4 sm:p-8 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search warehouses...."
          onSearch={setSearch}
          search={search}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          createHref="/warehouses/create"
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          onPerPageChange={setPerPage}
          isListOptionDisplayed={true}
        />

        {/* Toggleable List with Card and Table View */}
        <ToggleableList<Warehouse>
          items={warehouses}
          isLoading={isLoading}
          emptyText="No warehouses found"
          columns={columns}
          renderItem={warehouse => <WarehouseCard warehouse={warehouse} />}
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
