import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pollApi } from '@/services/pollService';
import type { CreatePollRequest, PollFilters } from '@/types/pollTypes';
import { toast } from 'sonner';

const POLL_KEYS = {
    all: ['polls'] as const,
    lists: () => [...POLL_KEYS.all, 'list'] as const,
    list: (filters: PollFilters) => [...POLL_KEYS.lists(), filters] as const,
    detail: (id: string) => [...POLL_KEYS.all, 'detail', id] as const,
};

export const usePolls = (filters: PollFilters) => {
    return useQuery({
        queryKey: POLL_KEYS.list(filters),
        queryFn: () => pollApi.getPolls(filters).then((res) => res.data),
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreatePoll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePollRequest) =>
            pollApi.createPoll(data).then((res) => res.data.data!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POLL_KEYS.lists() });
            toast.success('Poll created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create poll');
        },
    });
};

export const useUpdatePoll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreatePollRequest> }) =>
            pollApi.updatePoll(id, data).then((res) => res.data.data!),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: POLL_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: POLL_KEYS.lists() });
            toast.success('Poll updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update poll');
        },
    });
};

export const useDeletePoll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => pollApi.deletePoll(id).then((res) => res.data.data!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POLL_KEYS.lists() });
            toast.success('Poll deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete poll');
        },
    });
};
