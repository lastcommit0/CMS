import { Router } from 'express';
import { NewsAgentController } from '../controllers/newsAgentController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Generate a news story
router.post('/generate', NewsAgentController.generateStory);

// Generate a news story with streaming
router.post('/generate/stream', NewsAgentController.generateStoryStream);

// Get trending topics
router.post('/trending', NewsAgentController.getTrendingTopics);

// Health check
router.get('/health', NewsAgentController.healthCheck);

export default router;
