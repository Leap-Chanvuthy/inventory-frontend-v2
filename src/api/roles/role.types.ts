export interface RolePermission {
  id?: number;
  module: string;
  action: string;
  key: string;
  label?: string;
}

export interface PermissionGroup {
  module: string;
  key: string;
  permissions: RolePermission[];
}

export interface Role {
  id: number;
  name: string;
  key: string;
  description?: string | null;
  is_system: boolean;
  users_count?: number;
  permissions_count?: number;
  permissions?: RolePermission[];
  created_at: string;
  updated_at: string;
}

export interface RoleSelectOption {
  id: number;
  name: string;
  key: string;
  is_system: boolean;
}

export interface RoleListResponse {
  current_page: number;
  data: Role[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface RoleListParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface CreateRolePayload {
  name: string;
  key: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRolePayload {
  name?: string;
  key?: string;
  description?: string | null;
}

export interface SyncRolePermissionsPayload {
  permissions: string[];
}

export interface RoleValidationErrors {
  message: string;
  errors?: Record<string, string[]>;
}
