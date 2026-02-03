import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as storyController from "../controllers/storyController";

const router = Router();


router.get("/stories", catchAsync(storyController.getStories));
router.get("/story/:id", catchAsync(storyController.getStoryById));
router.post("/story", catchAsync(storyController.createStory));
router.post("/story/:id", catchAsync(storyController.updateStory));
router.delete("/story/:id", catchAsync(storyController.deleteStory));
router.get("/story/stats", catchAsync(storyController.stats));
router.post("/story/:id/assets", catchAsync(storyController.addStoryAsset));
router.delete("/story/:id/asset/:assetId", catchAsync(storyController.deleteStoryAsset));
router.post("/story/bulk", catchAsync(storyController.bulkUpdateStories));
router.delete("/story/bulk", catchAsync(storyController.bulkDeleteStories));


export default router;