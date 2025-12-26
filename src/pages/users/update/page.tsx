import { BreadCrumb } from "@/components/reusable/partials/breadcrumb"
import { UpdateUserForm } from "../_components/update-user-form"
import { useSingleUser } from "@/api/users/user.query";
import { useParams } from "react-router";

const UpdateUser = () => {

  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const {data : user} = useSingleUser(userId);

  const breadcrumbItems = [
    { name: "managements", label: "Managements", link: "" },
    { name: "users", label: "Users", link: "/users" },
    { name: "update-user", label: "Update User" },
    { name: `${user?.email || ""}`, label: `${user?.email || "Update User"}` },
  ]

  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <UpdateUserForm />
    </div>
  )
}

export default UpdateUser;
