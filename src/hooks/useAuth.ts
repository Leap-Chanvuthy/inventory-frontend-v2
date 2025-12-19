import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "@/services/auth.service";
import { login, logout } from "@/redux/slices/auth-slice";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: ({ user, token }) => {
      dispatch(login({ token, user }));
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      dispatch(logout());
    },
  });
};
