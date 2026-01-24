import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import type {
    Story,
    StoryAsset,
    StoryFormState,
    CreateStoryRequest,
    UpdateStoryRequest,
    StoryFilters,
    PaginatedResponse,
    StoryStats
} from "@/types/storyTypes";
import { BASE_URL } from "@/lib/config";

export const storyApi = {
    getStories: (filters: StoryFilters) =>
        apiClient.get<ApiResponse<PaginatedResponse<Story>>>(BASE_URL, {
            params: filters,
        }),

    getStoryById: (id: string) =>
        apiClient.get<ApiResponse<Story>>(`${BASE_URL}/${id}`),

    createStory: (data: CreateStoryRequest) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/create`, data),

    createDraft: () =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/draft`),

    updateStory: (id: string, data: Partial<StoryFormState>) =>
        apiClient.put<ApiResponse<Story>>(`${BASE_URL}/${id}`, data),

    deleteStory: (id: string) =>
        apiClient.delete<ApiResponse<{ success: boolean }>>(`${BASE_URL}/${id}`),

    publishStory: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/${id}/publish`),

    unpublishStory: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/${id}/unpublish`),

    scheduleStory: (id: string, scheduleAt: string) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/${id}/schedule`, {
            scheduleAt,
        }),

    submitForReview: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/${id}/review`),

    getStats: () =>
        apiClient.get<ApiResponse<StoryStats>>(`${BASE_URL}/stats`),

    addAsset: (storyId: string, asset: Omit<StoryAsset, 'id'>) =>
        apiClient.post<ApiResponse<StoryAsset>>(
            `${BASE_URL}/${storyId}/assets`,
            asset
        ),

    deleteAsset: (storyId: string, assetId: string) =>
        apiClient.delete<ApiResponse<{ success: boolean }>>(
            `${BASE_URL}/${storyId}/assets/${assetId}`
        ),

    getAssets: (storyId: string) =>
        apiClient.get<ApiResponse<StoryAsset[]>>(
            `${BASE_URL}/${storyId}/assets`
        ),

    bulkUpdate: (storyIds: string[], data: Partial<StoryFormState>) =>
        apiClient.post<ApiResponse<{ count: number; updated: Story[] }>>(
            `${BASE_URL}/bulk/update`,
            {
                storyIds,
                ...data,
            }
        ),

    bulkDelete: (storyIds: string[]) =>
        apiClient.delete<ApiResponse<{ count: number; deleted: string[] }>>(
            `${BASE_URL}/bulk/delete`,
            {
                data: { storyIds },
            }
        ),

    bulkPublish: (storyIds: string[]) =>
        apiClient.post<ApiResponse<{ count: number; published: Story[] }>>(
            `${BASE_URL}/bulk/publish`,
            { storyIds }
        ),

    bulkChangeStatus: (storyIds: string[], status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'SCHEDULED') =>
        apiClient.post<ApiResponse<{ count: number; updated: Story[] }>>(
            `${BASE_URL}/bulk/status`,
            { storyIds, status }
        ),

    uploadCoverImage: (storyId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<ApiResponse<StoryAsset>>(
            `${BASE_URL}/${storyId}/cover-image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    },

    uploadPDF: (storyId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<ApiResponse<StoryAsset>>(
            `${BASE_URL}/${storyId}/pdf`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    },

    duplicateStory: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${BASE_URL}/${id}/duplicate`),

    getRevisions: (id: string) =>
        apiClient.get<ApiResponse<Story[]>>(`${BASE_URL}/${id}/revisions`),

    restoreRevision: (id: string, revisionId: string) =>
        apiClient.post<ApiResponse<Story>>(
            `${BASE_URL}/${id}/revisions/${revisionId}/restore`
        ),
};