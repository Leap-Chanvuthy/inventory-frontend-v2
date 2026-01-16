import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useSuppliers } from "@/api/suppliers/supplier.query";
import { Supplier } from "@/api/suppliers/supplier.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { COLUMNS, FILTER_OPTIONS, SORT_OPTIONS } from "../utils/table-feature";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";

export function SupplierList() {
  const {
    setPage,
    setSearch,
    setSort,
    setPerPage,
    setFilter,
    perPage,
    filter,
    search,
    apiParams,
  } = useTableQueryParams();

  const { data, isLoading, isError } = useSuppliers({
    ...apiParams,
    "filter[supplier_category]": filter,
  });

  if (isError) {
    return <p className="text-center text-red-500">Failed to load suppliers</p>;
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search supplier..."
          onSearch={setSearch}
          search={search}
          filterOptions={FILTER_OPTIONS}
          selectedFilter={filter}
          onFilterChange={val => setFilter(val || undefined)}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          onPerPageChange={setPerPage}
          historyHref="/supplier/import-history"
          createHref="/supplier/create"
        />

        {/* Data Table */}
        <DataTable<Supplier>
          columns={COLUMNS}
          data={data?.data?.data}
          isLoading={isLoading}
          emptyText="No suppliers found"
        />

        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <GlobalPagination
              currentPage={data?.data.current_page || 1}
              lastPage={data?.data.last_page || 1}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
