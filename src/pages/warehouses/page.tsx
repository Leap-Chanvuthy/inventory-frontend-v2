import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import WarehousesList from "./_components/warehouses-list";
import WarehousesOpenMap from "./_components/warehouses-open-map";
import { useState } from "react";
import { Warehouse } from "@/api/warehouses/warehouses.types";

export default function Warehouses() {
  const breadcrumbItems = [
    { name: "catalogs", label: "Catalogs", link: "/" },
    { name: "warehouses", label: "Warehouses", link: "/warehouses" },
    { name: "list", label: "List of Warehouses" },
  ];

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <h1 className="text-3xl font-bold mx-6">Warehouse Inventory</h1>
      <WarehousesList onWarehousesChange={setWarehouses} />
      <WarehousesOpenMap warehouses={warehouses} />
    </div>
  );
}
