import { useQuery } from "@tanstack/react-query";
import { getUOMs, getUOMById } from "./uom.api";
import { UOMQueryParams } from "./uom.types";

export const useUOMs = (params?: UOMQueryParams) => {
  return useQuery({
    queryKey: ["uoms", params],
    queryFn: () => getUOMs(params),
  });
};

export const useSingleUOM = (id: number) => {
  return useQuery({
    queryKey: ["uom", id],
    queryFn: () => getUOMById(id),
    enabled: !!id,
  });
};
