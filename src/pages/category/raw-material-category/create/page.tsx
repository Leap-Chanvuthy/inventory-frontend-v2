import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateCategoryForm } from "../_components/create-category-form";

export const CreateCategories = () => {
  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    { name: "categories", label: "Category", link: "/categories" },
    { name: "create-category", label: "Create a new Raw Material Category" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* Form */}
      <CreateCategoryForm />
    </div>
  );
};
