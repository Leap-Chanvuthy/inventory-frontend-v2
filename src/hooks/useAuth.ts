import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useAuth = () => {
  const {user , token} = useSelector((state: RootState) => state.auth);

  return { user, token, isAuthenticated: !!token , role: user?.role || null };

}

// export const useLogout = () => {
  
//   const dispatch = useDispatch();
//   const pathname = useLocation().pathname;

//   useEffect(() => {
//     dispatch(logout());
//   }, [pathname === '/auth/verify-email' || pathname === '/auth/reset-password' || pathname === '/auth/forgot-password']);
// }
