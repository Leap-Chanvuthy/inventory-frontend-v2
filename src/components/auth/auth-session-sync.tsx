import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "@/api/auth/auth.query";
import { useAuth } from "@/hooks/useAuth";
import { logout, setAuthResolved, setCurrentUserFromServer } from "@/redux/slices/auth-slice";

type AuthSessionSyncProps = {
  children: ReactNode;
};

export default function AuthSessionSync({ children }: AuthSessionSyncProps) {
  const dispatch = useDispatch();
  const { token, authResolved } = useAuth();

  const { data, isLoading, isError } = useCurrentUser(!!token);

  useEffect(() => {
    if (!token) {
      dispatch(setAuthResolved(true));
      return;
    }

    if (data?.data?.user) {
      dispatch(setCurrentUserFromServer(data.data.user));
      return;
    }

    if (isError) {
      dispatch(logout());
    }
  }, [data, dispatch, isError, token]);

  if (token && (isLoading || !authResolved)) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-sm text-muted-foreground">
        Loading session...
      </div>
    );
  }

  return <>{children}</>;
}

