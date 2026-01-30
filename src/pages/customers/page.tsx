import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CustomerList } from "./_components/customer-list";
import { Text } from "@/components/ui/text/app-text";

export function Customers() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "customers", label: "Customers", link: "/customers" },
    { name: "list", label: "List of Customers" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <Text.TitleLarge className="mx-6">Customer Management</Text.TitleLarge>

      <CustomerList />
    </div>
  );
}
