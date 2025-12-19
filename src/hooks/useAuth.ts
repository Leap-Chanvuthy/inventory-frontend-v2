import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "@/services/auth.service";
import { login, logout } from "@/redux/slices/auth-slice";
import { RootState } from "@/redux/store";

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


export const useAuth = () => {
  const {user , token} = useSelector((state: RootState) => state.auth);

  return { user, token, isAuthenticated: !!token , role: user?.role || null };

}
