import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ViewProductForm } from "../_components/view-product-form";
import { useSingleProduct } from "@/api/product/product.query";
import { useParams } from "react-router";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data } = useSingleProduct(productId);
  const productName = data?.data?.product?.product_name || "";

  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "products", label: "Products", link: "/products" },
    { name: "detail", label: "Product Detail" },
    {
      name: productName,
      label: productName,
      className: "text-primary font-medium",
    },
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
