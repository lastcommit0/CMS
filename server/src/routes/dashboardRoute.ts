import { Router } from 'express';
import catchAsync from '../middleware/catchAsync';
import { dashboardController } from '../controllers/dashboardController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, catchAsync(dashboardController.getDashboardData));

export default router;
