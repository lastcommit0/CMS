import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/services/userService";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    userApi.getCurrentUser()
      .then(() => {
        if (!cancelled) {
          navigate("/user/dashboard", { replace: true });
        }
      })
      .catch(() => {
        if (!cancelled) {
          navigate("/auth", { replace: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <p className="p-6">Signing you in...</p>;
}
