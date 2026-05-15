import { useParams } from "react-router-dom";
import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import ViewRole from "../_components/view-role";

export default function ViewRolePage() {
  const { id } = useParams<{ id: string }>();
  const roleId = Number(id);

  const breadcrumbItems = [
    { name: "roles", label: "Roles & Permissions", link: "/roles" },
    { name: "view-role", label: `View Role #${roleId || ""}` },
  ];

  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <div className="mx-6 mb-6">
        <Text.TitleLarge>Role Details</Text.TitleLarge>
      </div>
      <ViewRole roleId={roleId} />
    </div>
  );
}
