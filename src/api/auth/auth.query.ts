import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getCurrentUser } from "./auth.api";
import { CurrentUserResponse } from "./auth.type";

export const AUTH_QUERY_KEYS = {
  currentUser: () => ["auth", "me"] as const,
};

export const useCurrentUser = (enabled: boolean) =>
  useQuery<CurrentUserResponse>({
    queryKey: AUTH_QUERY_KEYS.currentUser(),
    queryFn: () => getCurrentUser(),
    enabled,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 60_000,
  } as UseQueryOptions<CurrentUserResponse>);

