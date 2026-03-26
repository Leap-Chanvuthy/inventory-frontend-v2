import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { UpdateCustomerForm } from "../_components/update-customer-form";
import { useSingleCustomer } from "@/api/customers/customer.query";
import { useParams } from "react-router-dom";

function UpdateCustomer() {
  const { id } = useParams<{ id: string }>();
  const { data } = useSingleCustomer(Number(id));
  const customerName = data?.data?.fullname;

  const breadcrumbItems = [
    { name: "inventory", label: "Inventory", link: "/" },
    { name: "customer", label: "Customer", link: "/customer" },
    { name: "update-customer", label: "Update Customer" },
    {
      name: customerName || "",
      label: customerName || "",
      className: "text-primary font-medium",
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <UpdateCustomerForm />
    </div>
  );
}

export default UpdateCustomer;
