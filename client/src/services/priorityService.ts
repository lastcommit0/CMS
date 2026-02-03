import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import { PRIORITY_URL } from "@/lib/config";

export interface PriorityItem {
    id: string; // This might be storyId or priority record id
    storyId: string;
    sectionId: string;
    priority: number;
    storyTitle: string;
    authorName: string;
    sectionName: string;
    updatedAt: string;
}

export const priorityApi = {
    getPriorities: (search?: string) =>
        apiClient.get<ApiResponse<PriorityItem[]>>(`${PRIORITY_URL}/priorities`, { params: { search } }),

    updatePriority: (storyId: string, sectionId: string, priority: number) =>
        apiClient.post<ApiResponse<any>>(`${PRIORITY_URL}/priority/${storyId}/${sectionId}`, { priority }),

    bulkUpdate: (updates: { storyId: string; sectionId: string; priority: number }[]) =>
        apiClient.post<ApiResponse<any>>(`${PRIORITY_URL}/priority/bulk`, { updates }),
};