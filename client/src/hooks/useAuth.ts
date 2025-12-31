import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoginCredentials, RegisterData, User } from '@/types/authTypes';
import { accessTokenStore } from '@/lib/api/tokenManager';
import { authApi } from '@/services/authService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


const AUTH_KEYS = {
  all: ['auth'] as const,
  user: ['auth', 'current-user'] as const,
};

export const useCurrentUser = () => {
  return useQuery<User | null>({
    queryKey: AUTH_KEYS.user,
    queryFn: async () => {
      try {
        const res = await authApi.getMe();
        return res.data.data;
      } catch {
        return null;
      }
    },
    enabled: !!accessTokenStore.get(),
    staleTime: 5 * 60 * 1000,
  });
};


export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await authApi.login(credentials);
      return res.data.data!;
    },

    onSuccess: ({ user, accessToken }) => {
      accessTokenStore.set(accessToken);

      queryClient.setQueryData(AUTH_KEYS.user, user);

      toast.success('Login successful');
      navigate('/dashboard');
    },

    onError: (error: any) => {
      toast.error(error?.message ?? 'Login failed');
    },
  });
};


export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await authApi.register(data);
      return res.data.data!;
    },

    onSuccess: ({ user, accessToken }) => {
      accessTokenStore.set(accessToken);
      queryClient.setQueryData(AUTH_KEYS.user, user);

      toast.success('Registration successful');
      navigate('/dashboard');
    },

    onError: (error: any) => {
      toast.error(error?.message ?? 'Registration failed');
    },
  });
};


export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,

    onSettled: () => {
      accessTokenStore.clear();

      queryClient.removeQueries({ queryKey: AUTH_KEYS.all });
      queryClient.setQueryData(AUTH_KEYS.user, null);

      toast.success('Logged out');
      navigate('/login');
    },
  });
};


export const useLogoutAll = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logoutAll,

    onSettled: () => {
      accessTokenStore.clear();

      queryClient.clear();

      toast.success('Logged out from all devices');
      navigate('/login');
    },
  });
};
