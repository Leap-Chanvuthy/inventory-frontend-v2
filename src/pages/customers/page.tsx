import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CustomerList } from "./_components/customer-list";
import { Text } from "@/components/ui/text/app-text";

import { CategoryFilterLayout } from "@/components/reusable/sidebar-filter/category-filter-layout";
import { CategoryFilterSidebar } from "@/components/reusable/sidebar-filter/category-filter-sidebar";
import { useCategoryFilterController } from "@/components/reusable/sidebar-filter/use-category-filter-controller";
import { CustomerCategoryQueryParams, CustomerCategory } from "@/api/categories/types/category.type";
import { useCustomerCategories } from "@/api/categories/customer-categories/customer-category.query"; 
import { useCreateCustomerCategory, useUpdateCustomerCategory, useDeleteCustomerCategory, useRestoreCustomerCategory } from "@/api/categories/customer-categories/customer-category.mutation";
import { CreateCustomerCategoryForm } from "../category/customer-category/_components/create-customer-category-form";
import { UpdateCustomerCategoryForm } from "../category/customer-category/_components/update-customer-category-form";



export function Customers() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "customers", label: "Customers", link: "/customers" },
    { name: "list", label: "List of Customers" },
  ];

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
    } = useCategoryFilterController<CustomerCategory, CustomerCategoryQueryParams>({
      mapQueryParams: ({ page, perPage, search, status, sort }) => ({
        page,
        per_page: perPage,
        sort,
        "filter[search]": search || undefined,
        "filter[is_deleted]": status === "deleted" ? 1 : 0,
      }),
      useCategoriesQuery: useCustomerCategories,
      useCreateMutation: useCreateCustomerCategory,
      useUpdateMutation: useUpdateCustomerCategory,
      useDeleteMutation: useDeleteCustomerCategory,
      useRestoreMutation: useRestoreCustomerCategory,
    });

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <Text.TitleLarge className="mx-6">Customer Management</Text.TitleLarge>
            <div className="mx-6">
              <CategoryFilterLayout
                categoryKey="customer_category_id"
                categoryLabel="Customer Categories"
                sidebar={
                  <CategoryFilterSidebar
                    categoryKey="customer_category_id"
                    categoryLabel="Customer Categories"
                    createMode="modal"
                    createHref="/categories/customer-categories/create"
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
                    getCategoryCount={category => category.customers_count || 0}
                    getCategoryViewHref={category =>
                      `/categories/customer-categories/view/${category.id}`
                    }
                    renderCreateForm={({ onSuccess, onCancel }) => (
                      <CreateCustomerCategoryForm
                        embedded
                        onSuccess={onSuccess}
                        onCancel={onCancel}
                      />
                    )}
                    renderUpdateForm={({ category, values, onSuccess, onCancel }) =>
                      category ? (
                        <UpdateCustomerCategoryForm
                          categoryId={category.id}
                          initialData={{
                            category_name:
                              values?.category_name || category.category_name,
                            label_color: values?.label_color || category.label_color,
                            description: values?.description || category.description,
                            discount_percentage: String(
                              category.discount_percentage ?? 0,
                            ),
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
                <CustomerList embedded />
              </CategoryFilterLayout>
            </div>



      {/* <CustomerList /> */}
    </div>
  );
}
