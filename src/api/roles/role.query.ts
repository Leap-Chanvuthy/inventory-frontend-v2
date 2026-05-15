import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  getPermissionGroups,
  getRoleById,
  getRoleSelectOptions,
  getRoles,
} from "./role.api";
import { PermissionGroup, Role, RoleListParams, RoleListResponse, RoleSelectOption } from "./role.types";

export const ROLE_QUERY_KEYS = {
  list: (params: RoleListParams) => ["roles", params] as const,
  detail: (id: number) => ["roles", id] as const,
  permissions: () => ["roles", "permissions"] as const,
  selectOptions: () => ["roles", "select-options"] as const,
};

export const useRoles = (params: RoleListParams) =>
  useQuery<RoleListResponse>({
    queryKey: ROLE_QUERY_KEYS.list(params),
    queryFn: () => getRoles(params),
    keepPreviousData: true,
  } as UseQueryOptions<RoleListResponse>);

export const useRole = (id: number) =>
  useQuery<Role>({
    queryKey: ROLE_QUERY_KEYS.detail(id),
    queryFn: () => getRoleById(id),
    enabled: Number.isFinite(id) && id > 0,
  } as UseQueryOptions<Role>);

export const usePermissionGroups = () =>
  useQuery<PermissionGroup[]>({
    queryKey: ROLE_QUERY_KEYS.permissions(),
    queryFn: () => getPermissionGroups(),
  } as UseQueryOptions<PermissionGroup[]>);

export const useRoleSelectOptions = () =>
  useQuery<RoleSelectOption[]>({
    queryKey: ROLE_QUERY_KEYS.selectOptions(),
    queryFn: () => getRoleSelectOptions(),
  } as UseQueryOptions<RoleSelectOption[]>);
