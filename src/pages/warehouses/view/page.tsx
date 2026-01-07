import { useParams } from "react-router-dom";
import { ViewWarehouseForm } from "../_components/view-warehouse-form";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { useSingleWarehouse } from "@/api/warehouses/warehouses.query";

export default function ViewWarehouses() {
  const { id } = useParams<{ id: string }>();
  const warehouseId = Number(id);
  const { data: warehouse } = useSingleWarehouse(warehouseId);

  const breadcrumbItems = [
    { name: "application", label: "Application", link: "/" },
    { name: "warehouses", label: "Warehouses", link: "/warehouses" },
    { name: "view-warehouse", label: "View Warehouse" },
    {
      name: `${warehouse?.warehouse_name || ""}`,
      label: `${warehouse?.warehouse_name || "Update User"}`,
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      {id && <ViewWarehouseForm warehouseId={id} />}
    </div>
  );
}
