import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { CreateUserForm } from "../_components/create-user-form";

const CreateUser = () => {
  const breadcrumbItems = [
    { name: "managements", label: "Managements", link: "" },
    { name: "users", label: "Users", link: "/users" },
    {
      name: "create-user",
      label: "Create New User",
      className: "text-primary font-medium",
    },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <CreateUserForm />
    </div>
  );
};

export default CreateUser;
