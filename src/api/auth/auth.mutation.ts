import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { loginUser , logoutUser } from "./auth.api";
import { login, logout } from "@/redux/slices/auth-slice";
import { RootState } from "@/redux/store";
import { LoginPayload } from "./auth.type";

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


export const useAuth = () => {
  const {user , token} = useSelector((state: RootState) => state.auth);

  return { user, token, isAuthenticated: !!token , role: user?.role || null };

}
