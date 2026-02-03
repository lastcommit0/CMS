import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import { EPAPER_URL } from "@/lib/config";
import type { PaginatedResponse } from "@/types/storyTypes";

export interface Epaper {
    id: string;
    type: 'EPAPER' | 'MAGAZINE';
    title: string;
    date: string;
    pdfUrl?: string;
    coverImageUrl?: string;
    pages: { pageNumber: number; imageUrl: string }[];
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEpaperRequest {
    type: 'EPAPER' | 'MAGAZINE';
    title: string;
    date: string;
    pdfUrl?: string;
    coverImageUrl?: string;
}

export const epaperApi = {
    getEpapers: (params?: any) =>
        apiClient.get<ApiResponse<PaginatedResponse<Epaper>>>(`${EPAPER_URL}/epapers`, { params }),

    createEpaper: (data: CreateEpaperRequest) =>
        apiClient.post<ApiResponse<Epaper>>(`${EPAPER_URL}/epapers`, data),

    updateEpaper: (id: string, data: Partial<CreateEpaperRequest>) =>
        apiClient.patch<ApiResponse<Epaper>>(`${EPAPER_URL}/epapers/${id}`, data),

    deleteEpaper: (id: string) =>
        apiClient.delete<ApiResponse<any>>(`${EPAPER_URL}/epapers/${id}`),

    uploadPdf: (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<ApiResponse<{ url: string }>>(`${EPAPER_URL}/epapers/${id}/pdf`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    uploadCover: (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<ApiResponse<{ url: string }>>(`${EPAPER_URL}/epapers/${id}/cover`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};
