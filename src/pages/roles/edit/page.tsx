import { useParams } from "react-router-dom";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import EditRoleForm from "../_components/edit-role-form";

export default function EditRolePage() {
  const { id } = useParams<{ id: string }>();
  const roleId = Number(id);

  const breadcrumbItems = [
    { name: "roles", label: "Roles & Permissions", link: "/roles" },
    { name: "edit-role", label: `Edit Role #${roleId || ""}` },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6 mb-6">
        <Text.TitleLarge>Edit Role</Text.TitleLarge>
        <Text.Medium className="mt-1">
          Update role details and permission assignments.
        </Text.Medium>
      </div>
      <EditRoleForm roleId={roleId} />
    </div>
  );
}
