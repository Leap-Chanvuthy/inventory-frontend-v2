import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateProductForm } from "../_components/create-product-form";

const CreateProduct = () => {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "products", label: "Products", link: "/products" },
    { name: "create", label: "Create a New Product" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <CreateProductForm />
    </div>
  );
};

export default CreateProduct;
