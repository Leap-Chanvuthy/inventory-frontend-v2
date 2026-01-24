import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateUOMForm } from "../_components/create-uom-form";

const CreateUOM = () => {
  const breadcrumbItems = [
    { name: "catalog", label: "Catalog", link: "/categories" },
    { name: "uom", label: "UOM", link: "/unit-of-measurement" },
    { name: "create-uom", label: "Create a new Unit of Measurement" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <CreateUOMForm />
    </div>
  );
};

export default CreateUOM;
