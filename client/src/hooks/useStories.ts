import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
    Story,
    StoryFilters,
    StoryFormState,
    StoryStats,
} from '@/types/storyTypes';
import { storyApi } from '@/services/storyService';
import { toast } from 'sonner';

const STORY_KEYS = {
    all: ['stories'] as const,
    lists: () => [...STORY_KEYS.all, 'list'] as const,
    list: (filters: StoryFilters) => [...STORY_KEYS.lists(), filters] as const,
    detail: (id: string) => [...STORY_KEYS.all, 'detail', id] as const,
    stats: () => [...STORY_KEYS.all, 'stats'] as const,
    assets: (storyId: string) => [...STORY_KEYS.all, 'assets', storyId] as const,
};

// Queries
export const useStories = (filters: StoryFilters) => {
    return useQuery({
        queryKey: STORY_KEYS.list(filters),
        queryFn: () =>
            storyApi.getStories(filters).then(res => res.data.data!),
        staleTime: 5 * 60 * 1000,
    });
};

export const useStory = (id: string) => {
    return useQuery({
        queryKey: STORY_KEYS.detail(id),
        queryFn: () =>
            storyApi.getStoryById(id).then(res => res.data.data!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useStoryStats = () => {
    return useQuery({
        queryKey: STORY_KEYS.stats(),
        queryFn: () =>
            storyApi.getStats().then(res => res.data.data!),
        staleTime: 60 * 1000,
    });
};

export const useStoryAssets = (storyId: string) => {
    return useQuery({
        queryKey: STORY_KEYS.assets(storyId),
        queryFn: () =>
            storyApi.getAssets(storyId).then(res => res.data.data!),
        enabled: !!storyId,
        staleTime: 5 * 60 * 1000,
    });
};

// Mutations
export const useCreateStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: StoryFormState) =>
            storyApi.createStory(data).then(res => res.data),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.stats() });
            toast.success('Story created successfully');
            return data;
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create story');
        },
    });
};

export const useCreateDraft = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            storyApi.createDraft().then(res => res.data.data!),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.stats() });
            toast.success('Draft created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create draft');
        },
    });
};

export const useUpdateStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<StoryFormState> }) =>
            storyApi.updateStory(id, data).then(res => res.data.data!),

        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.stats() });
            toast.success('Story updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update story');
        },
    });
};

export const useDeleteStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => 
            storyApi.deleteStory(id).then(res => res.data.data!),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.stats() });
            toast.success('Story deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete story');
        },
    });
};

export const usePublishStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            storyApi.publishStory(id).then(res => res.data.data!),

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.stats() });
            toast.success('Story published successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to publish story');
        },
    });
};

export const useUnpublishStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            storyApi.unpublishStory(id).then(res => res.data.data!),

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.stats() });
            toast.success('Story unpublished successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to unpublish story');
        },
    });
};

export const useScheduleStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, scheduleAt }: { id: string; scheduleAt: string }) =>
            storyApi.scheduleStory(id, scheduleAt).then(res => res.data.data!),

        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.stats() });
            toast.success('Story scheduled successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to schedule story');
        },
    });
};

export const useSubmitForReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            storyApi.submitForReview(id).then(res => res.data.data!),

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.stats() });
            toast.success('Story submitted for review');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to submit story');
        },
    });
};

// Asset mutations
export const useAddAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ storyId, asset }: { storyId: string; asset: any }) =>
            storyApi.addAsset(storyId, asset).then(res => res.data.data!),

        onSuccess: (_, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.assets(storyId) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(storyId) });
            toast.success('Asset added successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to add asset');
        },
    });
};

export const useDeleteAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ storyId, assetId }: { storyId: string; assetId: string }) =>
            storyApi.deleteAsset(storyId, assetId).then(res => res.data.data!),

        onSuccess: (_, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.assets(storyId) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(storyId) });
            toast.success('Asset deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete asset');
        },
    });
};

export const useUploadCoverImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ storyId, file }: { storyId: string; file: File }) =>
            storyApi.uploadCoverImage(storyId, file).then(res => res.data.data!),

        onSuccess: (_, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(storyId) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.assets(storyId) });
            toast.success('Cover image uploaded successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to upload cover image');
        },
    });
};

export const useUploadPDF = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ storyId, file }: { storyId: string; file: File }) =>
            storyApi.uploadPDF(storyId, file).then(res => res.data.data!),

        onSuccess: (_, { storyId }) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(storyId) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.assets(storyId) });
            toast.success('PDF uploaded successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to upload PDF');
        },
    });
};

// Bulk operations
export const useBulkUpdateStories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ storyIds, data }: { storyIds: string[]; data: Partial<StoryFormState> }) =>
            storyApi.bulkUpdate(storyIds, data).then(res => res.data.data!),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.all });
            toast.success(`${data.count} stories updated successfully`);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update stories');
        },
    });
};

export const useBulkDeleteStories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (storyIds: string[]) =>
            storyApi.bulkDelete(storyIds).then(res => res.data.data!),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.all });
            toast.success(`${data.count} stories deleted successfully`);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete stories');
        },
    });
};

export const useBulkPublishStories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (storyIds: string[]) =>
            storyApi.bulkPublish(storyIds).then(res => res.data.data!),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.all });
            toast.success(`${data.count} stories published successfully`);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to publish stories');
        },
    });
};

export const useBulkChangeStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ 
            storyIds, 
            status 
        }: { 
            storyIds: string[]; 
            status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'SCHEDULED' 
        }) =>
            storyApi.bulkChangeStatus(storyIds, status).then(res => res.data.data!),

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.all });
            toast.success(`${data.count} stories status changed successfully`);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to change status');
        },
    });
};

export const useDuplicateStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            storyApi.duplicateStory(id).then(res => res.data.data!),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.stats() });
            toast.success('Story duplicated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to duplicate story');
        },
    });
};

export const useStoryRevisions = (id: string) => {
    return useQuery({
        queryKey: [...STORY_KEYS.detail(id), 'revisions'],
        queryFn: () =>
            storyApi.getRevisions(id).then(res => res.data.data!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useRestoreRevision = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, revisionId }: { id: string; revisionId: string }) =>
            storyApi.restoreRevision(id, revisionId).then(res => res.data.data!),

        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
            toast.success('Story restored from revision');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to restore revision');
        },
    });
};