import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { ViewCustomerForm } from "../_components/view-customer-form";

export function CustomerDetail() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "customer", label: "Customer", link: "/customer" },
    { name: "detail", label: "Customer Detail" },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <div className="mx-6 mb-5">
        <ViewCustomerForm />
      </div>
    </div>
  );
}
