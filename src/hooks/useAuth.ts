import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useAuth = () => {
  const { user, token, permissions, authResolved } = useSelector((state: RootState) => state.auth);
  const roleKey = user?.role?.key || null;
  const normalizedPermissions = Array.isArray(permissions)
    ? permissions
    : Array.isArray(user?.permissions)
      ? user.permissions
      : [];

  const can = (permission: string) => {
    if (!permission) return false;
    if (roleKey === "ADMIN") return true;
    return normalizedPermissions.includes(permission);
  };

  const canAny = (permissionList: string[] = []) => {
    if (roleKey === "ADMIN") return true;
    if (!Array.isArray(permissionList) || permissionList.length === 0) return false;
    return permissionList.some(permission => can(permission));
  };

  const canAll = (permissionList: string[] = []) => {
    if (roleKey === "ADMIN") return true;
    if (!Array.isArray(permissionList) || permissionList.length === 0) return false;
    return permissionList.every(permission => can(permission));
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    role: roleKey,
    authResolved,
    permissions: normalizedPermissions,
    can,
    canAny,
    canAll,
  };

}

// export const useLogout = () => {
  
//   const dispatch = useDispatch();
//   const pathname = useLocation().pathname;

//   useEffect(() => {
//     dispatch(logout());
//   }, [pathname === '/auth/verify-email' || pathname === '/auth/reset-password' || pathname === '/auth/forgot-password']);
// }
