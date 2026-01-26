import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import UOMList from "./_components/uom-list";
import { Text } from "@/components/ui/text/app-text";

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

      <div className="mx-6">
        <Text.TitleLarge>Unit of Measurement</Text.TitleLarge>
      </div>

      <div className="mx-6 mt-8">
        <UOMList />
      </div>
    </div>
  );
}
