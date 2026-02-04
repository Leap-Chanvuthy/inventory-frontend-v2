import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ViewRawMaterialForm } from "../_components/view-raw-material-form";

export function RawMaterialDetail() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "raw-materials", label: "Raw Materials", link: "/raw-materials" },
    { name: "detail", label: "Raw Material Detail" },
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
