import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { RawMaterialList } from "./_components/raw-material-list";
import { Text } from "@/components/ui/text/app-text";

export default function RawMaterials() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "raw-materials", label: "Raw Materials", link: "/raw-materials" },
    { name: "list", label: "List of Raw Materials" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Text.TitleLarge className="mx-6">Raw Materials</Text.TitleLarge>
      <RawMaterialList />
    </div>
  );
}
