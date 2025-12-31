import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import type {
    Story,
    StoryAsset,
    CreateStoryData,
    StoryFilters,
    PaginatedResponse,
    Stats
} from "@/types/storyTypes";
import { BASE_URL } from "@/lib/config";


export const storyApi = {
    getStories: (filters: StoryFilters) =>
        apiClient.get<ApiResponse<PaginatedResponse<Story>>>(BASE_URL, {
            params: filters,
        }),

    getStoryById: (id: string) =>
        apiClient.get<ApiResponse<Story>>(`${BASE_URL}/${id}`),

    createStory: (data: CreateStoryData) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/create`, data),

    createDraft: () =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/draft`),

    updateStory: (id: string, data: Partial<CreateStoryData>) =>
        apiClient.put<ApiResponse<Story>>(`${BASE_URL}/${id}`, data),

    deleteStory: (id: string) =>
        apiClient.delete(`${BASE_URL}/${id}`),

    publishStory: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/${id}/publish`),

    unpublishStory: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/${id}/unpublish`),

    scheduleStory: (id: string, scheduleAt: string) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/${id}/schedule`, {
            scheduleAt,
        }),
    
    pendingStory: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/${id}/pending`),

    stats: () =>
        apiClient.get<ApiResponse<Stats>>(`${BASE_URL}/stats`),

    addAsset: (storyId: string, asset: Omit<StoryAsset, 'id'>) =>
        apiClient.post<ApiResponse<StoryAsset>>(
            `${BASE_URL}/${storyId}/assets`,
            asset
        ),

    deleteAsset: (storyId: string, assetId: string) =>
        apiClient.delete(`${BASE_URL}/${storyId}/assets/${assetId}`),

    bulkUpdate: (storyIds: string[], data: Partial<Story>) =>
        apiClient.post<ApiResponse<{ count: number }>>(`${BASE_URL}/bulk`, {
            storyIds,
            ...data,
        }),

    bulkDelete: (storyIds: string[]) =>
        apiClient.delete<ApiResponse<{ count: number }>>(`${BASE_URL}/bulk`, {
            data: { ids: storyIds },
        }),
};