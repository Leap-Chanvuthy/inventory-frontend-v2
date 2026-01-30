import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateCustomerForm } from "../_components/update-customer-form";

function UpdateCustomer() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "customer", label: "Customer", link: "/customer" },
    { name: "update-customer", label: "Update Customer" },
  ];

  return (
    <div>
      <div className="px-6">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="px-6">
        <UpdateCustomerForm />
      </div>
    </div>
  );
}

export default UpdateCustomer;
