import { Request, Response } from 'express';
import { SearchService } from '../services/searchServices';
import { searchSchema } from '../validators/searchSchema';

export const searchController = {

    async globalSearch(req: Request, res: Response) {
        const params = searchSchema.parse(req.query);

        const results = await SearchService.globalSearch({
            query: params.q,
            type: params.type,
            limit: params.limit,
            offset: params.offset,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            section: params.section,
        });

        res.json({
            success: true,
            data: results,
        });
    },


    async getSuggestions(req: Request, res: Response) {
        const { q } = req.query;

        if (!q || typeof q !== 'string' || q.trim().length < 2) {
            res.json({
                success: true,
                data: [],
            });
            return;
        }

        const suggestions = await SearchService.autoSuggest(q);

        res.json({
            success: true,
            data: suggestions,
        });
    },
};
