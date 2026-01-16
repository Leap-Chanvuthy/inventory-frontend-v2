import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateSupplierForm } from "../_components/create-supplier-form";
import { ImportSupplierForm } from "../_components/import-supplier-form";
import UnderlineTabs from "@/components/reusable/partials/underline-tabs";

function CreateSupplier() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "supplier", label: "Supplier", link: "/supplier" },
    { name: "create-supplier", label: "Create a new Supplier" },
  ];

  const tabs = [
    {
      label: "Manual Create",
      value: "manual",
      content: <CreateSupplierForm />,
    },
    {
      label: "Import from File",
      value: "import",
      content: <ImportSupplierForm />,
    },
  ];

  return (
    <div>
      <div className="px-6">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="px-6 my-5">
        <UnderlineTabs
          name="create-supplier"
          tabs={tabs}
          defaultValue="manual"
        />
      </div>
    </div>
  );
}

export default CreateSupplier;
