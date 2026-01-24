import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import UOMList from "./_components/uom-list";

const breadcrumbItems = [
  { name: "catalog", label: "Catalog", link: "/categories" },
  { name: "uom", label: "UOM", link: "/unit-of-measurement" },
  { name: "list", label: "List of Unit of Measurement" },
];

export default function UOM() {
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl font-bold mx-6">Unit of Measurement</h1>

      <div className="mx-6 mt-8">
        <UOMList />
      </div>
    </div>
  );
}
