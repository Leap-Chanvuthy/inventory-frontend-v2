import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateCustomerCategoryForm } from "../_components/update-customer-category-form";

export const EditCustomerCategories = () => {
  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    {
      name: "customer-categories",
      label: "Customer Categories",
      link: "/categories?tab=customer-category",
    },
    { name: "update-category", label: "Update Customer Category" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6">
        <UpdateCustomerCategoryForm />
      </div>
    </div>
  );
};
