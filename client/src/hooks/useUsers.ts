import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  UserFilters,
  UserFormState,
} from '@/types/userTypes';
import { userApi } from '@/services/userService';
import { toast } from 'sonner';


const USER_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_KEYS.all, 'list'] as const,
  list: (filters: UserFilters) => [...USER_KEYS.lists(), filters] as const,
  detail: (id: string) => [...USER_KEYS.all, 'detail', id] as const,
  stats: (id: string) => [...USER_KEYS.all, 'stats', id] as const,
  activity: (id: string, page: number, limit: number) =>
    [...USER_KEYS.all, 'activity', id, page, limit] as const,
};


export const useUsers = (filters: UserFilters = { page: 1, limit: 10 }) =>
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
    staleTime: 2 * 60 * 1000,
  });

export const useUserActivity = (id: string, page = 1, limit = 10) =>
  useQuery({
    queryKey: USER_KEYS.activity(id, page, limit),
    queryFn: () =>
      userApi.getUserActivity(id, page, limit).then(res => res.data.data!),
    enabled: !!id,
  });

export const fetchManagers = async (role: string) => {
  const { data } = await userApi.getManager(role);
  return data.data;
};

export const useManagers = (role: string) =>
  useQuery({
    queryKey: ["managers", role],
    queryFn: () => fetchManagers(role),
    enabled: Boolean(role),
  });





export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserFormState }) =>
      userApi.updateUser(id, data).then(res => res.data.data!),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      toast.success('User updated successfully');
    },

    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to update user';
      toast.error(message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success('User deleted successfully');
    },

    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to delete user';
      toast.error(message);
    },
  });
};


export const useChangePassword = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      userApi.changePassword(id, data),

    onSuccess: () => {
      toast.success('Password changed successfully');
    },

    onError: (error: any) => {
      const message = error?.response?.data?.error?.message || 'Failed to change password';
      toast.error(message);
    },
  });