import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { DeletedSupplierList } from "../_components/deleted-supplier-list";
import { Text } from "@/components/ui/text/app-text";

export default function DeletedSuppliers() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "supplier", label: "Suppliers", link: "/supplier" },
    { name: "deleted", label: "Deleted Suppliers" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Text.TitleLarge className="mx-6">Deleted Suppliers</Text.TitleLarge>
      <DeletedSupplierList />
    </div>
  );
}
