import { useParams } from "react-router-dom";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateWarehouseForm } from "../_components/update-warehouse-form";
import { useSingleWarehouse } from "@/api/warehouses/warehouses.query";

const UpdateWarehouse = () => {
  const { id } = useParams<{ id: string }>();
  const warehouseId = String(id);
  const { data: warehouse } = useSingleWarehouse(warehouseId);
  const breadcrumbItems = [
    { name: "catalog", label: "Catalog", link: "" },
    { name: "warehouses", label: "Warehouses", link: "/warehouses" },
    { name: "update-warehouse", label: "Update Warehouse" },
    {
      name: `${warehouse?.warehouse_name || ""}`,
      label: `${warehouse?.warehouse_name || ""}`,
    },
  ];

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Warehouse ID is missing</p>
      </div>
    );
  }

  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <UpdateWarehouseForm />
    </div>
  );
};

export default UpdateWarehouse;
