import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateCategoryForm } from "../_components/update-product-category-form";
import { useSingleProductCategory } from "@/api/categories/product-categories/product-category.query";
import { useParams } from "react-router-dom";

export const EditProductCategories = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useSingleProductCategory(Number(id));
  const categoryName = data?.data?.category_name;

  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    {
      name: "product-categories",
      label: "Product Categories",
      link: "/categories?tab=product-category",
    },
    { name: "update-category", label: "Update Product Category" },
    {
      name: categoryName || "",
      label: categoryName || "",
      className: "text-primary font-medium",
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <UpdateCategoryForm />
    </div>
  );
};
