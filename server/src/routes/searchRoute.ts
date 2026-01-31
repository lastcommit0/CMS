import { Router } from 'express';
import catchAsync from '../middleware/catchAsync';
import { searchController } from '../controllers/searchController';

const router = Router();

router.get('/', catchAsync(searchController.globalSearch));

router.get('/suggestions', catchAsync(searchController.getSuggestions));

export default router;
