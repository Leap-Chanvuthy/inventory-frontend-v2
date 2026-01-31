import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { SupplierList } from "./_components/supplier-list";
import { SupplierStatistics } from "./_components/supplier-statistics";
import { Text } from "@/components/ui/text/app-text";

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

      <Text.TitleLarge className="mx-6">Supplier Management</Text.TitleLarge>

      <SupplierStatistics />

      <SupplierList />
    </div>
  );
}
