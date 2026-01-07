import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useUsers } from "@/api/users/user.query";
import { User } from "@/api/users/user.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { COLUMNS, FILTER_OPTIONS, SORT_OPTIONS } from "../utils/table-feature";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";


export default function UserList() {
  const {
    // page,
    setPage,
    setSearch,
    setSort,
    setPerPage,
    setFilter,
    filter,
    search,
    perPage,
    
    // api ready params
    apiParams,
  } = useTableQueryParams();

  const { data, isLoading, isError } = useUsers({
    ...apiParams,
    "filter[role]": filter,
  });

  if (isError) {
    return <p className="text-center text-red-500">Failed to load users</p>;
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
      <div className="mx-auto max-w-[1600px]">

        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search users..."
          onSearch={setSearch}
          search={search}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          filterOptions={FILTER_OPTIONS}
          selectedFilter={filter || ""}
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          onPerPageChange={setPerPage}
          perPage={perPage}
          onFilterChange={val => setFilter(val || undefined)}
          createHref="/users/create"
        />

        {/* Data Table */}
        <DataTable<User>
          columns={COLUMNS}
          data={data?.data}
          isLoading={isLoading}
          emptyText="No users found"
        />
        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
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