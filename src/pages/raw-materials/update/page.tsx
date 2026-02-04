import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateRawMaterialForm } from "@/pages/raw-materials/_components/update-raw-material-form";

export default function UpdateRawMaterial() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "raw-materials", label: "Raw Materials", link: "/raw-materials" },
    { name: "update-raw-material", label: "Update Raw Material" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <div className="mx-6 mb-5">
        <UpdateRawMaterialForm />
      </div>
    </div>
  );
}
