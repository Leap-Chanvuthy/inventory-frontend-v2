import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateSupplierForm } from "../_components/update-supplier-form";

function UpdateSupplier() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "supplier", label: "Supplier", link: "/supplier" },
    { name: "update-supplier", label: "Update Supplier" },
  ];

  return (
    <div>
      <div className="px-6">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="px-6">
        <UpdateSupplierForm />
      </div>
    </div>
  );
}

export default UpdateSupplier;
