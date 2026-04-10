import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import { DeletedProductList } from "../_components/deleted-product-list";

export default function DeletedProducts() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "products", label: "Products", link: "/products" },
    { name: "deleted", label: "Deleted Products" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Text.TitleLarge className="mx-6">Deleted Products</Text.TitleLarge>
      <DeletedProductList />
    </div>
  );
}
