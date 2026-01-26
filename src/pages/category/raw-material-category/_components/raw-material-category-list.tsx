import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { useRawMaterialCategories } from "@/api/categories/raw-material-categories/raw-material-catergory.query";
import { useDeleteRawMaterialCategory } from "@/api/categories/raw-material-categories/raw-material-category.mutation";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { COLUMNS, SORT_OPTIONS } from "../../utils/table-feature";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import { RawMaterialCategory } from "@/api/categories/types/category.type";
import SingleCard from "../../_components/category-single-card";

export const RawMaterialCategoryList = () => {
  const {
    setPage,
    setSearch,
    setSort,
    setPerPage,
    perPage,
    search,
    apiParams,
  } = useTableQueryParams();

  const { data, isLoading, error } = useRawMaterialCategories(apiParams);
  const deleteMutation = useDeleteRawMaterialCategory();

  const categories = data?.data?.data || [];

  if (error) {
    return (
      <p className="text-center text-red-500">Failed to load categories</p>
    );
  }

  return (
    <div className="mt-8">
      {/* Toolbar */}

      <TableToolbar
        searchPlaceholder="Search category..."
        onSearch={setSearch}
        search={search}
        sortOptions={SORT_OPTIONS}
        onSortChange={values => setSort(values[0])}
        createHref="/raw-material-categories/create"
        requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
        perPage={perPage}
        onPerPageChange={setPerPage}
        isListOptionDisplayed={true}
      />

      {/* Categories Grid
      <CategoryCard
        data={categories}
        isLoading={isLoading}
        emptyText="No categories found"
        onDelete={onDelete}
        viewRoute="/categories/view"
        editRoute="/categories/edit"
      /> */}

      <ToggleableList<RawMaterialCategory>
        items={categories}
        isLoading={isLoading}
        emptyText="No categories found"
        columns={COLUMNS}
        renderItem={category => (
          <SingleCard
            category={category}
            onDelete={id => {
              deleteMutation.mutate(Number(id));
            }}
            viewRoute="/raw-material-categories/view"
            editRoute="/raw-material-categories/edit"
          />
        )}
      />

      {/* Pagination */}
      {data?.data && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <GlobalPagination
              currentPage={data.data.current_page || 1}
              lastPage={data.data.last_page || 1}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};
