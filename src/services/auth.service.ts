import * as api from "@/api/auth.api";

export const loginUser = async (email: string, password: string) => {
  const response = await api.login({ email, password });
  return {
    user: response.data.user,
    token: response.data.authorisation.token,
  };
};

export const logoutUser = async () => {
  await api.logoutApi();
};
