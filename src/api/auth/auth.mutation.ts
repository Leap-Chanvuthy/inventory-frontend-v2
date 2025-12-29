import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser , logoutUser, verifyEmail } from "./auth.api";
import { login, logout } from "@/redux/slices/auth-slice";
import { LoginPayload, VerifyEmailPayload } from "./auth.type";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      loginUser(payload),
    onSuccess: (payload) => {
      dispatch(login({ token: payload.data.authorisation.token , user: payload.data.user }));
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


export const useVerifyEmail = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) => {
      dispatch(logout());
      return verifyEmail(payload);
    },
  });
}

