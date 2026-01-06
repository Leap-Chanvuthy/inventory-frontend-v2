import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { useRawMaterialCategories } from "@/api/categories/category.query";
import { CategoryCard } from "./category-card";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { SORT_OPTIONS } from "../utils/table-feature";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";

interface CategoryListProps {
  onDelete?: (id: number) => void;
}

export const CategoryList = ({ onDelete }: CategoryListProps) => {
  const { setPage, setSearch, setSort, setPerPage, apiParams } =
    useTableQueryParams();

  const { data, isLoading, error } = useRawMaterialCategories(apiParams);

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
        sortOptions={SORT_OPTIONS}
        onSortChange={values => setSort(values[0])}
        createHref="/categories/create"
        requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
        onPerPageChange={setPerPage}
      />

      {/* Categories Grid */}
      <CategoryCard
        data={categories}
        isLoading={isLoading}
        emptyText="No categories found"
        onDelete={onDelete}
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
