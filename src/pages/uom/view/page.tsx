import { useParams } from "react-router-dom";
import { useSingleUOM } from "@/api/uom/uom.query";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ViewUOM } from "../_components/view-uom";

const ViewUOMPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useSingleUOM(Number(id));

  // Handle different response structures
  const uom = data?.data || data;

  // Get breadcrumb label
  const getBreadcrumbLabel = () => {
    if (!uom || !("name" in uom)) return "View UOM";
    return `${uom.name}${uom.symbol ? ` | ${uom.symbol}` : ""}`;
  };

  const breadcrumbItems = [
    { name: "catalog", label: "Catalog", link: "/categories" },
    { name: "uom", label: "UOM", link: "/unit-of-measurement" },
    {
      name: "view",
      label: getBreadcrumbLabel(),
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <div className="mx-6">
        <ViewUOM id={Number(id)} />
      </div>
    </div>
  );
};

export default ViewUOMPage;
