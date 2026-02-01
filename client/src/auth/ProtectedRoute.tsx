import { Navigate, Outlet } from "react-router-dom";
import { accessTokenStore } from "@/lib/api/tokenManager";


export default function ProtectedRoute(){
    const token = accessTokenStore.get();
    if(!token){
        return <Navigate to="/auth/login" replace />
    }
    return <Outlet />
}