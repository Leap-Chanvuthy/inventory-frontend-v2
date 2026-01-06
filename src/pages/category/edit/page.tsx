import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateCategoryForm } from "../_components/update-category-form";

export const EditCategories = () => {
  const breadcrumbItems = [
    { name: "catalog", label: "Catalog", link: "/" },
    { name: "categories", label: "Category", link: "/categories" },
    { name: "edit-category", label: "Edit Raw Material Category" },
  ];

  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <UpdateCategoryForm />
    </div>
  );
};
