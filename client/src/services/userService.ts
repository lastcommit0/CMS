// client/src/services/userService.ts
import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import type {
  UserFilters,
  ChangePasswordData,
  UserStats,
  UserFormState,
} from "@/types/userTypes";
import type { User } from "@/types/authTypes";

const BASE_URL = "/user";

export const userApi = {
  getCurrentUser: () =>
    apiClient.get<ApiResponse<User>>(`${BASE_URL}/me`),

  getUsers: (filters: UserFilters) =>
    apiClient.get<ApiResponse<{ users: UserFormState[]; pagination: any }>>(
      `${BASE_URL}/users`,
      { params: filters }
    ),

  getUserById: (id: string) =>
    apiClient.get<ApiResponse<UserFormState>>(`${BASE_URL}/user/${id}`),

  updateUser: (id: string, data: UserFormState) =>
    apiClient.post<ApiResponse<UserFormState>>(`${BASE_URL}/user/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete(`${BASE_URL}/user/${id}`),

  changePassword: (id: string, data: ChangePasswordData) =>
    apiClient.post(`${BASE_URL}/user/${id}/password`, data),

  getUserStats: (id: string) =>
    apiClient.get<ApiResponse<UserStats>>(`${BASE_URL}/user/${id}/stats`),

  getUserActivity: (id: string, page = 1, limit = 10) =>
    apiClient.get<ApiResponse<any>>(`${BASE_URL}/user/${id}/activity`, {
      params: { page, limit },
    }),

  getManager: (role: string) => 
    apiClient.get<ApiResponse<any[]>>(`${BASE_URL}/manager/${role}`)
};
