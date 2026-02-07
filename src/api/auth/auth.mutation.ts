import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { confirmTwoFactor, disableTwoFactor, forgotPassword, loginUser , logoutUser, resetPassword, setupTwoFactor, verifyEmail, verifyTwoFactorLogin } from "./auth.api";
import { login, logout } from "@/redux/slices/auth-slice";
import { DisableTwoFactorPayload, ForgotPasswordPayload, LoginPayload, ResetPasswordPayload, TwoFactorConfirmPayload, TwoFactorLoginPayload, VerifyEmailPayload } from "./auth.type";

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
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



export const useForgotPassword = () =>{
    return useMutation({
        mutationFn: (payload : ForgotPasswordPayload) => forgotPassword(payload),
    });
}



export const useResetPassword = () => {
    return useMutation({
        mutationFn: (payload : ResetPasswordPayload) => resetPassword(payload),
    });
}


export const useSetupTwoFactor = () => {
    return useMutation({
        mutationFn: () => setupTwoFactor(),
    });
}


export const useConfirmTwoFactor = () => {
    return useMutation({
        mutationFn: (payload: TwoFactorConfirmPayload) => confirmTwoFactor(payload),
    });
}


export const useVerifyTwoFactorLogin = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: (payload: TwoFactorLoginPayload) => verifyTwoFactorLogin(payload),
        onSuccess: (payload) => {
            dispatch(login({ token: payload.data.authorisation.token, user: payload.data.user }));
        },
    });
}

export const useDisableTwoFactor = () => {
    return useMutation({
        mutationFn: (payload: DisableTwoFactorPayload) => disableTwoFactor(payload),
    });
}
