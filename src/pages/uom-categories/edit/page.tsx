import { useParams } from "react-router-dom";
import { useSingleUomCategory } from "@/api/uom/uom.query";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { EditCategoryForm } from "../_components/edit-category-form";

export default function EditUomCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useSingleUomCategory(Number(id));
  const categoryName = data?.data?.name;

  const breadcrumbItems = [
    { name: "uom", label: "UOM", link: "/unit-of-measurement" },
    { name: "categories", label: "UOM Categories", link: "/unit-of-measurement/categories" },
    { name: "edit", label: "Edit UOM Category" },
    { name: categoryName || "", label: categoryName || "", className: "text-primary font-medium" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <EditCategoryForm />
    </div>
  );
}
