import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateCategoryForm } from "../_components/update-raw-material-category-form";

export const EditCategories = () => {
  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    { name: "categories", label: "Category", link: "/categories" },
    { name: "edit-category", label: "Edit Raw Material Category" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6">
        <UpdateCategoryForm />
      </div>
    </div>
  );
};
