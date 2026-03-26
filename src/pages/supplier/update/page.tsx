import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateSupplierForm } from "../_components/update-supplier-form";
import { useSingleSupplier } from "@/api/suppliers/supplier.query";
import { useParams } from "react-router";

function UpdateSupplier() {
  const { id } = useParams<{ id: string }>();
  const { data } = useSingleSupplier(Number(id));
  const supplierName = data?.data?.supplier?.official_name;

  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "supplier", label: "Supplier", link: "/supplier" },
    { name: "update-supplier", label: "Update Supplier" },
    {
      name: supplierName || "",
      label: supplierName || "",
      className: "text-primary font-medium",
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <UpdateSupplierForm />
    </div>
  );
}

export default UpdateSupplier;
