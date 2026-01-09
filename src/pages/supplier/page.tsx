import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { SupplierList } from "./_components/supplier-list";

export function Supplier() {
  const breadcrumbItems = [
    { name: "management", label: "Management", link: "/" },
    { name: "supplier", label: "Supplier", link: "/supplier" },
    { name: "list", label: "List of Supplier" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="my-8 mx-6">
        <h1 className="text-3xl font-bold mb-2">Supplier Managerment</h1>
        <p className="text-sm text-muted-foreground">
          {/* Below the inputs, there is an interactive map preview with. */}
          {/* if have subtitle */}
        </p>
      </div>

      <SupplierList />
    </div>
  );
}
