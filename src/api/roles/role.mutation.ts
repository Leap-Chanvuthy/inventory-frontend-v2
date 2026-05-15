import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ROLE_QUERY_KEYS } from "./role.query";
import { createRole, deleteRole, syncRolePermissions, updateRole } from "./role.api";
import { CreateRolePayload, SyncRolePermissionsPayload, UpdateRolePayload } from "./role.types";
import { AUTH_QUERY_KEYS } from "../auth/auth.query";

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.selectOptions() });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.currentUser() });
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      const hasFieldErrors =
        error?.response?.data?.errors &&
        Object.keys(error.response.data.errors).length > 0;
      if (!hasFieldErrors) {
        toast.error(error?.response?.data?.message || "Failed to create role");
      }
    },
  });
};

export const useUpdateRole = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRolePayload) => updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.selectOptions() });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.currentUser() });
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update role";
      toast.error(message);
    },
  });
};

export const useSyncRolePermissions = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SyncRolePermissionsPayload) => syncRolePermissions(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.currentUser() });
      toast.success("Role permissions updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update role permissions";
      toast.error(message);
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.selectOptions() });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.currentUser() });
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete role";
      toast.error(message);
    },
  });
};
