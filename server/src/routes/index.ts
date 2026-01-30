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

const router = Router();


router.use('/auth', authRoute);
router.use('/story', storyRoute);
router.use('/section', storySectionRoute);
router.use('/user', userRoute);
router.use('/category', categoryRoute);
router.use('/poll', pollRoute);
router.use('/meta', metaRoute);
router.use('/priority', priorityRoute);
router.use('/report', reportRoute);
router.use('/', searchRoute);
router.use('/epapers', epaperRoute);


export default router;