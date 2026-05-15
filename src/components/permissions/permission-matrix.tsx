import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PermissionGroup } from "@/api/roles/role.types";

type PermissionMatrixProps = {
  availablePermissions: PermissionGroup[];
  selectedPermissions: string[];
  onChange: (nextPermissions: string[]) => void;
  readonly?: boolean;
  searchable?: boolean;
  collapsible?: boolean;
};

export default function PermissionMatrix({
  availablePermissions,
  selectedPermissions,
  onChange,
  readonly = false,
  searchable = true,
  collapsible = true,
}: PermissionMatrixProps) {
  const [search, setSearch] = useState("");

  const normalizedSelected = useMemo(() => new Set(selectedPermissions), [selectedPermissions]);
  const keyword = search.trim().toLowerCase();

  const filteredGroups = useMemo(() => {
    if (!keyword) return availablePermissions;

    return availablePermissions
      .map(group => {
        const moduleMatches =
          group.module.toLowerCase().includes(keyword) || group.key.toLowerCase().includes(keyword);
        const permissions = moduleMatches
          ? group.permissions
          : group.permissions.filter(permission =>
              permission.key.toLowerCase().includes(keyword) ||
              (permission.label || "").toLowerCase().includes(keyword) ||
              permission.action.toLowerCase().includes(keyword),
            );

        return { ...group, permissions };
      })
      .filter(group => group.permissions.length > 0);
  }, [availablePermissions, keyword]);

  const updateGroup = (group: PermissionGroup, checked: boolean) => {
    const current = new Set(selectedPermissions);
    if (checked) {
      group.permissions.forEach(permission => current.add(permission.key));
    } else {
      group.permissions.forEach(permission => current.delete(permission.key));
    }
    onChange(Array.from(current.values()));
  };

  const updatePermission = (key: string, checked: boolean) => {
    const current = new Set(selectedPermissions);
    if (checked) {
      current.add(key);
    } else {
      current.delete(key);
    }
    onChange(Array.from(current.values()));
  };

  const renderGroupBody = (group: PermissionGroup) => {
    const total = group.permissions.length;
    const selectedCount = group.permissions.reduce(
      (count, permission) => (normalizedSelected.has(permission.key) ? count + 1 : count),
      0,
    );
    const allChecked = total > 0 && selectedCount === total;

    return (
      <div className="space-y-3 py-1">
        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <Checkbox
              checked={allChecked}
              disabled={readonly}
              onCheckedChange={value => updateGroup(group, value === true)}
            />
            Select All
          </label>

          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {selectedCount}/{total} selected
            </Badge>
            {!readonly && (
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => updateGroup(group, false)}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {group.permissions.map(permission => (
            <label
              key={permission.key}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            >
              <Checkbox
                checked={normalizedSelected.has(permission.key)}
                disabled={readonly}
                onCheckedChange={value => updatePermission(permission.key, value === true)}
              />
              <span className="truncate">
                {permission.label || permission.action}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {searchable && (
        <Input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search module or permission..."
          className="max-w-sm"
        />
      )}

      {filteredGroups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No permissions found.</p>
      ) : collapsible ? (
        <Accordion type="multiple" className="w-full">
          {filteredGroups.map(group => (
            <AccordionItem key={group.key} value={group.key}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between pr-4">
                  <span className="font-medium">{group.module}</span>
                  <Badge variant="secondary">{group.permissions.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>{renderGroupBody(group)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map(group => (
            <div key={group.key} className="rounded-lg border p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="font-medium">{group.module}</span>
                <Badge variant="secondary">{group.permissions.length}</Badge>
              </div>
              {renderGroupBody(group)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
