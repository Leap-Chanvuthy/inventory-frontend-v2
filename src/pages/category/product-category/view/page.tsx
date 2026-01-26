import { useParams } from "react-router-dom";
import { ViewCategoryForm } from "../_components/view-product-category-form";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { useSingleProductCategory } from "@/api/categories/product-categories/product-category.query";

export const ViewProductCategories = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const { data: category } = useSingleProductCategory(categoryId);

  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    {
      name: "product-categories",
      label: "Product Categories",
      link: "/categories?tab=product-category",
    },
    { name: "view-categories", label: "View Category" },

    {
      name: `${category?.data.category_name || ""}`,
      label: `${category?.data.category_name || "Product Category"}`,
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5 ">
        <BreadCrumb items={breadcrumbItems} />
      </div>{" "}
      {id && <ViewCategoryForm categoryId={id} />}
    </div>
  );
};
