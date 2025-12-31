import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import type {
  UserFilters,
  UpdateUserData,
  UpdateProfileData,
  ChangePasswordData,
  UserStats,
} from "@/types/userTypes";
import { BASE_URL } from "@/lib/config";
import type { UserProfile } from "@/types/authTypes";
import type {User} from "@/types/authTypes";



export const userApi = {
  getUsers: (filters: UserFilters) =>
    apiClient.get<ApiResponse<{ users: User[]; pagination: any }>>(`${BASE_URL}`, {
      params: filters,
    }),

  getUserById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`${BASE_URL}/${id}`),

  updateUser: (id: string, data: UpdateUserData) =>
    apiClient.put<ApiResponse<User>>(`${BASE_URL}/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete(`${BASE_URL}/${id}`),

  updateProfile: (id: string, data: UpdateProfileData) =>
    apiClient.post<ApiResponse<UserProfile>>(
      `${BASE_URL}/${id}/profile`,
      data
    ),

  changePassword: (id: string, data: ChangePasswordData) =>
    apiClient.post(`${BASE_URL}/${id}/password`, data),

  getUserStats: (id: string) =>
    apiClient.get<ApiResponse<UserStats>>(`${BASE_URL}/${id}/stats`),

  getUserActivity: (id: string, page = 1, limit = 10) =>
    apiClient.get<ApiResponse<any>>(`${BASE_URL}/${id}/activity`, {
      params: { page, limit },
    }),
};