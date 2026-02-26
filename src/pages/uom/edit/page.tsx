import { useParams } from "react-router-dom";
import { useSingleUOM } from "@/api/uom/uom.query";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateUOMForm } from "../_components/update-uom-form";
import { Text } from "@/components/ui/text/app-text";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";

const EditUOM = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useSingleUOM(Number(id));

  if (isLoading) {
    return <DataCardLoading text="Loading UOM details..." />;
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
        <Text.TitleLarge>Edit Unit of Measurement</Text.TitleLarge>
        <Text.Medium className="mt-2">
          Update the information for this unit of measurement
        </Text.Medium>
      </div>

      <UpdateUOMForm uom={uom} />
    </div>
  );
};

export default EditUOM;
