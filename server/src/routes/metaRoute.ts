import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as metaController from "../controllers/metaController";

const router = Router();


router.get("/meta/:storyId", catchAsync(metaController.getMetaTags));
router.post("/meta/:storyId", catchAsync(metaController.upsertMetaTags));
router.post("/meta/bulk", catchAsync(metaController.bulkGenerateMetaTags));


export default router;