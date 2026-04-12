import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getAllAudits , getAuditById } from "./audit-log.api";
import {
    GetAllAuditResponse,
    GetAuditByIdResponse,
    QueryAuditsParams,
} from "./audit-log.types";


export const useAuditLogs = (param: QueryAuditsParams) => {
    return useQuery({
        queryKey: ["audit-logs", param],
        queryFn: () => getAllAudits(param),
    } as UseQueryOptions<GetAllAuditResponse>);
}

export const useAllAudits = useAuditLogs;

export const useAuditById = (id: number) => {
    return useQuery({
        queryKey: ["audit-log", id],
        queryFn: () => getAuditById(id),
        enabled: !!id,
    } as UseQueryOptions<GetAuditByIdResponse>);
}