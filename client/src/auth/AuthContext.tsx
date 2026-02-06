import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { accessTokenStore } from "@/lib/api/tokenManager";
import { userApi } from "@/services/userService";
import type { User } from "@/types/authTypes";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  refetchUser: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_USER_KEY = ["auth", "current-user"] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const token = accessTokenStore.get();

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: AUTH_USER_KEY,
    queryFn: async () => {
      const res = await userApi.getCurrentUser();
      return res.data.data!;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const setUser = useCallback((user: User | null) => {
    queryClient.setQueryData(AUTH_USER_KEY, user);
  }, [queryClient]);

  const clearUser = useCallback(() => {
    accessTokenStore.clear();
    queryClient.setQueryData(AUTH_USER_KEY, null);
  }, [queryClient]);

  useEffect(() => {
    const handler = () => clearUser();
    window.addEventListener("auth-expired", handler);
    return () => window.removeEventListener("auth-expired", handler);
  }, [clearUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data ?? null,
      isAuthenticated: !!data && !!accessTokenStore.get(),
      isLoading: isLoading || isFetching,
      setUser,
      clearUser,
      refetchUser: () => {
        void refetch();
      },
    }),
    [data, isLoading, isFetching, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
