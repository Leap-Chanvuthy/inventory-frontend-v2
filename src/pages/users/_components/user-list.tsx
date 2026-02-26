import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useUsers } from "@/api/users/user.query";
import { User } from "@/api/users/user.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { COLUMNS, FILTER_OPTIONS, SORT_OPTIONS } from "../utils/table-feature";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { UserCard } from "../utils/table-feature";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import UnexpectedError from "@/components/reusable/partials/error";

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

  const { data, isLoading, isFetching, isError } = useUsers({
    ...apiParams,
    "filter[role]": filter,
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
          isListOptionDisplayed={true}
        />

        {/* Data Table */}
        {/* <DataTable<User>
          columns={COLUMNS}
          data={data?.data}
          isLoading={isLoading}
          emptyText="No users found"
        /> */}

        {/* Data Card */}
        {/* <DataCard<User> 
          data={data?.data}
          isLoading={isLoading}
          emptyText="No users found"
          renderItem={user => <UserCard user={user} />}
        /> */}

        {/* Toggleable List for both Table & Card */}
        <ToggleableList<User>
          items={data?.data}
          isLoading={isLoading}
          loadingText="Loading user data..."
          emptyText="No users found"
          columns={COLUMNS}
          renderItem={user => <UserCard user={user} />}
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
