import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { useUOMs } from "@/api/uom/uom.query";
import { UOM } from "@/api/uom/uom.types";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { COLUMNS, SORT_OPTIONS, UOMCard } from "../utils/table-feature";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import UnexpectedError from "@/components/reusable/partials/error";
import { useUomCategories } from "@/api/uom/uom.query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";

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

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const { data: categoriesData } = useUomCategories({ per_page: 100 });
  const categories = categoriesData?.data ?? [];

  const { data, isLoading, isFetching, isError } = useUOMs({
    ...apiParams,
    "filter[is_active]": filter
      ? filter === "active"
        ? true
        : false
      : undefined,
    ...(selectedCategory ? { "filter[category_id]": selectedCategory } : {}),
  });

  const uoms = data?.data || [];
  const totalPages = data?.last_page || 1;

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" hideHomeButton hideBackButton />;
  }

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-[1600px]">

        {/* Category filter pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              size="sm"
              className={selectedCategory === undefined ? "bg-[#5c52d6] text-white" : ""}
              onClick={() => setSelectedCategory(undefined)}
            >
              All Categories
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                className={selectedCategory === cat.id ? "bg-[#5c52d6] text-white" : ""}
                onClick={() =>
                  setSelectedCategory(prev =>
                    prev === cat.id ? undefined : cat.id
                  )
                }
              >
                {cat.name}
              </Button>
            ))}
            <Link
              to="/unit-of-measurement/categories"
              className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Tag className="h-3.5 w-3.5" />
              Manage Categories
            </Link>
          </div>
        )}

        {/* Toolbar */}
        <TableToolbar
          searchPlaceholder="Search UOM..."
          onSearch={setSearch}
          search={search}
          sortOptions={SORT_OPTIONS}
          onSortChange={values => setSort(values[0])}
          createHref="/unit-of-measurement/create"
          requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
          perPage={perPage}
          onPerPageChange={setPerPage}
          isListOptionDisplayed={true}
        />

        {/* Toggleable List */}
        <ToggleableList<UOM>
          items={uoms}
          isLoading={isLoading}
          loadingText="Loading UOMs data..."
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
