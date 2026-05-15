import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getFirstAccessibleRoute } from "@/utils/permission-routes";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  permissions?: string[];
}

export default function ProtectedRoute({ allowedRoles, permissions }: ProtectedRouteProps) {
  // const { token, user } = useSelector((state: RootState) => state.auth);
  const { user, token, canAny, authResolved } = useAuth();
  const location = useLocation();

  if (!authResolved) {
    return null;
  }

  // 1️⃣ Not logged in
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2️⃣ Role-based restriction
  if (allowedRoles && !allowedRoles.includes(user?.role?.key || "")) {
    return <Navigate to="/403" replace />;
  }

  if (permissions && permissions.length > 0 && !canAny(permissions)) {
    if (location.pathname === "/") {
      const redirectTo = getFirstAccessibleRoute(user?.permissions || []);
      if (redirectTo !== "/") {
        return <Navigate to={redirectTo} replace />;
      }
    }

    return <Navigate to="/403" replace />;
  }

  // 3️⃣ Authorized
  return <Outlet />;
}
