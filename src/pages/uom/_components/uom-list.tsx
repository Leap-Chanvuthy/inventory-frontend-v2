import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { useUOMs } from "@/api/uom/uom.query";
import { UOM } from "@/api/uom/uom.types";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { COLUMNS, SORT_OPTIONS, UOMCard } from "../utils/table-feature";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";

export default function UOMList() {
  const {
    page,
    setPage,
    setPerPage,
    setSearch,
    setSort,
    perPage,
    search,
    filter,
    apiParams,
  } = useTableQueryParams();

  const { data, isLoading, isError } = useUOMs({
    ...apiParams,
    "filter[is_active]": filter
      ? filter === "active"
        ? true
        : false
      : undefined,
  });

  const uoms = data?.data || [];
  const totalPages = data?.last_page || 1;

  if (isError) {
    return <p className="text-center text-red-500">Failed to load UOMs</p>;
  }

  return (
    <div className="w-full  bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search UOM..."
          onSearch={setSearch}
          search={search}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          createHref="/uom/create"
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          onPerPageChange={setPerPage}
          isListOptionDisplayed={true}
        />

        {/* Toggleable List with Card and Table View */}
        <ToggleableList<UOM>
          items={uoms}
          isLoading={isLoading}
          emptyText="No UOMs found"
          columns={COLUMNS}
          renderItem={uom => <UOMCard uom={uom} />}
        />

        {/* Pagination */}
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
