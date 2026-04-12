import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "../client";
import { GetAllAuditResponse, GetAuditByIdResponse } from "./audit-log.types";

export const getAllAudits = async (params?: { per_page?: number; page?: number }) => {
  const { data } = await apiClient.get<GetAllAuditResponse>(`${BASE_API_URL}/audit-logs`, { params });
  return data;
};

export const getAuditById = async (id: number) => {
  const { data } = await apiClient.get<GetAuditByIdResponse>(`${BASE_API_URL}/audit-logs/${id}`);
  return data;
};