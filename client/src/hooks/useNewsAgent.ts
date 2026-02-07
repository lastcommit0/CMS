import { useMutation, useQuery } from '@tanstack/react-query';
import { newsAgentApi } from '@/services/newsAgentService';
import type { GenerateStoryRequest, GeneratedStory, StreamEvent } from '@/services/newsAgentService';
import { useState, useCallback } from 'react';

/**
 * Hook to check news agent health
 */
export function useNewsAgentHealth() {
    return useQuery({
        queryKey: ['news-agent-health'],
        queryFn: newsAgentApi.healthCheck,
        staleTime: 30000,
        retry: false
    });
}

/**
 * Hook to fetch trending topics
 */
export function useTrendingTopics(category: string = 'General') {
    return useQuery({
        queryKey: ['trending-topics', category],
        queryFn: () => newsAgentApi.getTrendingTopics(category),
        staleTime: 60000
    });
}

/**
 * Hook to generate a story (non-streaming)
 */
export function useGenerateStory() {
    return useMutation({
        mutationFn: newsAgentApi.generateStory
    });
}

/**
 * Hook to generate a story with streaming progress
 */
export function useGenerateStoryStream() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState<{
        node: string;
        queriesCount: number;
        evidenceCount: number;
        sectionsCount: number;
        mode: string;
    } | null>(null);
    const [result, setResult] = useState<GeneratedStory | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generate = useCallback(async (request: GenerateStoryRequest) => {
        setIsGenerating(true);
        setProgress(null);
        setResult(null);
        setError(null);

        try {
            const story = await newsAgentApi.generateStoryStream(request, (event: StreamEvent) => {
                switch (event.event) {
                    case 'start':
                        setProgress({ node: 'Starting', queriesCount: 0, evidenceCount: 0, sectionsCount: 0, mode: '' });
                        break;
                    case 'progress':
                        setProgress({
                            node: (event.data.node as string) || '',
                            queriesCount: (event.data.queries_count as number) || 0,
                            evidenceCount: (event.data.evidence_count as number) || 0,
                            sectionsCount: (event.data.sections_count as number) || 0,
                            mode: (event.data.mode as string) || ''
                        });
                        break;
                    case 'error':
                        setError((event.data.message as string) || 'Unknown error occurred');
                        break;
                }
            });

            if (story) {
                setResult(story);
            }
        } catch (e: any) {
            setError(e.message || 'Failed to generate story');
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const reset = useCallback(() => {
        setIsGenerating(false);
        setProgress(null);
        setResult(null);
        setError(null);
    }, []);

    return {
        generate,
        reset,
        isGenerating,
        progress,
        result,
        error
    };
}
