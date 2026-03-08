import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { useUomCategories } from "@/api/uom/uom.query";
import { UomCategory } from "@/api/uom/uom.types";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import {
  CATEGORY_COLUMNS,
  CATEGORY_SORT_OPTIONS,
  CategoryCard,
} from "../utils/table-feature";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import UnexpectedError from "@/components/reusable/partials/error";

export default function UomCategoryList() {
  const {
    page,
    setPage,
    setPerPage,
    setSearch,
    setSort,
    perPage,
    search,
    apiParams,
  } = useTableQueryParams();

  const { data, isLoading, isFetching, isError } = useUomCategories({
    ...apiParams,
  });

  const categories = data?.data || [];
  const totalPages = data?.last_page || 1;

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" hideHomeButton hideBackButton />;
  }

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-[1600px]">
        <TableToolbar
          searchPlaceholder="Search categories..."
          onSearch={setSearch}
          search={search}
          sortOptions={CATEGORY_SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          createHref="/unit-of-measurement/categories/create"
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          onPerPageChange={setPerPage}
          isListOptionDisplayed={true}
        />

        <ToggleableList<UomCategory>
          items={categories}
          isLoading={isLoading}
          loadingText="Loading categories..."
          emptyText="No UOM categories found"
          columns={CATEGORY_COLUMNS}
          renderItem={cat => <CategoryCard category={cat} />}
        />

        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <GlobalPagination
              currentPage={page}
              lastPage={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
