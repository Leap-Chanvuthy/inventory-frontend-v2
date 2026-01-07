import { useParams } from "react-router-dom";
import { ViewCategoryForm } from "../_components/view-category-form";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { useSingleUser } from "@/api/users/user.query";
import { useSingleRawMaterialCategory } from "@/api/categories/category.query";

export const ViewCategories = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const { data: category } = useSingleRawMaterialCategory(categoryId);

  const breadcrumbItems = [
    { name: "application", label: "Application", link: "/" },
    { name: "categories", label: "Categories", link: "/categories" },
    { name: "view-categories", label: "View Categories" },

    {
      name: `${category?.data.category_name || ""}`,
      label: `${category?.data.category_name || "Update User"}`,
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>{" "}
      {id && <ViewCategoryForm categoryId={id} />}
    </div>
  );
};
