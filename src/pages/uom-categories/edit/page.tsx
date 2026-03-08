import { useParams } from "react-router-dom";
import { useSingleUomCategory } from "@/api/uom/uom.query";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import { EditCategoryForm } from "../_components/edit-category-form";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";

export default function EditUomCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useSingleUomCategory(Number(id));

  if (isLoading) return <DataCardLoading text="Loading category..." />;

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load category</p>
      </div>
    );
  }

  const category = data.data;

  const breadcrumbItems = [
    { name: "uom", label: "UOM", link: "/unit-of-measurement" },
    { name: "categories", label: "UOM Categories", link: "/unit-of-measurement/categories" },
    { name: "edit", label: `Edit ${category.name}` },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6 mb-6">
        <Text.TitleLarge>Edit UOM Category</Text.TitleLarge>
        <Text.Medium className="mt-1">
          Update the details of this category.
        </Text.Medium>
      </div>
      <EditCategoryForm category={category} />
    </div>
  );
}
