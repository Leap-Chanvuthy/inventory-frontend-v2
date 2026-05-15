import { Role } from "@/api/roles/role.types";
import { useDeleteRole } from "@/api/roles/role.mutation";
import { DataTableColumn } from "@/components/reusable/data-table/data-table.type";
import TableActions from "@/components/reusable/partials/table-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
import { formatDate } from "@/utils/date-format";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const ROLE_SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "key", label: "Key" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
];

const roleTypeBadge = (isSystem: boolean) => {
  if (isSystem) {
    return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">System</Badge>;
  }
  return <Badge variant="outline">Custom</Badge>;
};

function RoleActions({ role }: { role: Role }) {
  const { can } = useAuth();
  const deleteMutation = useDeleteRole();

  const canEdit = can("roles.update") || can("roles.assign_permissions");
  const canDelete = can("roles.delete");
  const deleteAllowed = canDelete && !role.is_system && Number(role.users_count || 0) === 0;

  return (
    <div className="flex items-center gap-2">
      <TableActions
        viewDetailPath={`/roles/view/${role.id}`}
        editPath={canEdit ? `/roles/edit/${role.id}` : undefined}
        deleteHeading="Delete Role"
        deleteSubheading={`Are you sure you want to delete "${role.name}"?`}
        deleteTooltip="Delete role"
        onDelete={() => deleteMutation.mutate(role.id)}
        showEdit={canEdit && !role.is_system}
        showDelete={deleteAllowed}
      />
      {!deleteAllowed && canDelete && (
        <span className="text-xs text-muted-foreground">
          {role.is_system ? "System role" : "Assigned users"}
        </span>
      )}
    </div>
  );
}

export const ROLE_COLUMNS: DataTableColumn<Role>[] = [
  {
    key: "name",
    header: "Role Name",
    className: "whitespace-nowrap py-6",
    render: role => (
      <Link to={`/roles/view/${role.id}`} className="font-medium hover:text-primary hover:underline">
        {role.name}
      </Link>
    ),
  },
  {
    key: "key",
    header: "Key",
    className: "whitespace-nowrap py-6",
    render: role => <span className="font-mono text-sm">{role.key}</span>,
  },
  {
    key: "type",
    header: "Type",
    className: "whitespace-nowrap py-6",
    render: role => roleTypeBadge(role.is_system),
  },
  {
    key: "users_count",
    header: "Users",
    className: "whitespace-nowrap py-6",
    render: role => <Badge variant="outline">{role.users_count ?? 0}</Badge>,
  },
  {
    key: "created_at",
    header: "Created At",
    className: "whitespace-nowrap py-6",
    render: role => formatDate(role.created_at),
  },
  {
    key: "actions",
    header: "Actions",
    className: "whitespace-nowrap py-6",
    render: role => <RoleActions role={role} />,
  },
];

export function RoleCard({ role }: { role: Role }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <Link to={`/roles/view/${role.id}`} className="font-medium hover:underline">
                {role.name}
              </Link>
              <Text.Small color="muted" className="font-mono">
                {role.key}
              </Text.Small>
            </div>
          </div>
          {roleTypeBadge(role.is_system)}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Text.Small color="muted">
          {role.description || "No description"}
        </Text.Small>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Users: {role.users_count ?? 0}</Badge>
          <Badge variant="outline">Permissions: {role.permissions_count ?? 0}</Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <RoleActions role={role} />
      </CardFooter>
    </Card>
  );
}
