import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateCustomerCategoryForm } from "../_components/update-customer-category-form";
import { useSingleCustomerCategory } from "@/api/categories/customer-categories/customer-category.query";
import { useParams } from "react-router-dom";

export const EditCustomerCategories = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useSingleCustomerCategory(Number(id));
  const categoryName = data?.data?.category_name;

  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    {
      name: "customer-categories",
      label: "Customer Categories",
      link: "/categories?tab=customer-category",
    },
    { name: "update-category", label: "Update Customer Category" },
    { name: categoryName || "", label: categoryName || "", className: "text-primary font-medium" },
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
