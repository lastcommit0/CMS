import { useEffect } from "react";
import { refreshAccessToken } from "@/lib/api/authRefresh";
import { accessTokenStore } from "@/lib/api/tokenManager";

export const useAuthBootstrap = () => {
  useEffect(() => {
    const init = async () => {
      try {
        const token = await refreshAccessToken();
        accessTokenStore.set(token);
      } catch {
        accessTokenStore.clear();
      }
    };

    init();
  }, []);
};
