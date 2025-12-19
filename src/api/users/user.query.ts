import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getUsers } from "./user.api";
import { GetUsersParams, GetUsersResponse } from "./user.types";

export const USER_QUERY_KEYS = {
  list: (params: GetUsersParams) => ["users", params] as const,
};

export const useUsers = (params: GetUsersParams) => {
  return useQuery<GetUsersResponse>({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => getUsers(params),
    keepPreviousData: true,
  } as UseQueryOptions<GetUsersResponse>);
};
