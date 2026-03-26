import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateWarehouseForm } from "../_components/create-warehouse-form";

const CreateWarehouses = () => {
  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    { name: "warehouses", label: "Warehouses", link: "/warehouses" },
    {
      name: "create-warehouse",
      label: "Create a new Warehouse",
      className: "text-primary font-medium",
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <CreateWarehouseForm />
    </div>
  );
};

export default CreateWarehouses;
