import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import UomCategoryList from "./_components/category-list";

const breadcrumbItems = [
  { name: "catalog", label: "Catalog", link: "/categories" },
  { name: "uom", label: "UOM", link: "/unit-of-measurement" },
  { name: "categories", label: "UOM Categories" },
];

export default function UomCategoriesPage() {
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <div className="mx-6">
        <Text.TitleLarge>UOM Categories</Text.TitleLarge>
        <p className="text-sm text-muted-foreground mt-1">
          Manage categories that group related units of measurement together.
        </p>
      </div>

      <div className="mx-6 mt-8">
        <UomCategoryList />
      </div>
    </div>
  );
}
