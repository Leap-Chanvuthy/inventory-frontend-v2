import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import WarehousesList from "./_components/warehouses-list";

export default function Warehouses() {
  const breadcrumbItems = [
    { name: "catalog", label: "Catalog", link: "" },
    { name: "warehouses", label: "Warehouses", link: "/warehouses" },
    { name: "list", label: "List of Warehouses" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <WarehousesList />
    </div>
  )
}
