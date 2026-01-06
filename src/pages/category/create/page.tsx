import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateCategoryForm } from "../_components/create-category-form";

export const CreateCategories = () => {
  const breadcrumbItems = [
    { name: "catalog", label: "Catalog", link: "/" },
    { name: "categories", label: "Category", link: "/categories" },
    { name: "create-category", label: "Create a new Raw Material Category" },
  ];

  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <CreateCategoryForm />
    </div>
  );
};
