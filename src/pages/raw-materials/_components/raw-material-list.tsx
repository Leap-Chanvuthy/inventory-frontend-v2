import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useRawMaterials } from "@/api/raw-materials/raw-material.query";
import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import {
  COLUMNS,
  FILTER_OPTIONS,
  SORT_OPTIONS,
  RawMaterialCard,
} from "../utils/table-feature";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UnexpectedError from "@/components/reusable/partials/error";

export function RawMaterialList() {
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

  const { data, isLoading, isError, isFetching } = useRawMaterials({
    ...apiParams,
    "filter[raw_material_category_id]": filter ? Number(filter) : undefined,
  });

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" hideHomeButton hideBackButton />;
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search raw materials..."
          onSearch={setSearch}
          search={search}
          filterOptions={FILTER_OPTIONS}
          selectedFilter={filter}
          onFilterChange={val => setFilter(val || undefined)}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          onPerPageChange={setPerPage}
          createHref="/raw-materials/create"
          isListOptionDisplayed={true}
          extraActions={
            <Button variant="outline" asChild>
              <Link to="/raw-materials/deleted">
                <Trash2 className="w-4 h-4 mr-1.5 text-red-500" />
                Recently Deleted
              </Link>
            </Button>
          }
        />

        <ToggleableList<RawMaterial>
          items={data?.data || []}
          isLoading={isLoading}
          loadingText="Loading raw materials data..."
          emptyText="No raw materials found"
          columns={COLUMNS}
          renderItem={rawMaterial => (
            <RawMaterialCard rawMaterial={rawMaterial} />
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
