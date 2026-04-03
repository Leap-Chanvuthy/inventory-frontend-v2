import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ViewProductForm } from "../_components/view-product-form";

export function ProductDetail() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "products", label: "Products", link: "/products" },
    { name: "detail", label: "Product Detail" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6 mb-5">
        <ViewProductForm />
      </div>
    </div>
  );
}
