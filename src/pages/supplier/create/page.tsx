import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateSupplierForm } from "../_components/create-supplier-form";

function CreateSupplier() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "supplier", label: "Supplier", link: "/supplier" },
    { name: "create-supplier", label: "Create a new Supplier" },
  ];

  return (
    <div>
      <div className="px-6">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="px-6">
        <CreateSupplierForm />
      </div>
    </div>
  );
}

export default CreateSupplier;
