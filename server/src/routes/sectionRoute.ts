import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import { SectionController } from "../controllers/sectionController";

const router = Router()

router.get("/section/:id", catchAsync(SectionController.getSection))
router.post("/section", catchAsync(SectionController.createSection))
router.post("/section/:id", catchAsync(SectionController.updateSection))
router.delete("/section/:id", catchAsync(SectionController.deleteSection))
router.post("/section/:id/story/:storyId/featured", catchAsync(SectionController.setFeatured))
router.post("/section/:id/story/:storyId/section", catchAsync(SectionController.addStorySection))


export default router;