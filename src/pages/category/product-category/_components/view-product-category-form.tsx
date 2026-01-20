import { useSingleProductCategory } from "@/api/categories/product-categories/product-category.query";
import DataTableLoading from "@/components/reusable/data-table/data-table-loading";
import { formatDate } from "@/utils/date-format";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";

interface ViewCategoryFormProps {
  categoryId: string;
}

export const ViewCategoryForm = ({ categoryId }: ViewCategoryFormProps) => {
  const id = Number(categoryId);

  const {
    data: categoryResponse,
    isLoading,
    isError,
  } = useSingleProductCategory(id);

  const category = categoryResponse?.data;

  if (isLoading) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="rounded-2xl shadow-sm border bg-card">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex min-h-[400px] w-full items-center justify-center">
                <DataTableLoading />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="rounded-2xl shadow-sm border bg-card">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex min-h-[400px] w-full items-center justify-center">
                <p className="text-center text-red-500">
                  Failed to load category data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold truncate">
            {category.category_name}
          </h1>
          <HeaderActionButtons
            editPath={`/product-categories/edit/${id}`}
            showEdit={true}
            showDelete={true}
          />
        </div>

        {/* Content Card */}
        <div className="rounded-2xl shadow-sm border bg-card">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Side - Category Details */}
              <div className="space-y-6">
                {/* Category Name with Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.label_color }}
                    />
                    <span className="text-base font-medium">
                      {category.category_name}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>

                {/* Created At */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created At
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <span className="text-sm text-gray-600">
                      {formatDate(category.created_at)}
                    </span>
                  </div>
                </div>

                {/* Updated At */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Updated At
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <span className="text-sm text-gray-600">
                      {formatDate(category.updated_at)}
                    </span>
                  </div>
                </div>

                {/* Label Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Label Colour
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-white shadow-sm flex-shrink-0"
                      style={{ backgroundColor: category.label_color }}
                    />
                    <span className="text-sm font-mono text-gray-600">
                      {category.label_color}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {category.description || "No description provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Chart Placeholder */}
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 font-medium mb-2">
                      Product Count by Category
                    </p>
                    <p className="text-sm text-gray-400">Chart coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
