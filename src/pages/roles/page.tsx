import { BreadCrumb } from "@/components/reusable/partials/breadcrumb";
import { Text } from "@/components/ui/text/app-text";
import RoleList from "./_components/role-list";

const breadcrumbItems = [
  {
    name: "application-management",
    label: "Application & Management",
    link: "/",
  },
  { name: "roles-permissions", label: "Roles & Permissions" },
];

export default function RolesPage() {
  return (
    <div>
      <div className="mx-6 mb-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <div className="mx-6">
        <Text.TitleLarge>Roles & Permissions</Text.TitleLarge>
        <p className="text-sm text-muted-foreground mt-1">
          Manage built-in and custom roles with module-based permissions.
        </p>
      </div>

      <div className=" mt-8">
        <RoleList />
      </div>
    </div>
  );
}
