import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import CreateRoleForm from "../_components/create-role-form";

const breadcrumbItems = [
  { name: "roles", label: "Roles & Permissions", link: "/roles" },
  { name: "create-role", label: "Create Role" },
];

export default function CreateRolePage() {
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6 mb-6">
        <Text.TitleLarge>Create Role</Text.TitleLarge>
        <Text.Medium className="mt-1">
          Configure a custom role and assign permissions by module.
        </Text.Medium>
      </div>
      <CreateRoleForm />
    </div>
  );
}
