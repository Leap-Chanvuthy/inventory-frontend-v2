import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateWarehouseForm } from "../_components/create-warehouse-form";

const CreateWarehouses = () => {
  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    { name: "warehouses", label: "Warehouses", link: "/warehouses" },
    { name: "create-warehouse", label: "Create a new Warehouse" },
  ];

  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <CreateWarehouseForm />
    </div>
  );
};

export default CreateWarehouses;
