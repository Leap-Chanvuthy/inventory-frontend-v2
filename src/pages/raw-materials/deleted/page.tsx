import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { DeletedRawMaterialList } from "../_components/deleted-raw-material-list";
import { Text } from "@/components/ui/text/app-text";

export default function DeletedRawMaterials() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "raw-materials", label: "Raw Materials", link: "/raw-materials" },
    { name: "deleted", label: "Deleted Raw Materials" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Text.TitleLarge className="mx-6">Deleted Raw Materials</Text.TitleLarge>
      <DeletedRawMaterialList />
    </div>
  );
}
