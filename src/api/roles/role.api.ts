import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "../client";
import {
  CreateRolePayload,
  PermissionGroup,
  Role,
  RoleListParams,
  RoleListResponse,
  RoleSelectOption,
  SyncRolePermissionsPayload,
  UpdateRolePayload,
} from "./role.types";

export const getRoles = async (params: RoleListParams): Promise<RoleListResponse> => {
  const { data } = await apiClient.get(`${BASE_API_URL}/roles`, { params });
  return data.data;
};

export const getRoleById = async (id: number): Promise<Role> => {
  const { data } = await apiClient.get(`${BASE_API_URL}/roles/${id}`);
  return data.data;
};

export const createRole = async (payload: CreateRolePayload): Promise<Role> => {
  const { data } = await apiClient.post(`${BASE_API_URL}/roles`, payload);
  return data.data;
};

export const updateRole = async (id: number, payload: UpdateRolePayload): Promise<Role> => {
  const { data } = await apiClient.patch(`${BASE_API_URL}/roles/${id}`, payload);
  return data.data;
};

export const deleteRole = async (id: number): Promise<void> => {
  await apiClient.delete(`${BASE_API_URL}/roles/${id}`);
};

export const syncRolePermissions = async (
  id: number,
  payload: SyncRolePermissionsPayload,
): Promise<Role> => {
  const { data } = await apiClient.put(`${BASE_API_URL}/roles/${id}/permissions`, payload);
  return data.data;
};

export const getPermissionGroups = async (): Promise<PermissionGroup[]> => {
  const { data } = await apiClient.get(`${BASE_API_URL}/roles/permissions`);
  return data.data;
};

export const getRoleSelectOptions = async (): Promise<RoleSelectOption[]> => {
  const { data } = await apiClient.get(`${BASE_API_URL}/roles/select-options`);
  return data.data;
};
