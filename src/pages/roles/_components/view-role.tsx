import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text/app-text";
import { Button } from "@/components/ui/button";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";
import { useRole } from "@/api/roles/role.query";
import { useAuth } from "@/hooks/useAuth";

type ViewRoleProps = {
  roleId: number;
};

export default function ViewRole({ roleId }: ViewRoleProps) {
  const { canAny } = useAuth();
  const { data: role, isLoading, isError, isFetching } = useRole(roleId);

  const canEdit = canAny(["roles.update", "roles.assign_permissions"]);

  const groupedPermissions = useMemo(() => {
    if (!role?.permissions || role.permissions.length === 0) return [];

    const grouped = role.permissions.reduce<Record<string, string[]>>((acc, permission) => {
      const moduleKey = permission.module || "other";
      acc[moduleKey] ??= [];
      acc[moduleKey].push(permission.key);
      return acc;
    }, {});

    return Object.entries(grouped).map(([module, keys]) => ({
      module,
      keys: keys.sort(),
    }));
  }, [role?.permissions]);

  if (isLoading) {
    return <DataCardLoading text="Loading role..." />;
  }

  if (isError && !isFetching) {
    return <UnexpectedError kind="fetch" homeTo="/roles" />;
  }

  if (!role) {
    return <DataCardEmpty emptyText="Role not found." />;
  }

  return (
    <div className="space-y-6 mx-6 my-5">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Text.TitleSmall>{role.name}</Text.TitleSmall>
              <p className="text-xs text-muted-foreground mt-1 font-mono">{role.key}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={role.is_system ? "default" : "outline"}>
                {role.is_system ? "System Role" : "Custom Role"}
              </Badge>
              {canEdit && !role.is_system && (
                <Link to={`/roles/edit/${role.id}`}>
                  <Button size="sm">Edit Role</Button>
                </Link>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="text-sm font-medium">{role.is_system ? "System" : "Custom"}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Users Count</p>
              <p className="text-sm font-medium">{role.users_count ?? 0}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Permissions Count</p>
              <p className="text-sm font-medium">{role.permissions?.length ?? 0}</p>
            </div>
          </div>

          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-sm mt-1">{role.description || "No description"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <Text.TitleSmall>Permissions</Text.TitleSmall>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
          {groupedPermissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No permissions assigned.</p>
          ) : (
            groupedPermissions.map(group => (
              <div key={group.module} className="rounded-md border p-3">
                <p className="font-medium mb-2">{group.module.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
                <div className="flex flex-wrap gap-2">
                  {group.keys.map(key => (
                    <Badge key={key} variant="outline" className="font-mono text-xs">
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
