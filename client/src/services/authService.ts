import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import type { AuthResponse, LoginCredentials } from "@/types/authTypes";
import { AUTH_URL } from "@/lib/config";
import type { User, RegisterData, Identify } from "@/types/authTypes";



export const authApi = {

    login: (credentials: LoginCredentials) =>
        apiClient.post<ApiResponse<AuthResponse>>(`${AUTH_URL}/login`, credentials),

    register: (data: RegisterData) =>
        apiClient.post<ApiResponse<User>>(`${AUTH_URL}/register`, data),

    identify: (identifier: string) =>
        apiClient.post<ApiResponse<Identify>>(`${AUTH_URL}/identify`, { identifier }),

    logout: () =>
        apiClient.post(`${AUTH_URL}/logout`),

    logoutAll: () =>
        apiClient.post(`${AUTH_URL}/logoutAll`),

    getCaptcha: () =>
        apiClient.get<{ success: boolean, data: { captcha: string } }>(`${AUTH_URL}/captcha`),
};