import { BreadCrumb } from "@/components/reusable/partials/breadcrumb"
import { CreateUserForm } from "../_components/create-user-form"

const CreateUser = () => {

  const breadcrumbItems = [
    { name: "applications", label: "Applications", link: "/applications" },
    { name: "users", label: "Users", link: "/applications/users" },
    { name: "create-user", label: "Create New User" },
  ]

  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <CreateUserForm />
    </div>
  )
}

export default CreateUser
