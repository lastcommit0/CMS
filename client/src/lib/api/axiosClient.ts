import axios, {
    type AxiosInstance,
    AxiosError,
    type InternalAxiosRequestConfig,
} from 'axios';
import { accessTokenStore } from './tokenManager';
import { refreshAccessToken } from './authRefresh';
import { HttpError } from './httpError';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';


export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}


const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});


apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = accessTokenStore.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


apiClient.interceptors.response.use((res) => res, async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
        originalRequest._retry = true;

        try {
            console.log("Refreshing access token...");
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
        } catch {
            accessTokenStore.clear();
            window.dispatchEvent(new CustomEvent('auth-expired'));
        }
    }
    console.log('API Error going:', error);
    return Promise.reject(new HttpError(error));
}
);

export default apiClient;
