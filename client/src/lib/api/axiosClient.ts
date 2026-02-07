import axios, {
    type AxiosInstance,
    AxiosError,
    type InternalAxiosRequestConfig,
} from 'axios';
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


apiClient.interceptors.response.use(
    //this we call success handler
    (res) => res, 
    
    //this we call error handler
    async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
        originalRequest._retry = true;

        try {
            await refreshAccessToken();
            return apiClient(originalRequest);
        } catch {
            window.dispatchEvent(new CustomEvent('auth-expired'));
        }
    }
    const url = originalRequest?.url ?? '';
    const isMeRequest = typeof url === 'string' && url.includes('/user/me');
    if (!(error.response?.status === 401 && isMeRequest)) {
        console.log('API Error going:', error);
    }
    return Promise.reject(new HttpError(error));
}
);

export default apiClient;
