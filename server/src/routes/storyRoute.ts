import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as storyController from "../controllers/storyController";

const router = Router();


router.get("/", catchAsync(storyController.getStories));
router.get("/:id", catchAsync(storyController.getStoryById));
router.post("/create", catchAsync(storyController.createStory));
router.post("/:id", catchAsync(storyController.updateStory));
router.delete("/:id", catchAsync(storyController.deleteStory));
router.get("/stats", catchAsync(storyController.stats));
router.post("/:id/assets", catchAsync(storyController.addStoryAsset));
router.delete("/:id/asset/:assetId", catchAsync(storyController.deleteStoryAsset));
router.post("/bulk", catchAsync(storyController.bulkUpdateStories));
router.delete("/bulk", catchAsync(storyController.bulkDeleteStories));

export default router;