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
      <div className="mx-6">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6">
        <CreateWarehouseForm />
      </div>
    </div>
  );
};

export default CreateWarehouses;
