import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "../client";
import { LoginPayload, LoginResponse, VerifyEmailPayload, VerifyEmailSuccessResponse } from "./auth.type";



export const loginUser = async (payload: LoginPayload) => {
  const { data } = await apiClient.post<LoginResponse>(`${BASE_API_URL}/login`, payload);
  return data;
};

export const logoutUser = async () => {
  await apiClient.post(`${BASE_API_URL}/logout`);
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const { data } = await apiClient.post<VerifyEmailSuccessResponse>(
    `${BASE_API_URL}/users/verify-email`,
    payload
  );

  return data;
};