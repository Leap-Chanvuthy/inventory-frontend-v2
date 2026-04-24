import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateProductForm } from "../_components/update-product-form";
import { useSingleProduct } from "@/api/product/product.query";
import { useParams } from "react-router";

const UpdateProduct = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data } = useSingleProduct(productId);
  const productName = data?.data?.product?.product_name || "";

  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "products", label: "Products", link: "/products" },
    { name: "update", label: "Update Product" },
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
      <UpdateProductForm />
    </div>
  );
};

export default UpdateProduct;
