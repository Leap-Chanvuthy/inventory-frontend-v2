import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ViewRawMaterialForm } from "../_components/view-raw-material-form";
import { useSingleRawMaterial } from "@/api/raw-materials/raw-material.query";
import { useParams } from "react-router";

export function RawMaterialDetail() {
  const { id } = useParams<{ id: string }>();
  const rawMaterialId = Number(id);
  const { data } = useSingleRawMaterial(rawMaterialId);
  const materialName = data?.data?.raw_material?.material_name || "";

  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "raw-materials", label: "Raw Materials", link: "/raw-materials" },
    { name: "detail", label: "Raw Material Detail" },
    {
      name: materialName,
      label: materialName,
      className: "text-primary font-medium",
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <div className="mx-6 mb-5">
        <ViewRawMaterialForm />
      </div>
    </div>
  );
}
