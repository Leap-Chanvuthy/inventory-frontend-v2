import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ImportSupplierForm } from "../_components/import-supplier-form";

function ImportSuppliers() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "supplier", label: "Supplier", link: "/supplier" },
    { name: "import-suppliers", label: "Import Suppliers" },
  ];

  return (
    <div>
      <div className="px-6">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="px-6">
        <ImportSupplierForm />
      </div>
    </div>
  );
}

export default ImportSuppliers;
