import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { userApi } from "@/services/userService";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function ProtectedRoute() {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        userApi.getCurrentUser()
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
            navigate("/auth", { replace: true });
        };
        window.addEventListener("auth-expired", handler);
        return () => window.removeEventListener("auth-expired", handler);
    }, [navigate]);

    if (checking) {
        return (
            <LoadingSkeleton/>
        )
    }

    if (!allowed) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
    
}
