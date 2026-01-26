import { useParams } from "react-router-dom";
import { ViewCustomerCategoryForm } from "../_components/view-customer-category-form";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { useSingleCustomerCategory } from "@/api/categories/customer-categories/customer-category.query";

export const ViewCustomerCategories = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const { data: category } = useSingleCustomerCategory(categoryId);

  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    {
      name: "customer-categories",
      label: "Customer Categories",
      link: "/categories?tab=customer-category",
    },
    { name: "view-categories", label: "View Category" },

    {
      name: `${category?.data.category_name || ""}`,
      label: `${category?.data.category_name || "Customer Category"}`,
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5 ">
        <BreadCrumb items={breadcrumbItems} />
      </div>{" "}
      {id && <ViewCustomerCategoryForm categoryId={id} />}
    </div>
  );
};
