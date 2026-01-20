import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useSuppliers } from "@/api/suppliers/supplier.query";
import { Supplier } from "@/api/suppliers/supplier.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import { COLUMNS, FILTER_OPTIONS, SORT_OPTIONS, SupplierCard } from "../utils/table-feature";

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
          isListOptionDisplayed={true}
        />

        <ToggleableList<Supplier>
          items={data?.data?.data || []}
          isLoading={isLoading}
          emptyText="No suppliers found"
          columns={COLUMNS}
          renderItem={supplier => <SupplierCard supplier={supplier} />}
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
