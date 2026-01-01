import { BreadCrumb } from "@/components/reusable/partials/breadcrumb"
import UsersList from "./_components/user-list"
import UserStat from "./_components/user-state"

const Users = () => {

  const breadcrumbItems = [
    { name: "applications", label: "Applications", link: "/applications" },
    { name: "users", label: "Users", link: "/users" },
    { name: "list", label: "List of users" },
  ]
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <UserStat />
      <UsersList />
    </div>
  )
}

export default Users
