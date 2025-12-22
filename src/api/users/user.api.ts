import { CreateUserPayload, GetUsersParams, GetUsersResponse , User } from "./user.types";
import { apiClient } from "../client";
import { BASE_API_URL } from "@/consts/endpoints";


export const getUsers = async (params: GetUsersParams): Promise<GetUsersResponse> => {
  const { data } = await apiClient.get(`${BASE_API_URL}/users` , { params });
  return data.data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const { data } = await apiClient.post(
    `${BASE_API_URL}/users`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};
