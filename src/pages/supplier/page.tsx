import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { SupplierList } from "./_components/supplier-list";

export function Supplier() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "supplier", label: "Supplier", link: "/supplier" },
    { name: "list", label: "List of Supplier" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl font-bold mx-6">Supplier Managerment</h1>

      <SupplierList />
    </div>
  );
}
