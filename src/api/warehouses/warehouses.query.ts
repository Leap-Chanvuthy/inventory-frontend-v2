import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getWarehouses, getWarehouse } from "./warehouses.api";
import {
  GetWarehousesParams,
  PaginatedData,
  Warehouse,
} from "./warehouses.types";

export const WAREHOUSE_QUERY_KEYS = {
  list: (params: GetWarehousesParams) => ["warehouses", params] as const,
  detail: (id: number | string) => ["warehouse", id] as const,
};

export const useWarehouses = (params: GetWarehousesParams) => {
  return useQuery<PaginatedData<Warehouse>>({
    queryKey: WAREHOUSE_QUERY_KEYS.list(params),
    queryFn: () => getWarehouses(params),
    keepPreviousData: true,
  } as UseQueryOptions<PaginatedData<Warehouse>>);
};

export const useWarehouse = (id: string | number) => {
  return useQuery<Warehouse>({
    queryKey: WAREHOUSE_QUERY_KEYS.detail(id),
    queryFn: () => getWarehouse(id),
    enabled: !!id,
  } as UseQueryOptions<Warehouse>);
};
