import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useRawMaterials } from "@/api/raw-materials/raw-material.query";
import { RawMaterial } from "@/api/raw-materials/raw-material.types";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import { COLUMNS, SORT_OPTIONS, RawMaterialCard } from "../utils/table-feature";
import { useSearchParams } from "react-router-dom";
import UnexpectedError from "@/components/reusable/partials/error";
import { useEffect } from "react";

interface RawMaterialListProps {
  embedded?: boolean;
}

export function RawMaterialList({ embedded = false }: RawMaterialListProps) {
  const {
    setPage,
    setSearch,
    setSort,
    setPerPage,
    perPage,
    filter,
    search,
    apiParams,
  } = useTableQueryParams();

  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("category_id")
    ? Number(searchParams.get("category_id"))
    : undefined;

  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId, setPage]);

  const { data, isLoading, isError, isFetching } = useRawMaterials({
    ...apiParams,
    "filter[raw_material_category_id]":
      selectedCategoryId || (filter ? Number(filter) : undefined),
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
          searchPlaceholder="Search raw materials..."
          onSearch={setSearch}
          search={search}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          onPerPageChange={setPerPage}
          createHref="/raw-materials/create"
          isListOptionDisplayed={true}
          deletedPathname="/raw-materials/deleted"
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
