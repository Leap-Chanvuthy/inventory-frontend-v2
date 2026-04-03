import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useProducts } from "@/api/product/product.query";
import { Product } from "@/api/product/product.type";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import { COLUMNS, SORT_OPTIONS, FILTER_OPTIONS, ProductCard } from "../utils/table-feature";
import UnexpectedError from "@/components/reusable/partials/error";

export function ProductList() {
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


  const baseParams = { ...apiParams } as Record<string, unknown>;
  delete baseParams.filter;

  const isNumericFilter = filter ? /^\d+$/.test(String(filter)) : false;

  const apiCallParams = {
    ...baseParams,
    "filter[product_category_id]": isNumericFilter ? Number(filter) : undefined,
    "filter[product_type]": !isNumericFilter && filter ? filter : undefined,
  } as any;

  const { data, isLoading, isError, isFetching } = useProducts(apiCallParams);

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" hideHomeButton hideBackButton />;
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8 bg-background">
      <div className="mx-auto max-w-[1600px]">
        <TableToolbar
          searchPlaceholder="Search products..."
          onSearch={setSearch}
          search={search}
          selectedFilter={filter}
          onFilterChange={(val) => setFilter(val || undefined)}
          filterOptions={FILTER_OPTIONS}
          sortOptions={SORT_OPTIONS}
          onSortChange={(values) => setSort(values[0])}
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          onPerPageChange={setPerPage}
          createHref="/products/create"
          isListOptionDisplayed={true}
        />

        <ToggleableList<Product>
          items={data?.data || []}
          isLoading={isLoading}
          loadingText="Loading products..."
          emptyText="No products found"
          columns={COLUMNS}
          renderItem={(product) => <ProductCard product={product} />}
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
