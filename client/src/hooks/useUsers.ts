// client/src/hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  UserFilters,
  UpdateUserData,
  UpdateProfileData,
} from '@/types/userTypes';
import { userApi } from '@/services/userService';

/* ------------------ Query Keys ------------------ */

const USER_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_KEYS.all, 'list'] as const,
  list: (filters: UserFilters) => [...USER_KEYS.lists(), filters] as const,
  detail: (id: string) => [...USER_KEYS.all, 'detail', id] as const,
  stats: (id: string) => [...USER_KEYS.all, 'stats', id] as const,
  activity: (id: string, page: number, limit: number) =>
    [...USER_KEYS.all, 'activity', id, page, limit] as const,
};

/* ------------------ Queries ------------------ */

export const useUsers = (filters: UserFilters) =>
  useQuery({
    queryKey: USER_KEYS.list(filters),
    queryFn: () =>
      userApi.getUsers(filters).then(res => res.data.data!),
    staleTime: 5 * 60 * 1000,
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () =>
      userApi.getUserById(id).then(res => res.data.data!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useUserStats = (id: string) =>
  useQuery({
    queryKey: USER_KEYS.stats(id),
    queryFn: () =>
      userApi.getUserStats(id).then(res => res.data.data!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // matches old logic
  });

export const useUserActivity = (id: string, page = 1, limit = 10) =>
  useQuery({
    queryKey: USER_KEYS.activity(id, page, limit),
    queryFn: () =>
      userApi.getUserActivity(id, page, limit).then(res => res.data.data!),
    enabled: !!id,
  });

/* ------------------ Mutations ------------------ */

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userApi.updateUser(id, data).then(res => res.data.data!),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfileData }) =>
      userApi.updateProfile(id, data).then(res => res.data.data!),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
    },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      userApi.changePassword(id, data),
  });
