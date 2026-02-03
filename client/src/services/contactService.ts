import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import { CONTACT_URL } from "@/lib/config";
import type { PaginatedResponse } from "@/types/storyTypes";

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    source?: string;
    createdAt: string;
}

export const contactApi = {
    getMessages: (params?: any) =>
        apiClient.get<ApiResponse<PaginatedResponse<ContactMessage>>>(`${CONTACT_URL}/messages`, { params }),

    deleteMessage: (id: string) =>
        apiClient.delete<ApiResponse<any>>(`${CONTACT_URL}/messages/${id}`),
};
