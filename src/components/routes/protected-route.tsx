import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, user } = useSelector((state: RootState) => state.auth);

  // 1️⃣ Not logged in
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2️⃣ Role-based restriction
  if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    return <Navigate to="/403" replace />;
  }

  // 3️⃣ Authorized
  return <Outlet />;
}
