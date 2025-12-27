import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as priorityController from "../controllers/priorityController";

const router = Router();


router.get("/priorities", catchAsync(priorityController.getPriorities));
router.post("/priority/:storyId/:sectionId", catchAsync(priorityController.updatePriority));
router.post("/priority/bulk", catchAsync(priorityController.bulkUpdatePriorities));


export default router;