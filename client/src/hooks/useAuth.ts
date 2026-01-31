import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { LoginCredentials, RegisterData } from '@/types/authTypes';
import { accessTokenStore } from '@/lib/api/tokenManager';
import { authApi } from '@/services/authService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AUTH_KEYS = {
  all: ['auth'] as const,
  user: ['auth', 'current-user'] as const,
};

export const useIdentifyUser = () => {
  return useMutation({
    mutationFn: async (identifier: string) => {
      const res = await authApi.identify(identifier);
      return res.data.data!;
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error?.message ?? "User not found"
      );
    },
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
      navigate('/user/dashboard');
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message ?? 'Login failed');
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await authApi.register(data);
      return res.data.data!;
    },

    onSuccess: () => {
      toast.success('User created successfully');
    },

    onError: (error: any) => {
      const message = error?.response?.data?.error?.message ?? 'Registration failed';
      toast.error(message);
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
      navigate('/auth');
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
      navigate('/auth');
    },
  });
};