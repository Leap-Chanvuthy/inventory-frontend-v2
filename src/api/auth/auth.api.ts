import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "../client";
import { ForgotPasswordPayload, ForgotPasswordResponse, LoginApiResponse, LoginPayload, LoginResponse, ResetPasswordPayload, ResetPasswordResponse, TwoFactorConfirmPayload, TwoFactorConfirmResponse, TwoFactorLoginPayload, TwoFactorSetupResponse, VerifyEmailPayload, VerifyEmailSuccessResponse } from "./auth.type";



export const loginUser = async (payload: LoginPayload) => {
  const { data } = await apiClient.post<LoginApiResponse>(`${BASE_API_URL}/login`, payload);
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


export const setupTwoFactor = async () => {
  const { data } = await apiClient.post<TwoFactorSetupResponse>(`${BASE_API_URL}/two-factor/setup`);
  return data;
}


export const confirmTwoFactor = async (payload: TwoFactorConfirmPayload) => {
  const { data } = await apiClient.post<TwoFactorConfirmResponse>(`${BASE_API_URL}/two-factor/confirm`, payload);
  return data;
}


export const verifyTwoFactorLogin = async (payload: TwoFactorLoginPayload) => {
  const { data } = await apiClient.post<LoginResponse>(`${BASE_API_URL}/login/2fa`, payload);
  return data;
}