import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { accessTokenStore } from "@/lib/api/tokenManager";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    accessTokenStore.set(token);

    navigate("/user/dashboard", { replace: true });
  }, []);

  return <p className="p-6">Signing you in...</p>;
}
