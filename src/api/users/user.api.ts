import {
  CreateUserPayload,
  GetUsersParams,
  GetUsersResponse,
  GetUserStatisticResponse,
  UpdateUserPayload,
  User,
} from "./user.types";
import { apiClient } from "../client";
import { BASE_API_URL } from "@/consts/endpoints";

export const getUsers = async (
  params: GetUsersParams
): Promise<GetUsersResponse> => {
  const { data } = await apiClient.get(`${BASE_API_URL}/users`, { params });
  return data.data;
};

export const getUserById = async (id: number | string): Promise<User> => {
  const { data } = await apiClient.get(`${BASE_API_URL}/users/${id}`);
  return data.data;
};


export const getUserStatistic = async (): Promise<GetUserStatisticResponse> => {
  const {data} = await apiClient.get(`${BASE_API_URL}/users/statistics`);
  return data.data;
}

export const updateUser = async (
  id: number,
  payload: UpdateUserPayload
): Promise<User> => {
  const { data } = await apiClient.post(
    `${BASE_API_URL}/users/${id}`,
    payload,
    {
      params: {
        _method: "PATCH",
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const { data } = await apiClient.post(`${BASE_API_URL}/users`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
