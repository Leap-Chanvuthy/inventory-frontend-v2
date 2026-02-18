import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useImportHistories } from "@/api/suppliers/supplier.query";
import { ImportHistoryRecord } from "@/api/suppliers/supplier.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { COLUMNS, SORT_OPTIONS } from "../utils/table-feature";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { Link } from "react-router-dom";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImportHistoryList() {
  const {
    setPage,
    setSearch,
    setSort,
    setPerPage,
    perPage,
    filter,
    search,
    apiParams,
  } = useTableQueryParams();

  const { data, isLoading, isError } = useImportHistories(apiParams);

  if (isError) {
    return (
      <p className="text-center text-red-500">
        Failed to load import histories
      </p>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search by filename or uploader..."
          onSearch={setSearch}
          search={search}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          selectedFilter={filter}
          onPerPageChange={setPerPage}
          extraActions={
            <Button variant="outline" asChild>
              <Link to="/supplier/create?tab=import">
                <Upload className="h-4 w-4 mr-1.5" />
                Import
              </Link>
            </Button>
          }
        />

        {/* Data Table */}
        <DataTable<ImportHistoryRecord>
          columns={COLUMNS}
          data={data?.data?.data}
          isLoading={isLoading}
          emptyText="No import history found"
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
