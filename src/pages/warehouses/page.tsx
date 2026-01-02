import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import WarehousesList from "./_components/warehouses-list";
import WarehousesOpenMap from "./_components/warehouses-open-map";
import { useState } from "react";

export default function Warehouses() {
  const breadcrumbItems = [
    { name: "catalog", label: "Catalog", link: "" },
    { name: "warehouses", label: "Warehouses", link: "/warehouses" },
    { name: "list", label: "List of Warehouses" },
  ];

  const [totalWarehouses, setTotalWarehouses] = useState<number>(0);

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <WarehousesList onTotalChange={setTotalWarehouses} />

      {totalWarehouses !== 0 && <WarehousesOpenMap totalWarehouses={totalWarehouses} />}
    </div>
  );
}
