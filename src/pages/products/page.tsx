import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import { ProductList } from "./_components/product-list";
import { CategoryFilterLayout } from "@/components/reusable/sidebar-filter/category-filter-layout";
import { CategoryFilterSidebar } from "@/components/reusable/sidebar-filter/category-filter-sidebar";
import { useProductCategories } from "@/api/categories/product-categories/product-category.query";
import {
  useCreateProductCategory,
  useDeleteProductCategory,
  useUpdateProductCategory,
} from "@/api/categories/product-categories/product-category.mutation";
import { useCategoryFilterController } from "@/components/reusable/sidebar-filter/use-category-filter-controller";
import {
  CategoryQueryParams,
  ProductCategory,
} from "@/api/categories/types/category.type";
import { CreateCategoryForm } from "@/pages/category/product-category/_components/create-category-form";
import { UpdateCategoryForm } from "@/pages/category/product-category/_components/update-product-category-form";

const Product = () => {
  const {
    categories,
    categoriesLoading,
    categoryPage,
    categorySearch,
    categoryStatus,
    categoryLastPage,
    selectedCategory,
    setCategoryPage,
    setSelectedCategory,
    onCategorySearchChange,
    onCategoryStatusToggle,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    isCreatingCategory,
    isUpdatingCategory,
  } = useCategoryFilterController<ProductCategory, CategoryQueryParams>({
    mapQueryParams: ({ page, perPage, search, sort }) => ({
      page,
      per_page: perPage,
      sort,
      "filter[search]": search || undefined,
    }),
    useCategoriesQuery: useProductCategories,
    useCreateMutation: useCreateProductCategory,
    useUpdateMutation: useUpdateProductCategory,
    useDeleteMutation: useDeleteProductCategory,
  });

  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "products", label: "Products", link: "/products" },
    { name: "list", label: "List of Products" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Text.TitleLarge className="mx-6">Products</Text.TitleLarge>

      <div className="mx-6">
        <CategoryFilterLayout
          categoryKey="product_category_id"
          categoryLabel="Product Categories"
          sidebar={
            <CategoryFilterSidebar
              categoryKey="product_category_id"
              categoryLabel="PD Categories"
              createMode="modal"
              createHref="/categories/product-categories/create"
              categories={categories}
              isLoading={categoriesLoading}
              selectedCategory={selectedCategory}
              categoryStatus={categoryStatus}
              categoryPage={categoryPage}
              categoryLastPage={categoryLastPage}
              categorySearch={categorySearch}
              isCreatingCategory={isCreatingCategory}
              isUpdatingCategory={isUpdatingCategory}
              onCategorySearchChange={onCategorySearchChange}
              onCategoryPageChange={setCategoryPage}
              onCategoryStatusToggle={onCategoryStatusToggle}
              onCategoryChange={setSelectedCategory}
              onCreateCategory={handleCreateCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              getCategoryId={category => category.id}
              getCategoryLabel={category => category.category_name}
              getCategoryDescription={category => category.description}
              getCategoryColor={category => category.label_color}
              getCategoryCount={category => category.products_count || 0}
              renderCreateForm={({ onSuccess, onCancel }) => (
                <CreateCategoryForm
                  embedded
                  onSuccess={onSuccess}
                  onCancel={onCancel}
                />
              )}
              renderUpdateForm={({ category, values, onSuccess, onCancel }) =>
                category ? (
                  <UpdateCategoryForm
                    categoryId={category.id}
                    initialData={{
                      category_name:
                        values?.category_name || category.category_name,
                      label_color: values?.label_color || category.label_color,
                      description: values?.description || category.description,
                    }}
                    embedded
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                  />
                ) : null
              }
            />
          }
        >
          <ProductList embedded={true} />
        </CategoryFilterLayout>
      </div>
    </div>
  );
};

export default Product;
