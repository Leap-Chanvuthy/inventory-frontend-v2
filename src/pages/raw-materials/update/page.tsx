import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateRawMaterialForm } from "@/pages/raw-materials/_components/update-raw-material-form";
import { useSingleRawMaterial } from "@/api/raw-materials/raw-material.query";
import { useParams } from "react-router";

export default function UpdateRawMaterial() {
  const { id } = useParams<{ id: string }>();
  const { data } = useSingleRawMaterial(Number(id));
  const materialName = data?.data?.raw_material?.material_name;

  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "raw-materials", label: "Raw Materials", link: "/raw-materials" },
    { name: "update-raw-material", label: "Update Raw Material" },
    {
      name: materialName || "",
      label: materialName || "",
      className: "text-primary font-medium",
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <UpdateRawMaterialForm />
    </div>
  );
}
