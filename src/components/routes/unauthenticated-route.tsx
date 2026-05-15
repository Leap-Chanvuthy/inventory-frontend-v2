import { Outlet , Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getFirstAccessibleRoute } from "@/utils/permission-routes";


const UnauthicatedRoute = () =>{

    const { user, permissions } = useAuth();

    const redirectTo = getFirstAccessibleRoute(permissions);
    return !user ? <Outlet /> : <Navigate to={redirectTo} />

}


export default UnauthicatedRoute;
