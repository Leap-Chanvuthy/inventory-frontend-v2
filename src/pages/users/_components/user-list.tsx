import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useUsers } from "@/api/users/user.query";
import { User } from "@/api/users/user.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { DataTable } from "@/components/reusable/data-table/data-table";
import { UserSelectModal } from "./user-selection-modal";
import { columns, FILTER_OPTIONS, SORT_OPTIONS } from "../utils/table-feature";


export default function UserList() {
  const {
    // page,
    setPage,
    setSearch,
    setSort,
    filter,
    setFilter,
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
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          filterOptions={FILTER_OPTIONS}
          onFilterChange={val => setFilter(val || undefined)}
          createHref="/users/create"
        />

        {/* Data Table */}
        <DataTable<User>
          columns={columns}
          data={data?.data}
          isLoading={isLoading}
          emptyText="No users found"
        />

        <UserSelectModal />

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
