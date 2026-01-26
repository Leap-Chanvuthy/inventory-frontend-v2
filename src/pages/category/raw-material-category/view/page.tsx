import { useParams } from "react-router-dom";
import { ViewCategoryForm } from "../_components/view-raw-material-form";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { useSingleRawMaterialCategory } from "@/api/categories/raw-material-categories/raw-material-catergory.query";

export const ViewCategories = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const { data: category } = useSingleRawMaterialCategory(categoryId);

  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    {
      name: "categories",
      label: "Categories",
      link: "/categories?tab=raw-material-category",
    },
    { name: "view-categories", label: "View Categories" },

    {
      name: `${category?.data.category_name || ""}`,
      label: `${category?.data.category_name || "Update User"}`,
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
