import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { priorityApi } from '@/services/priorityService';
import { toast } from 'sonner';

const PRIORITY_KEYS = {
    all: ['priorities'] as const,
    list: (search?: string) => [...PRIORITY_KEYS.all, { search }] as const,
};

export const usePriorities = (search?: string) => {
    return useQuery({
        queryKey: PRIORITY_KEYS.list(search),
        queryFn: () => priorityApi.getPriorities(search).then((res) => res.data.data!),
    });
};

export const useUpdatePriority = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ storyId, sectionId, priority }: { storyId: string; sectionId: string; priority: number }) =>
            priorityApi.updatePriority(storyId, sectionId, priority).then((res) => res.data.data!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRIORITY_KEYS.all });
            toast.success('Priority updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update priority');
        },
    });
};
