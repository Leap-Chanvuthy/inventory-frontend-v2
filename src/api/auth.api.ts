import { BASE_API_URL } from "@/consts/endpoints";
import { apiClient } from "./client";

export interface User {
  name: string;
  phone_number: string | null;
  profile_picture: string | null;
  role: string;
  email: string;
  email_verified_at: string | null;
  ip_address: string | null;
  device: string | null;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    authorisation: {
      token: string;
      type: string;
    };
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const { data } = await apiClient.post<LoginResponse>(`${BASE_API_URL}/login`, payload);
  return data; // full response including data.user and data.authorisation
};

export const logoutApi = async () => {
  await apiClient.post(`${BASE_API_URL}/logout`);
};
