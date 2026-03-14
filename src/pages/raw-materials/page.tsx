import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { RawMaterialList } from "./_components/raw-material-list";
import { Text } from "@/components/ui/text/app-text";
import { CategoryFilterLayout } from "@/components/reusable/sidebar-filter/category-filter-layout";
import { CategoryFilterSidebar } from "@/components/reusable/sidebar-filter/category-filter-sidebar";
import { useRawMaterialCategories } from "@/api/categories/raw-material-categories/raw-material-catergory.query";
import {
  useCreateRawMaterialCategory,
  useDeleteRawMaterialCategory,
  useRestoreRawMaterialCategory,
  useUpdateRawMaterialCategory,
} from "@/api/categories/raw-material-categories/raw-material-category.mutation";
import { useCategoryFilterController } from "@/components/reusable/sidebar-filter/use-category-filter-controller";
import { CategoryQueryParams, RawMaterialCategory } from "@/api/categories/types/category.type";
import { CreateCategoryForm } from "@/pages/category/raw-material-category/_components/create-category-form";
import { UpdateCategoryForm } from "@/pages/category/raw-material-category/_components/update-raw-material-category-form";

export default function RawMaterials() {
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
    handleRestoreCategory,
    isCreatingCategory,
    isUpdatingCategory,
  } = useCategoryFilterController<RawMaterialCategory, CategoryQueryParams>({
    mapQueryParams: ({ page, perPage, search, status, sort }) => ({
      page,
      per_page: perPage,
      sort,
      "filter[search]": search || undefined,
      "filter[is_deleted]": status === "deleted" ? 1 : 0,
    }),
    useCategoriesQuery: useRawMaterialCategories,
    useCreateMutation: useCreateRawMaterialCategory,
    useUpdateMutation: useUpdateRawMaterialCategory,
    useDeleteMutation: useDeleteRawMaterialCategory,
    useRestoreMutation: useRestoreRawMaterialCategory,
  });

  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "raw-materials", label: "Raw Materials", link: "/raw-materials" },
    { name: "list", label: "List of Raw Materials" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Text.TitleLarge className="mx-6">Raw Materials</Text.TitleLarge>

      <div className="mx-6">
        <CategoryFilterLayout
          categoryKey="raw_material_category_id"
          categoryLabel="Raw Material Categories"
          sidebar={
            <CategoryFilterSidebar
              categoryKey="raw_material_category_id"
              categoryLabel="RM Categories"
              createMode="modal"
              createHref="/categories/raw-material-categories/create"
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
              onRestoreCategory={handleRestoreCategory}
              getCategoryId={category => category.id}
              getCategoryLabel={category => category.category_name}
              getCategoryDescription={category => category.description}
              getCategoryColor={category => category.label_color}
              getCategoryCount={category => category.raw_materials_count || 0}
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
                      category_name: values?.category_name || category.category_name,
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
          <RawMaterialList embedded={true} />
        </CategoryFilterLayout>
      </div>
    </div>
  );
}
