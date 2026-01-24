import { useParams } from "react-router-dom";
import { useSingleUOM } from "@/api/uom/uom.query";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateUOMForm } from "../_components/update-uom-form";

const EditUOM = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useSingleUOM(Number(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading UOM details...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load UOM details</p>
      </div>
    );
  }

  const uom = data?.data || data;

  if (!uom || !uom.id) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Invalid UOM data</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "catalog", label: "Catalog", link: "/categories" },
    { name: "uom", label: "UOM", link: "/unit-of-measurement" },
    { name: "edit", label: `Edit ${uom.name}` },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <div className="mx-6 mb-6">
        <h1 className="text-3xl font-bold">Edit Unit of Measurement</h1>
        <p className="text-muted-foreground mt-2">
          Update the information for this unit of measurement
        </p>
      </div>

      <UpdateUOMForm uom={uom} />
    </div>
  );
};

export default EditUOM;
