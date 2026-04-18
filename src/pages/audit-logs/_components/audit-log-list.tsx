import { useAuditLogs } from "@/api/audit-log/audit-log.query";
import { AuditLog } from "@/api/audit-log/audit-log.types";
import UnexpectedError from "@/components/reusable/partials/error";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import {
  AuditLogCard,
  COLUMNS,
  FILTER_OPTIONS,
  SORT_OPTIONS,
} from "../utils/table-feature";

export default function AuditLogList() {
  const {
    setPage,
    setSearch,
    setSort,
    setPerPage,
    setFilter,
    filter,
    search,
    perPage,
    apiParams,
  } = useTableQueryParams();

  const { data, isLoading, isFetching, isError } = useAuditLogs({
    ...apiParams,
    "filter[action]": filter,
  });

  if (isError && !isFetching) {
    return (
      <UnexpectedError
        kind="fetch"
        hideBackButton={true}
        hideHomeButton={true}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        <TableToolbar
          searchPlaceholder="Search logs..."
          onSearch={setSearch}
          search={search}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          filterOptions={FILTER_OPTIONS}
          selectedFilter={filter || ""}
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          onPerPageChange={setPerPage}
          perPage={perPage}
          onFilterChange={val => setFilter(val === "" ? undefined : val || undefined)}
          isListOptionDisplayed={true}
        />

        <ToggleableList<AuditLog>
          items={data?.data}
          isLoading={isLoading}
          loadingText="Loading audit logs..."
          emptyText="No logs found"
          columns={COLUMNS}
          renderItem={log => <AuditLogCard log={log} />}
        />

        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            <GlobalPagination
              currentPage={data?.current_page || 1}
              lastPage={data?.last_page || 1}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
