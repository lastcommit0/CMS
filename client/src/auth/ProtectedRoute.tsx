import { Navigate, Outlet } from "react-router-dom";
import { accessTokenStore } from "@/lib/api/tokenManager";


export default function ProtectedRoute(){
    const token = accessTokenStore.get();
    if(!token){
        console.log("No access token found, redirecting to login.");
        return <Navigate to="/auth" replace />
    }
    return <Outlet />
}