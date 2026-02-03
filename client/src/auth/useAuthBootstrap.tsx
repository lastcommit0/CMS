import { useEffect } from "react";
import { refreshAccessToken } from "@/lib/api/authRefresh";

export const useAuthBootstrap = () => {
  useEffect(() => {
    refreshAccessToken().catch(() => {});
  }, []);
};
