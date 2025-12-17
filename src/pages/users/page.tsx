import { BreadCrumb } from "@/components/reusable/partials/breadcrumb"
import UsersList from "./_components/user-list"

const Users = () => {

  const breadcrumbItems = [
    { name: "applications", label: "Applications", link: "/applications" },
    { name: "users", label: "Users", link: "/users" },
    { name: "list", label: "List of users" },
  ]
  return (
    <div>
      <div className="mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <UsersList />
    </div>
  )
}

export default Users
