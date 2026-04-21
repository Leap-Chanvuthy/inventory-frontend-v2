import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateProductForm } from "../_components/update-product-form";

const UpdateProduct = () => {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "products", label: "Products", link: "/products" },
    { name: "update", label: "Update Product", className: "text-primary font-medium" },
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
