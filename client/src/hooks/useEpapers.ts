import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { epaperApi } from '@/services/epaperService';
import { toast } from 'sonner';

const EPAPER_KEYS = {
    all: ['epapers'] as const,
    list: (filters: any) => [...EPAPER_KEYS.all, 'list', filters] as const,
};

export const useEpapers = (filters?: any) => {
    return useQuery({
        queryKey: EPAPER_KEYS.list(filters),
        queryFn: () => epaperApi.getEpapers(filters).then((res) => res.data.data!),
    });
};

export const useCreateEpaper = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: epaperApi.createEpaper,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EPAPER_KEYS.all });
            toast.success('E-Paper created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create E-Paper');
        },
    });
};

export const useUploadEpaperPdf = () => {
    return useMutation({
        mutationFn: ({ id, file }: { id: string; file: File }) => epaperApi.uploadPdf(id, file),
    });
};

export const useUploadEpaperCover = () => {
    return useMutation({
        mutationFn: ({ id, file }: { id: string; file: File }) => epaperApi.uploadCover(id, file),
    });
};
