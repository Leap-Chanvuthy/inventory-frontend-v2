import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useCreateRole } from "@/api/roles/role.mutation";
import { usePermissionGroups } from "@/api/roles/role.query";
import { RoleValidationErrors } from "@/api/roles/role.types";
import PermissionMatrix from "@/components/permissions/permission-matrix";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text/app-text";
import FormFooterActions from "@/components/reusable/partials/form-footer-action";
import { TextAreaInput, TextInput } from "@/components/reusable/partials/input";

const toRoleKey = (name: string) =>
  name
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();

const ROLE_KEY_REGEX = /^[A-Z][A-Z0-9_]*$/;

export default function CreateRoleForm() {
  const navigate = useNavigate();
  const createMutation = useCreateRole();
  const { data: permissionGroups = [], isLoading: isPermissionsLoading } = usePermissionGroups();
  const error = createMutation.error as AxiosError<RoleValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;

  const [form, setForm] = useState({
    name: "",
    key: "",
    description: "",
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isKeyTouched, setIsKeyTouched] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);

  const isSubmitDisabled = useMemo(
    () => createMutation.isPending || isPermissionsLoading,
    [createMutation.isPending, isPermissionsLoading],
  );

  const onNameChange = (value: string) => {
    setForm(prev => ({
      ...prev,
      name: value,
      key: isKeyTouched ? prev.key : toRoleKey(value),
    }));
  };

  const validateKey = (value: string) => {
    if (!value) {
      setKeyError("Role key is required.");
      return false;
    }
    if (!ROLE_KEY_REGEX.test(value)) {
      setKeyError("Role key must be uppercase snake case, e.g. SALE_MANAGER.");
      return false;
    }
    setKeyError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateKey(form.key)) {
      return;
    }

    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const action = submitter?.value;

    createMutation.mutate(
      {
        name: form.name,
        key: form.key,
        description: form.description || undefined,
        permissions: selectedPermissions,
      },
      {
        onSuccess: role => {
          if (action === "save") {
            setForm({ name: "", key: "", description: "" });
            setSelectedPermissions([]);
            setIsKeyTouched(false);
            return;
          }
          navigate(`/roles/edit/${role.id}`);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mx-6 my-5">
      <Card>
        <CardHeader className="pb-4">
          <Text.TitleSmall>Role Information</Text.TitleSmall>
          <p className="text-xs text-muted-foreground">
            Create a custom role and assign permissions for each module.
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextInput
              id="name"
              label="Role Name"
              placeholder="Sale Manager"
              value={form.name}
              onChange={e => onNameChange(e.target.value)}
              error={fieldErrors?.name?.[0]}
              required={true}
            />
            <TextInput
              id="key"
              label="Role Key"
              placeholder="SALE_MANAGER"
              value={form.key}
              onChange={e => {
                setIsKeyTouched(true);
                setForm(prev => ({ ...prev, key: e.target.value.toUpperCase() }));
              }}
              error={keyError || fieldErrors?.key?.[0]}
              required={true}
            />
          </div>
          <TextAreaInput
            id="description"
            label="Description"
            placeholder="Can manage sales operations and customer orders."
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            error={fieldErrors?.description?.[0]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <Text.TitleSmall>Permissions</Text.TitleSmall>
          <p className="text-xs text-muted-foreground">
            Select the permissions this role should have.
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <PermissionMatrix
            availablePermissions={permissionGroups}
            selectedPermissions={selectedPermissions}
            onChange={setSelectedPermissions}
            readonly={false}
            searchable={true}
            collapsible={true}
          />
        </CardContent>
      </Card>

      <FormFooterActions isSubmitting={isSubmitDisabled} />
    </form>
  );
}
