import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getUserById, getUsers } from "./user.api";
import { GetUsersParams, GetUsersResponse, User } from "./user.types";

export const USER_QUERY_KEYS = {
  list: (params: GetUsersParams) => ["users", params] as const,
  detail: (id: number | string) => ["user", id] as const,
};

export const useUsers = (params: GetUsersParams) => {
  return useQuery<GetUsersResponse>({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => getUsers(params),
    keepPreviousData: true,
  } as UseQueryOptions<GetUsersResponse>);
};


export const useSingleUser = (id: number | string) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  } as UseQueryOptions<User>
);
}
