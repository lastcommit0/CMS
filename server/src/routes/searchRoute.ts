import { Router } from 'express';
import catchAsync from '../middleware/catchAsync';
import { searchController } from '../controllers/searchController';

const router = Router();

router.get('/search', catchAsync(searchController.globalSearch));

router.get('/search/suggestions', catchAsync(searchController.getSuggestions));

export default router;
