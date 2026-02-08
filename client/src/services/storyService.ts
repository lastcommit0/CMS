import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import type {
    Story,
    StoryAsset,
    StoryAssetInput,
    StoryFormState,
    CreateStoryRequest,
    StoryFilters,
    StoryStats,
    StoryListResponse
} from "@/types/storyTypes";
import { STORY_URL } from "@/lib/config";

export const storyApi = {
    getStories: (filters: StoryFilters) =>
        apiClient.get<StoryListResponse & { success: boolean }>(STORY_URL, {
            params: filters,
        }),

    getStoryById: (id: string) =>
        apiClient.get<ApiResponse<Story>>(`${STORY_URL}/${id}`),

    createStory: (data: CreateStoryRequest) =>
        apiClient.post<ApiResponse<Story>>(`${STORY_URL}/create`, data),

    createDraft: () =>
        apiClient.post<ApiResponse<Story>>(`${STORY_URL}/draft`),

    updateStory: (id: string, data: Partial<StoryFormState>) =>
        apiClient.put<ApiResponse<Story>>(`${STORY_URL}/${id}`, data),

    deleteStory: (id: string) =>
        apiClient.delete<ApiResponse<{ success: boolean }>>(`${STORY_URL}/${id}`),

    publishStory: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${STORY_URL}/${id}/publish`),

    unpublishStory: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${STORY_URL}/${id}/unpublish`),

    scheduleStory: (id: string, scheduleAt: string) =>
        apiClient.post<ApiResponse<Story>>(`${STORY_URL}/${id}/schedule`, {
            scheduleAt,
        }),

    submitForReview: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${STORY_URL}/${id}/review`),

    getStats: () =>
        apiClient.get<ApiResponse<StoryStats>>(`${STORY_URL}/stats`),

    addAsset: (storyId: string, asset: StoryAssetInput) =>
        apiClient.post<ApiResponse<StoryAsset>>(
            `${STORY_URL}/${storyId}/assets`,
            asset
        ),

    deleteAsset: (storyId: string, assetId: string) =>
        apiClient.delete<ApiResponse<{ success: boolean }>>(
            `${STORY_URL}/${storyId}/asset/${assetId}`
        ),

    getAssets: (storyId: string) =>
        apiClient.get<ApiResponse<StoryAsset[]>>(
            `${STORY_URL}/${storyId}/assets`
        ),

    bulkUpdate: (storyIds: string[], data: Partial<StoryFormState>) =>
        apiClient.post<ApiResponse<{ count: number; updated: Story[] }>>(
            `${STORY_URL}/bulk/update`,
            {
                storyIds,
                ...data,
            }
        ),

    bulkDelete: (storyIds: string[]) =>
        apiClient.delete<ApiResponse<{ count: number; deleted: string[] }>>(
            `${STORY_URL}/bulk/delete`,
            {
                data: { storyIds },
            }
        ),

    bulkPublish: (storyIds: string[]) =>
        apiClient.post<ApiResponse<{ count: number; published: Story[] }>>(
            `${STORY_URL}/bulk/publish`,
            { storyIds }
        ),

    bulkChangeStatus: (storyIds: string[], status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'SCHEDULED') =>
        apiClient.post<ApiResponse<{ count: number; updated: Story[] }>>(
            `${STORY_URL}/bulk/status`,
            { storyIds, status }
        ),

    duplicateStory: (id: string) =>
        apiClient.post<ApiResponse<Story>>(`${STORY_URL}/${id}/duplicate`),

    getRevisions: (id: string) =>
        apiClient.get<ApiResponse<Story[]>>(`${STORY_URL}/${id}/revisions`),

    restoreRevision: (id: string, revisionId: string) =>
        apiClient.post<ApiResponse<Story>>(
            `${STORY_URL}/${id}/revisions/${revisionId}/restore`
        ),
};
