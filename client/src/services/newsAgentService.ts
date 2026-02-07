import api from '@/lib/api/axiosClient';

export interface GeneratedStory {
    title: string;
    shortTitle: string;
    slug: string;
    excerpt: string;
    content: {
        version: string;
        blocks: Array<{
            id: string;
            type: string;
            data: Record<string, unknown>;
        }>;
    };
    highlights?: {
        version: string;
        blocks: Array<{
            id: string;
            type: string;
            data: Record<string, unknown>;
        }>;
    };
    metaTags: {
        metaKeywords: string;
        metaDescription: string;
        googleBot: string;
        excludeIA: boolean;
    };
    sources: Array<{
        title: string;
        url: string;
        published_at?: string;
        snippet?: string;
    }>;
    category: string;
    mandal: string;
    district: string;
}

export interface TrendingTopic {
    topic: string;
    description: string;
    category: string;
}

export interface GenerateStoryRequest {
    topic: string;
    category?: string;
    mandal?: string;
    district?: string;
    as_of?: string;
}

export interface StreamEvent {
    event: 'start' | 'progress' | 'complete' | 'error';
    data: Record<string, unknown>;
}

export const newsAgentApi = {
    /**
     * Generate a news story (non-streaming)
     */
    generateStory: async (request: GenerateStoryRequest): Promise<GeneratedStory> => {
        const response = await api.post('/news-agent/generate', request);
        return response.data;
    },

    /**
     * Generate a news story with streaming progress
     */
    generateStoryStream: async (
        request: GenerateStoryRequest,
        onEvent: (event: StreamEvent) => void
    ): Promise<GeneratedStory | null> => {
        const response = await fetch('/api/news-agent/generate/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
            credentials: 'include'
        });

        if (!response.ok || !response.body) {
            throw new Error('Failed to connect to news agent');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result: GeneratedStory | null = null;

        try {
            let buffer = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const event = JSON.parse(line.slice(6)) as StreamEvent;
                            onEvent(event);
                            if (event.event === 'complete') {
                                result = event.data as unknown as GeneratedStory;
                            }
                        } catch (e) {
                            // Ignore parse errors
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        return result;
    },

    /**
     * Get trending topics for a category
     */
    getTrendingTopics: async (category: string = 'General', count: number = 5): Promise<TrendingTopic[]> => {
        const response = await api.post('/news-agent/trending', { category, count });
        return response.data;
    },

    /**
     * Check if news agent is available
     */
    healthCheck: async (): Promise<boolean> => {
        try {
            await api.get('/news-agent/health');
            return true;
        } catch {
            return false;
        }
    }
};
