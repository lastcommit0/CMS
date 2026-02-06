import { useEffect } from "react";
import { refreshAccessToken } from "@/lib/api/authRefresh";
import { useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/services/userService";

export const useAuthBootstrap = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    refreshAccessToken()
      .then(async () => {
        const res = await userApi.getCurrentUser();
        queryClient.setQueryData(["auth", "current-user"], res.data.data);
      })
      .catch(() => {});
  }, [queryClient]);
};
