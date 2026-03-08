import { useParams } from "react-router-dom";
import { useSingleUomCategory } from "@/api/uom/uom.query";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ViewCategory } from "../_components/view-category";

export default function ViewUomCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useSingleUomCategory(Number(id));

  const categoryName = data?.data?.name ?? "View Category";

  const breadcrumbItems = [
    { name: "uom", label: "UOM", link: "/unit-of-measurement" },
    { name: "categories", label: "UOM Categories", link: "/unit-of-measurement/categories" },
    { name: "view", label: categoryName },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6">
        <ViewCategory id={Number(id)} />
      </div>
    </div>
  );
}
