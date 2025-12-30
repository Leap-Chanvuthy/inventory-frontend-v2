import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "../client";
import { ForgotPasswordPayload, ForgotPasswordResponse, LoginPayload, LoginResponse, ResetPasswordPayload, ResetPasswordResponse, VerifyEmailPayload, VerifyEmailSuccessResponse } from "./auth.type";



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


export const forgotPassword = async (payload : ForgotPasswordPayload) =>{ 
  const { data } = await apiClient.post<ForgotPasswordResponse>(`${BASE_API_URL}/send-reset-link`, payload);
  return data;
}


export const resetPassword = async (payload : ResetPasswordPayload) =>{
  const { data } = await apiClient.post<ResetPasswordResponse>(`${BASE_API_URL}/reset-password`, payload);
  return data;
}