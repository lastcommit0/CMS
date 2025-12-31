import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
    Story,
    StoryFilters,
    CreateStoryData,
} from '@/types/storyTypes';
import { storyApi } from '@/services/storyService';


const STORY_KEYS = {
    all: ['stories'] as const,
    lists: () => [...STORY_KEYS.all, 'list'] as const,
    list: (filters: StoryFilters) => [...STORY_KEYS.lists(), filters] as const,
    detail: (id: string) => [...STORY_KEYS.all, 'detail', id] as const,
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


export const STORY_STATS_KEY = ["story-stats"] as const

export const useStoryStats = () => {
  return useQuery({
    queryKey: STORY_STATS_KEY,
    queryFn: () =>
      storyApi.stats().then(res => res.data.data),
    staleTime: 60 * 1000, 
  })
}


// Mutations
export const useCreateStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStoryData) =>
            storyApi.createStory(data).then(res => res.data.data!),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
        },
    });
};

export const useUpdateStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateStoryData> }) =>
            storyApi.updateStory(id, data).then(res => res.data.data!),

        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
        },
    });
};

export const useDeleteStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => storyApi.deleteStory(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
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
        },
    });
};

export const useUnpublishStory = usePublishStory;

export const useScheduleStory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, scheduleAt }: { id: string; scheduleAt: string }) =>
            storyApi.scheduleStory(id, scheduleAt).then(res => res.data.data!),

        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.lists() });
        },
    });
};


export const useBulkUpdateStories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ storyIds, data }: { storyIds: string[]; data: Partial<Story> }) =>
            storyApi.bulkUpdate(storyIds, data).then(res => res.data.data!),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.all });
        },
    });
};

export const useBulkDeleteStories = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (storyIds: string[]) =>
            storyApi.bulkDelete(storyIds).then(res => res.data.data!),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STORY_KEYS.all });
        },
    });
};
