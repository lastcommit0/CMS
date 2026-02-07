import { Request, Response, NextFunction } from 'express';

const NEWS_AGENT_URL = process.env.NEWS_AGENT_URL || 'http://localhost:8000';

interface GenerateStoryRequest {
    topic: string;
    category?: string;
    mandal?: string;
    district?: string;
    as_of?: string;
}

interface TrendingTopicsRequest {
    category?: string;
    count?: number;
}

export class NewsAgentController {

    static async generateStory(req: Request, res: Response, next: NextFunction) {
        try {
            const { topic, category, mandal, district, as_of } = req.body as GenerateStoryRequest;

            if (!topic) {
                return res.status(400).json({ error: 'Topic is required' });
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000);

            const response = await fetch(`${NEWS_AGENT_URL}/generate-story`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    category: category || 'General',
                    mandal: mandal || '',
                    district: district || '',
                    as_of: as_of || new Date().toISOString().split('T')[0]
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: 'Failed to generate story' }));
                return res.status(response.status).json(error);
            }

            const data = await response.json();
            return res.json(data);
        } catch (error: any) {
            console.error('News agent error:', error.message);
            if (error.name === 'AbortError') {
                return res.status(504).json({ error: 'Request timed out' });
            }
            return res.status(500).json({ error: 'Failed to generate story' });
        }
    }

    /**
     * Generate a news story with streaming progress
     */
    static async generateStoryStream(req: Request, res: Response, next: NextFunction) {
        try {
            const { topic, category, mandal, district, as_of } = req.body as GenerateStoryRequest;

            if (!topic) {
                return res.status(400).json({ error: 'Topic is required' });
            }

            // Set up SSE headers
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000);

            const response = await fetch(`${NEWS_AGENT_URL}/generate-story/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    category: category || 'General',
                    mandal: mandal || '',
                    district: district || '',
                    as_of: as_of || new Date().toISOString().split('T')[0]
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok || !response.body) {
                res.write(`data: ${JSON.stringify({ event: 'error', data: { message: 'Failed to connect to agent' } })}\n\n`);
                res.end();
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    res.write(decoder.decode(value, { stream: true }));
                }
            } finally {
                reader.releaseLock();
                res.end();
            }

        } catch (error: any) {
            console.error('News agent stream error:', error.message);
            res.write(`data: ${JSON.stringify({ event: 'error', data: { message: error.message } })}\n\n`);
            res.end();
        }
    }

    /**
     * Get trending topics for a category
     */
    static async getTrendingTopics(req: Request, res: Response, next: NextFunction) {
        try {
            const { category, count } = req.body as TrendingTopicsRequest;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(`${NEWS_AGENT_URL}/trending-topics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: category || 'General',
                    count: count || 5
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: 'Failed to fetch trending topics' }));
                return res.status(response.status).json(error);
            }

            const data = await response.json();
            return res.json(data);
        } catch (error: any) {
            console.error('Trending topics error:', error.message);
            return res.status(500).json({ error: 'Failed to fetch trending topics' });
        }
    }

    /**
     * Health check for the news agent service
     */
    static async healthCheck(req: Request, res: Response, next: NextFunction) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${NEWS_AGENT_URL}/health`, { signal: controller.signal });
            clearTimeout(timeoutId);

            const data = await response.json();
            return res.json(data);
        } catch (error: any) {
            return res.status(503).json({ status: 'unavailable', error: error.message });
        }
    }
}
