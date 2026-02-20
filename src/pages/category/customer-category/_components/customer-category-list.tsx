import { useTableQueryParams } from "@/hooks/use-table-query-params";
import { useCustomerCategories } from "@/api/categories/customer-categories/customer-category.query";
import SingleCard from "../../_components/category-single-card";
import { TableToolbar } from "@/components/reusable/partials/table-toolbar";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { createColumns, SORT_OPTIONS } from "../../utils/table-feature";
import { ToggleableList } from "@/components/reusable/partials/toggleable-list";
import { CustomerCategory } from "@/api/categories/types/category.type";
import { useDeleteCustomerCategory } from "@/api/categories/customer-categories/customer-category.mutation";

export const CustomerCategoryList = () => {
  const {
    setPage,
    setSearch,
    setSort,
    setPerPage,
    perPage,
    search,
    apiParams,
  } = useTableQueryParams();

  const { data, isLoading, error } = useCustomerCategories(apiParams);
  const deleteMutation = useDeleteCustomerCategory();

  const categories = data?.data?.data || [];

  if (error) {
    return (
      <p className="text-center text-red-500">Failed to load categories</p>
    );
  }

  return (
    <div className="mt-8">
      <TableToolbar
        searchPlaceholder="Search category..."
        onSearch={setSearch}
        search={search}
        sortOptions={SORT_OPTIONS}
        onSortChange={values => setSort(values[0])}
        createHref="customer-categories/create"
        requestPerPageOptions={REQUEST_PER_PAGE_OPTIONS}
        perPage={perPage}
        onPerPageChange={setPerPage}
        isListOptionDisplayed={true}
      />

      <ToggleableList<CustomerCategory>
        items={categories}
        isLoading={isLoading}
        emptyText="No categories found"
        columns={createColumns({
          viewRoute: "customer-categories/view",
          editRoute: "customer-categories/edit",
          onDelete: id => deleteMutation.mutate(id),
        })}
        renderItem={category => (
          <SingleCard
            category={category}
            viewRoute="customer-categories/view"
            editRoute="customer-categories/edit"
            onDelete={id => {
              deleteMutation.mutate(Number(id));
            }}
          />
        )}
      />

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
