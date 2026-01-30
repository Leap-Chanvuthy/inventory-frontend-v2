import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateCustomerForm } from "../_components/create-customer-form";

function CreateCustomer() {
  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "customers", label: "Customers", link: "/customer" },
    { name: "create-customer", label: "Create a new Customer" },
  ];

  return (
    <div>
      <div className="px-6">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="px-6 my-5">
        <CreateCustomerForm />
      </div>
    </div>
  );
}

export default CreateCustomer;
