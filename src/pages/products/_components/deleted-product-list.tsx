import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useTrashedProducts } from "@/api/product/product.query";
import { Product } from "@/api/product/product.type";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import { FILTER_OPTIONS, ProductCard } from "../utils/table-feature";
import { DELETED_COLUMNS, DELETED_SORT_OPTIONS } from "../utils/deleted-table-feature";
import UnexpectedError from "@/components/reusable/partials/error";

export function DeletedProductList() {
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
  } = useTableQueryParams({ defaultSort: "-deleted_at" });

  const { data, isLoading, isFetching, isError } = useTrashedProducts({
    ...apiParams,
    "filter[product_category_id]": filter ? Number(filter) : undefined,
  });

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" hideHomeButton hideBackButton />;
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8 bg-background">
      <div className="mx-auto max-w-[1600px]">
        <TableToolbar
          searchPlaceholder="Search deleted products..."
          onSearch={setSearch}
          search={search}
          filterOptions={FILTER_OPTIONS}
          selectedFilter={filter}
          onFilterChange={val => setFilter(val || undefined)}
          sortOptions={DELETED_SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          onPerPageChange={setPerPage}
          isListOptionDisplayed={true}
        />

        <ToggleableList<Product>
          items={data?.data || []}
          isLoading={isLoading}
          loadingText="Loading deleted products..."
          emptyText="No deleted products found"
          columns={DELETED_COLUMNS}
          renderItem={product => <ProductCard product={product} isDeleted />}
        />

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
