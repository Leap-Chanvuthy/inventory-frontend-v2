import { useSingleRawMaterialCategory } from "@/api/categories/raw-material-categories/raw-material-catergory.query";
import { useDeleteRawMaterialCategory } from "@/api/categories/raw-material-categories/raw-material-category.mutation";
import DataTableLoading from "@/components/reusable/data-table/data-table-loading";
import { formatDate } from "@/utils/date-format";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { Text } from "@/components/ui/text/app-text";
import { useNavigate } from "react-router-dom";
import { IconBadge } from "@/components/ui/icons-badge";

interface ViewCategoryFormProps {
  categoryId: string;
}

export const ViewCategoryForm = ({ categoryId }: ViewCategoryFormProps) => {
  const id = Number(categoryId);
  const navigate = useNavigate();
  const deleteMutation = useDeleteRawMaterialCategory();

  const {
    data: categoryResponse,
    isLoading,
    isError,
  } = useSingleRawMaterialCategory(id);

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate("/categories?tab=raw-material-category");
      },
    });
  };

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
          <Text.TitleLarge className="truncate">
            {category.category_name}
          </Text.TitleLarge>
          <HeaderActionButtons
            editPath={`/raw-material-categories/edit/${id}`}
            showEdit={true}
            showDelete={true}
            onDelete={handleDelete}
            deleteHeading="Delete This Raw Material Category"
            deleteSubheading="Are you sure you want to delete this raw material category? This action cannot be undone."
          />
        </div>

        {/* Content Card */}
        <div className="rounded-2xl shadow-sm border bg-card">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Side - Category Details */}
              <div className="space-y-5">
                {/* Category Name & Color Header */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: category.label_color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <IconBadge label="name" variant="info" />
                      Category Name
                    </p>
                    <p className="text-lg font-semibold truncate">
                      {category.category_name}
                    </p>
                    <span className="text-xs font-mono text-muted-foreground">
                      {category.label_color}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <IconBadge label="status" variant="success" />
                      Status
                    </p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Dates Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <IconBadge label="created_date" />
                      Created At
                    </p>
                    <p className="font-medium">
                      {formatDate(category.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <IconBadge label="updated_date" />
                      Updated At
                    </p>
                    <p className="font-medium">
                      {formatDate(category.updated_at)}
                    </p>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <IconBadge label="description" variant="info" />
                    Description
                  </p>
                  <p className="font-medium whitespace-pre-wrap">
                    {category.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Right Side - Chart Placeholder */}
              <div>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground font-medium mb-2">
                      Raw Material Count by Category
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Chart coming soon
                    </p>
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
