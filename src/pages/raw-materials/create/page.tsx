import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateRawMaterialForm } from "../_components/create-raw-material-form";

const CreateRawMaterial = () => {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/raw-materials" },
    { name: "raw-materials", label: "Raw Materials", link: "/raw-materials" },
    { name: "create", label: "Create a new Raw Material" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <CreateRawMaterialForm />
    </div>
  );
};

export default CreateRawMaterial;
