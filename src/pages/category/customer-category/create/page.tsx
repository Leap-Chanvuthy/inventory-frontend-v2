import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateCustomerCategoryForm } from "../_components/create-customer-category-form";

export const CreateCustomerCategories = () => {
  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    {
      name: "customer-categories",
      label: "Customer Categories",
      link: "/categories",
    },
    { name: "create-category", label: "Create a new Customer Category" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {/* Form */}
      <CreateCustomerCategoryForm />
    </div>
  );
};
