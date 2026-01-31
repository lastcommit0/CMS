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

const router = Router();


router.use('/auth', requireAuth,  authRoute);
router.use('/story', requireAuth, storyRoute);
router.use('/section', requireAuth, storySectionRoute);
router.use('/user', requireAuth, userRoute);
router.use('/category', requireAuth, categoryRoute);
router.use('/poll', requireAuth, pollRoute);
router.use('/meta', requireAuth, metaRoute);
router.use('/priority', requireAuth, priorityRoute);
router.use('/report', requireAuth, reportRoute);
router.use('/storage', requireAuth, storageRoute);
router.use('/search', searchRoute);
router.use('/epapers', requireAuth, epaperRoute);
router.use('/status', worklowRoute)

export default router;