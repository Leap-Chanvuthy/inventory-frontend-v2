import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateCategoryForm } from "../_components/update-product-category-form";

export const EditProductCategories = () => {
  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    {
      name: "product-categories",
      label: "Product Categories",
      link: "/categories",
    },
    { name: "edit-category", label: "Edit Product Category" },
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
