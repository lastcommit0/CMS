import { Router } from "express";
import authRoute from "./authRoute";
import storyRoute from "./storyRoute";
import storySectionRoute from "./sectionRoute";
import userRoute from "./userRoute";
import categoryRoute from "./categoryRoute";
import pollRoute from "./pollRoute";
import metaRoute from "./metaRoute";
import priorityRoute from "./priorityRoute";
import reportRoute from "./reportRoute";
import searchRoute from "./searchRoute";
import epaperRoute from "./epaperRoute";
import storageRoute from "./storageRoute";
import worklowRoute from "./workflowRoute";
import { requireAuth } from "../middleware/authMiddleware";
import { apiLimiter, authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.use('/auth', authLimiter, authRoute);

router.use('/story', apiLimiter, requireAuth, storyRoute);
router.use('/section', apiLimiter, requireAuth, storySectionRoute);
router.use('/user', apiLimiter, requireAuth, userRoute);
router.use('/category', apiLimiter, requireAuth, categoryRoute);
router.use('/poll', apiLimiter, requireAuth, pollRoute);
router.use('/meta', apiLimiter, requireAuth, metaRoute);
router.use('/priority', apiLimiter, requireAuth, priorityRoute);
router.use('/report', apiLimiter, requireAuth, reportRoute);
router.use('/storage', apiLimiter, requireAuth, storageRoute);
router.use('/search', apiLimiter, requireAuth, searchRoute);
router.use('/epapers', apiLimiter, requireAuth, epaperRoute);
router.use('/status', apiLimiter, requireAuth, worklowRoute);

export default router;
