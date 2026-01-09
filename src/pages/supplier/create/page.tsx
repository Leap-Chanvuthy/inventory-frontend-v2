import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateSupplierForm } from "../_components/create-supplier-form";

function CreateSupplier() {
  const breadcrumbItems = [
    { name: "managerment", label: "Managerment", link: "/" },
    { name: "supplier", label: "Supplier", link: "/supplier" },
    { name: "create-supplier", label: "Create a new Supplier" },
  ];

  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <CreateSupplierForm />
    </div>
  );
}

export default CreateSupplier;
