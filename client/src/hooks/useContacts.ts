import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contactApi } from '@/services/contactService';
import { toast } from 'sonner';

const CONTACT_KEYS = {
    all: ['contacts'] as const,
    list: (filters: any) => [...CONTACT_KEYS.all, 'list', filters] as const,
};

export const useContacts = (filters?: any) => {
    return useQuery({
        queryKey: CONTACT_KEYS.list(filters),
        queryFn: () => contactApi.getMessages(filters).then((res) => res.data.data!),
    });
};

export const useDeleteContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: contactApi.deleteMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACT_KEYS.all });
            toast.success('Message deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete message');
        },
    });
};
