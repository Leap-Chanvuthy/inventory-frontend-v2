import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import { CreateCategoryForm } from "../_components/create-category-form";

const breadcrumbItems = [
  { name: "uom", label: "UOM", link: "/unit-of-measurement" },
  { name: "categories", label: "UOM Categories", link: "/unit-of-measurement/categories" },
  { name: "create", label: "Create Category" },
];

export default function CreateUomCategoryPage() {
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6 mb-6">
        <Text.TitleLarge>Create UOM Category</Text.TitleLarge>
        <Text.Medium className="mt-1">
          Add a new category to group related units of measurement.
        </Text.Medium>
      </div>
      <CreateCategoryForm />
    </div>
  );
}
