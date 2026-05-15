import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Save, SquareX } from "lucide-react";
import { usePermissionGroups, useRole } from "@/api/roles/role.query";
import { useSyncRolePermissions, useUpdateRole } from "@/api/roles/role.mutation";
import { RoleValidationErrors } from "@/api/roles/role.types";
import PermissionMatrix from "@/components/permissions/permission-matrix";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text/app-text";
import { TextAreaInput, TextInput } from "@/components/reusable/partials/input";

const ROLE_KEY_REGEX = /^[A-Z][A-Z0-9_]*$/;

type EditRoleFormProps = {
  roleId: number;
};

export default function EditRoleForm({ roleId }: EditRoleFormProps) {
  const navigate = useNavigate();
  const { data: role, isLoading: isRoleLoading, isFetching: isRoleFetching, isError: isRoleError } = useRole(roleId);
  const { data: permissionGroups = [], isLoading: isPermissionsLoading } = usePermissionGroups();
  const updateRoleMutation = useUpdateRole(roleId);
  const syncPermissionMutation = useSyncRolePermissions(roleId);

  const updateError = updateRoleMutation.error as AxiosError<RoleValidationErrors> | null;
  const syncError = syncPermissionMutation.error as AxiosError<RoleValidationErrors> | null;
  const fieldErrors = updateError?.response?.data?.errors || syncError?.response?.data?.errors;

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [keyError, setKeyError] = useState<string | null>(null);

  useEffect(() => {
    if (!role) return;
    setName(role.name || "");
    setKey(role.key || "");
    setDescription(role.description || "");
    setSelectedPermissions((role.permissions || []).map(permission => permission.key));
  }, [role]);

  const isSystemRole = !!role?.is_system;
  const isSubmitting = updateRoleMutation.isPending || syncPermissionMutation.isPending;
  const isLoading = isRoleLoading || isPermissionsLoading;

  const hasChanges = useMemo(() => {
    if (!role) return false;
    const originalPermissions = (role.permissions || []).map(permission => permission.key).sort();
    const currentPermissions = [...selectedPermissions].sort();

    return (
      name !== role.name ||
      key !== role.key ||
      (description || "") !== (role.description || "") ||
      JSON.stringify(originalPermissions) !== JSON.stringify(currentPermissions)
    );
  }, [description, key, name, role, selectedPermissions]);

  const validate = () => {
    if (!name.trim()) return "Role name is required.";
    if (!key.trim()) return "Role key is required.";
    if (!ROLE_KEY_REGEX.test(key.trim())) {
      return "Role key must be uppercase snake case, e.g. INVENTORY_ASSISTANT.";
    }
    return null;
  };

  const onSave = async () => {
    if (!role || isSystemRole) return;

    const validationError = validate();
    if (validationError) {
      setKeyError(validationError.includes("key") ? validationError : null);
      return;
    }
    setKeyError(null);

    const detailsChanged =
      name !== role.name ||
      key !== role.key ||
      (description || "") !== (role.description || "");

    const originalPermissions = (role.permissions || []).map(permission => permission.key).sort();
    const currentPermissions = [...selectedPermissions].sort();
    const permissionsChanged = JSON.stringify(originalPermissions) !== JSON.stringify(currentPermissions);

    if (detailsChanged) {
      await updateRoleMutation.mutateAsync({
        name: name.trim(),
        key: key.trim().toUpperCase(),
        description: description || null,
      });
    }

    if (permissionsChanged) {
      await syncPermissionMutation.mutateAsync({
        permissions: selectedPermissions,
      });
    }
  };

  if (isLoading) {
    return <DataCardLoading text="Loading role details..." />;
  }

  if (isRoleError && !isRoleFetching) {
    return <UnexpectedError kind="fetch" homeTo="/roles" />;
  }

  if (!role) {
    return <DataCardEmpty emptyText="Role not found." />;
  }

  return (
    <div className="space-y-6 mx-6 my-5">
      {isSystemRole && (
        <Alert variant="info">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>System Role</AlertTitle>
          <AlertDescription>
            System roles are managed by the system and cannot be edited.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-4">
          <Text.TitleSmall>Role Information</Text.TitleSmall>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextInput
              id="name"
              label="Role Name"
              value={name}
              onChange={e => setName(e.target.value)}
              error={fieldErrors?.name?.[0]}
              required={true}
              disabled={isSystemRole}
            />
            <TextInput
              id="key"
              label="Role Key"
              value={key}
              onChange={e => setKey(e.target.value.toUpperCase())}
              error={keyError || fieldErrors?.key?.[0]}
              required={true}
              disabled={isSystemRole}
            />
          </div>
          <TextAreaInput
            id="description"
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            error={fieldErrors?.description?.[0]}
            required={false}
            disabled={isSystemRole}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <Text.TitleSmall>Permissions</Text.TitleSmall>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <PermissionMatrix
            availablePermissions={permissionGroups}
            selectedPermissions={selectedPermissions}
            onChange={setSelectedPermissions}
            readonly={isSystemRole}
            searchable={true}
            collapsible={true}
          />
        </CardContent>
      </Card>

      <div className="py-5 border-t border-gray-100 dark:border-gray-700 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
        <Button
          type="button"
          variant="outline_failure"
          className="w-full sm:w-auto text-red-500"
          onClick={() => navigate("/roles")}
          disabled={isSubmitting}
        >
          <SquareX />
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-[#5c52d6] hover:bg-[#4b43b3] text-white w-full sm:w-auto"
          onClick={onSave}
          disabled={isSubmitting || isSystemRole || !hasChanges}
        >
          <Save />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
