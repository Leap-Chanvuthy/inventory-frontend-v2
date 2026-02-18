import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useDeletedRawMaterials } from "@/api/raw-materials/raw-material.query";
import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import { FILTER_OPTIONS, RawMaterialCard } from "../utils/table-feature";
import {
  DELETED_SORT_OPTIONS,
  DELETED_COLUMNS,
} from "../utils/deleted-table-feature";

export function DeletedRawMaterialList() {
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

  const { data, isLoading, isError } = useDeletedRawMaterials({
    ...apiParams,
    "filter[raw_material_category_id]": filter ? Number(filter) : undefined,
  });

  if (isError && !data) {
    return (
      <p className="text-center text-red-500">
        Failed to load deleted raw materials
      </p>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8 bg-background">
      <div className="mx-auto max-w-[1600px]">
        <TableToolbar
          searchPlaceholder="Search deleted raw materials..."
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

        <ToggleableList<RawMaterial>
          items={data?.data || []}
          isLoading={isLoading}
          emptyText="No deleted raw materials found"
          columns={DELETED_COLUMNS}
          renderItem={rawMaterial => (
            <RawMaterialCard rawMaterial={rawMaterial} isDeleted />
          )}
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
