import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import type { AuthResponse, LoginCredentials } from "@/types/authTypes";
import { BASE_URL } from "@/lib/config";
import type { User, RegisterData, Identify } from "@/types/authTypes";



export const authApi = {

    login: (credentials: LoginCredentials) =>
        apiClient.post<ApiResponse<AuthResponse>>(`${BASE_URL}/login`, credentials),

    register: (data: RegisterData) =>
        apiClient.post<ApiResponse<User>>(`${BASE_URL}/register`, data),

    identify: (identifier: string) =>
        apiClient.post<ApiResponse<Identify>>(`${BASE_URL}/identify`, { identifier }),

    logout: () =>
        apiClient.post(`${BASE_URL}/logout`),

    logoutAll: () =>
        apiClient.post(`${BASE_URL}/logoutAll`),
};