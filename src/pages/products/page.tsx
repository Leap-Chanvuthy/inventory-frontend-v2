import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import { ProductList } from "./_components/product-list";

const Product = () => {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "products", label: "Products", link: "/products" },
    { name: "list", label: "List of Products" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <Text.TitleLarge className="mx-6">Product Management</Text.TitleLarge>
      <ProductList />
    </div>
  );
};

export default Product;
