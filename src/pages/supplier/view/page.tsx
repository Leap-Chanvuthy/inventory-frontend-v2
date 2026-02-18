import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ViewSupplierForm } from "../_components/view-detail/view-supplier-form";

export function SupplierDetail() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "supplier", label: "Supplier", link: "/supplier" },
    { name: "detail", label: "Supplier Detail" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <div className="mx-6 mb-5">
        <ViewSupplierForm />
      </div>
    </div>
  );
}
