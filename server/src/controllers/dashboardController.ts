import { Request, Response } from 'express';
import { StoryService } from '../services/storyService';

export const dashboardController = {
    async getDashboardData(req: Request, res: Response) {
        const { search, startDate, endDate, productType } = req.query;

        const filters: any = {};

        if (search) {
            filters.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { id: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        if (productType && productType !== 'all') {
            filters.storyType = (productType as string).toUpperCase();
        }

        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) filters.createdAt.gte = new Date(startDate as string);
            if (endDate) filters.createdAt.lte = new Date(endDate as string);
        }

        const { stories } = await StoryService.listStories(filters, { skip: 0, take: 50 });

        // Map stories to newsData format expected by frontend
        const news = stories.map(s => ({
            id: s.id,
            title: s.title,
            timestamp: s.createdAt,
            providedBy: s.author?.name || 'Unknown',
            editedBy: s.author?.name || 'Unknown', // Placeholder
            desk: 'News' // Placeholder
        }));

        res.json({
            success: true,
            news
        });
    }
};
