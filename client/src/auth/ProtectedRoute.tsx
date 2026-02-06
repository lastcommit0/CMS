import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { accessTokenStore } from "@/lib/api/tokenManager";
import { refreshAccessToken } from "@/lib/api/authRefresh";


export default function ProtectedRoute(){
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const token = accessTokenStore.get();
        if (token) {
            setAllowed(true);
            setChecking(false);
            return;
        }

        let cancelled = false;
        refreshAccessToken()
            .then(() => {
                if (!cancelled) {
                    setAllowed(true);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setAllowed(false);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setChecking(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const handler = () => {
            accessTokenStore.clear();
            navigate("/auth", { replace: true });
        };
        window.addEventListener("auth-expired", handler);
        return () => window.removeEventListener("auth-expired", handler);
    }, [navigate]);

    if (checking) {
        return <div className="p-6">Checking session...</div>;
    }

    if (!allowed) {
        console.log("No access token found, redirecting to login.");
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
}
