import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateCategoryForm } from "../_components/update-raw-material-category-form";
import { useSingleRawMaterialCategory } from "@/api/categories/raw-material-categories/raw-material-catergory.query";
import { useParams } from "react-router-dom";

export const EditCategories = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useSingleRawMaterialCategory(Number(id));
  const categoryName = data?.data?.category_name;

  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    {
      name: "categories",
      label: "Category",
      link: "/categories?tab=raw-material-category",
    },
    { name: "update-category", label: "Update Raw Material Category" },
    { name: categoryName || "", label: categoryName || "", className: "text-primary font-medium" },
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
