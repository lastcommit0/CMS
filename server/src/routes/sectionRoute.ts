import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as sectionController from "../controllers/sectionController";
import * as storySectionController from "../controllers/storySectionController";

const router = Router();


router.get("/sections", catchAsync(sectionController.getSections));
router.get("/section/:id", catchAsync(sectionController.getSection));
router.post("/section", catchAsync(sectionController.createSection));
router.post("/section/:id", catchAsync(sectionController.updateSection));
router.delete("/section/:id", catchAsync(sectionController.deleteSection));
router.post("/section/:id/story", catchAsync(sectionController.addStory));
router.post("/section/:id/story/:storyId/featured", catchAsync(sectionController.setFeatured));
router.post("/section/:id/story/:storyId/section", catchAsync(storySectionController.addStorySection));





export default router;