import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useCustomers } from "@/api/customers/customer.query";
import { Customer } from "@/api/customers/customer.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import {
  COLUMNS,
  FILTER_OPTIONS,
  SORT_OPTIONS,
  CustomerCard,
} from "../utils/table-feature";
import UnexpectedError from "@/components/reusable/partials/error";
import { useSearchParams } from "react-router-dom";

interface CustomerListProps {
  embedded?: boolean;
}

export function CustomerList({ embedded = false }: CustomerListProps) {
  const {
    setPage,
    setSearch,
    setSort,
    setPerPage,
    setFilter,
    perPage,
    filter,
    search,
    sort,
    clearQueryParams,
    apiParams,
  } = useTableQueryParams();

  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("category_id")
    ? Number(searchParams.get("category_id"))
    : undefined;
  const hasSidebarFilters =
    Boolean(selectedCategoryId) ||
    Boolean(searchParams.get("category_search")) ||
    searchParams.get("category_status") === "deleted" ||
    Boolean(searchParams.get("category_page"));

  const { data, isLoading, isFetching, isError } = useCustomers({
    ...apiParams,
    "filter[customer_status]": filter,
    "filter[customer_category_id]": selectedCategoryId
      ? String(selectedCategoryId)
      : undefined,
  });

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" hideHomeButton hideBackButton />;
  }

  return (
    <div
      className={
        embedded ? "w-full" : "min-h-screen w-full p-4 sm:p-8 bg-background"
      }
    >
      <div className={embedded ? "w-full" : "mx-auto max-w-[1600px]"}>
        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search customer..."
          onSearch={setSearch}
          search={search}
          filterOptions={FILTER_OPTIONS}
          selectedFilter={filter}
          onFilterChange={val => setFilter(val || undefined)}
          sortOptions={SORT_OPTIONS}
          selectedSort={sort ? [sort] : []}
          onSortChange={values => setSort(values[0])}
          hasActiveFilters={hasSidebarFilters}
          onClearFilters={() =>
            clearQueryParams({
              extraParams: [
                "category_id",
                "category_page",
                "category_search",
                "category_status",
                "category_per_page",
              ],
            })
          }
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          onPerPageChange={setPerPage}
          createHref="/customer/create"
          isListOptionDisplayed={true}
        />

        <ToggleableList<Customer>
          items={data?.data?.data || []}
          isLoading={isLoading}
          loadingText="Loading customers data..."
          emptyText="No customers found"
          columns={COLUMNS}
          renderItem={customer => <CustomerCard customer={customer} />}
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
